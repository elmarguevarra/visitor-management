set -e 

get_stack_output() {
  local output_key="$1"
  aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query "Stacks[0].Outputs[?OutputKey=='$output_key'].OutputValue" --output text
}

echo "Building and deploying the SAM application (backend)..."

## === Backend Build (SAM) ===
echo "Running: sam build"
sam build --cached

## === Infra Deployment (SAM) ===

# --- Hosted Zone ---
domain_name_r53="${DOMAIN_NAME}."

existing_zone=$(aws route53 list-hosted-zones-by-name \
  --dns-name "$domain_name_r53" \
  --query "HostedZones[?Name=='$domain_name_r53'].Id" \
  --output text)

if [ -z "$existing_zone" ]; then
  echo "Hosted zone does not exist. Creating one..."
  create_hosted_zone=true
else
  echo "Hosted zone exists: $existing_zone"
  create_hosted_zone=false
  hosted_zone_id=$(basename "$existing_zone")
  echo "Hosted zone id: $hosted_zone_id"
fi

# --- Public Certificate ---
public_cert_region="us-east-1"
existing_cert_arn=$(aws acm list-certificates \
  --region $public_cert_region \
  --query "CertificateSummaryList[?DomainName=='$DOMAIN_NAME'] | [0].CertificateArn" \
  --output text
)

if [ -z "$existing_cert_arn" ]; then
  echo "Public Certificate does not exist."
  echo "Manually create a public cert in us-east-1 then rerun build"
  echo "(sample domain name patterns: $DOMAIN_NAME, *.$DOMAIN_NAME, *.vms.$DOMAIN_NAME)"
  exit 1
else
  echo "Public Certificate exists: $existing_cert_arn"
fi

# --- Deploy Main Application Stack ---
set +e

echo "Running: sam deploy"

sam_deploy_output=$(
  sam deploy \
    --stack-name "$STACK_NAME" \
    --region "$AWS_REGION" \
    --s3-prefix visitor-management \
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
    --parameter-overrides \
        BaseDomain=$DOMAIN_NAME \
        SubDomain=$SUB_DOMAIN \
        CognitoCustomDomainName=$COGNITO_CUSTOM_DOMAIN_NAME \
        CreateHostedZone=$create_hosted_zone \
        HostedZoneId=$hosted_zone_id \
        AcmCertificateArn=$existing_cert_arn \
        GoogleClientId=$GOOGLE_CLIENT_ID \
        GoogleClientSecret=$GOOGLE_CLIENT_SECRET \
        SysNotifEmailAddress=$SYS_NOTIF_EMAIL_ADDRESS \
    2>&1
)

sam_deploy_exit_code=$?
echo "$sam_deploy_output"
set -e

if [ $sam_deploy_exit_code -ne 0 ]; then
  echo "SAM Deploy failed with exit code: $sam_deploy_exit_code"
  # Check if the failure was due to no changes detected
  if echo "$sam_deploy_output" | grep -q "No changes to deploy"; then
    echo "No infrastructure changes detected."
  else
    echo "An actual error occurred during SAM deployment. Stopping."
    echo "Error details:"
    echo "$sam_deploy_output"
    exit 1
  fi
else
  echo "Backend and Infra deployment (SAM) successful. Proceeding Cognito User creation..."
fi

# --- Cognito User Creation---
user_pool_id=$(get_stack_output "UserPoolId")
echo "User Pool Id: $user_pool_id"

echo "Checking if Admin user already exists..."
if aws cognito-idp admin-get-user \
  --user-pool-id "$user_pool_id" \
  --username admin@$DOMAIN_NAME 2>/dev/null; then
  echo "Admin user already exists. Skipping creation."
else
  echo "Creating Admin User"
  aws cognito-idp admin-create-user \
      --user-pool-id "$user_pool_id" \
      --username admin@$DOMAIN_NAME \
      --user-attributes \
        Name=email,Value=admin@$DOMAIN_NAME \
        Name=email_verified,Value=true \
        Name=given_name,Value=Admin \
        Name=family_name,Value=User \
      --temporary-password $COGNITO_USERS_INIT_PASSWORD \
      --message-action SUPPRESS

  echo "Adding Admin User to Admin User Group"
  aws cognito-idp admin-add-user-to-group \
    --user-pool-id "$user_pool_id" \
    --username admin@$DOMAIN_NAME \
    --group-name admin
fi

echo "Checking if Guard user already exists..."
if aws cognito-idp admin-get-user \
  --user-pool-id "$user_pool_id" \
  --username guard@$DOMAIN_NAME 2>/dev/null; then
  echo "Guard user already exists. Skipping creation."
else
  echo "Creating Guard User"
  aws cognito-idp admin-create-user \
      --user-pool-id "$user_pool_id" \
      --username guard@$DOMAIN_NAME \
      --user-attributes \
        Name=email,Value=guard@$DOMAIN_NAME \
        Name=email_verified,Value=true \
        Name=given_name,Value=Guard \
        Name=family_name,Value=User \
      --temporary-password $COGNITO_USERS_INIT_PASSWORD \
      --message-action SUPPRESS

  echo "Adding Guard User to Guard User Group"
  aws cognito-idp admin-add-user-to-group \
    --user-pool-id "$user_pool_id" \
    --username guard@$DOMAIN_NAME \
    --group-name guard
fi

echo "Checking if Resident user already exists..."
if aws cognito-idp admin-get-user \
  --user-pool-id "$user_pool_id" \
  --username resident@$DOMAIN_NAME 2>/dev/null; then
  echo "Resident user already exists. Skipping creation."
else
  echo "Creating Resident User"
  aws cognito-idp admin-create-user \
      --user-pool-id "$user_pool_id" \
      --username resident@$DOMAIN_NAME \
      --user-attributes \
        Name=email,Value=resident@$DOMAIN_NAME \
        Name=email_verified,Value=true \
        Name=given_name,Value=Resident \
        Name=family_name,Value=User \
      --temporary-password $COGNITO_USERS_INIT_PASSWORD \
      --message-action SUPPRESS

  echo "Adding Resident User to Resident User Group"
  aws cognito-idp admin-add-user-to-group \
    --user-pool-id "$user_pool_id" \
    --username resident@$DOMAIN_NAME \
    --group-name resident
fi