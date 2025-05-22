#!/bin/bash
# This script builds and deploys the backend using AWS SAM,
# and then deploys the frontend.
#
# It assumes you have:
# - AWS CLI configured with appropriate credentials.
# - SAM CLI installed.
# - A deploy_frontend.sh script in the same directory.
# - STACK_NAME and AWS_REGION environment variables set.

set -e  # Exit immediately if a command exits with a non-zero status.
# set -x # Uncomment this line to enable verbose output (for debugging).

## ----- Function Definitions -----
# Function to get an output value from a CloudFormation stack
get_stack_output() {
  local output_key="$1"
  aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query "Stacks[0].Outputs[?OutputKey=='$output_key'].OutputValue" --output text
}

## ----- Backend Deployment (SAM) -----
export STACK_NAME="visitor-management"
export DOMAIN_NAME="alphinecodetech.click"
export SUB_DOMAIN=vms.$DOMAIN_NAME
export APP_FRONTEND_BASE_URL=https://$SUB_DOMAIN
export COGNITO_CUSTOM_DOMAIN_NAME=login.vms.$DOMAIN_NAME

echo "Building and deploying the SAM application (backend)..."
echo "Running: sam build"
sam build
echo "Running: sam deploy --stack-name \"$STACK_NAME\""

echo "AWS_REGION is: $AWS_REGION"

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
sam_deploy_output=$(
  sam deploy \
    --stack-name "$STACK_NAME" \
    --region "$AWS_REGION" \
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
    --disable-rollback \
    2>&1
)

sam_deploy_exit_code=$?
echo "$sam_deploy_output"
set -e

if [ $sam_deploy_exit_code -ne 0 ]; then
  echo "SAM Deploy failed with exit code: $sam_deploy_exit_code"
  # Check if the failure was due to no changes detected
  if echo "$sam_deploy_output" | grep -q "No changes to deploy"; then
    echo "No infrastructure changes detected. Proceeding with frontend deployment."
  else
    echo "An actual error occurred during SAM deployment. Stopping."
    echo "Error details:"
    echo "$sam_deploy_output"
    exit 1
  fi
else
  echo "Backend deployment (SAM) successful. Proceeding with frontend deployment..."
fi

# --- Cognito User Creation---
user_pool_id=$(get_stack_output "UserPoolId")
echo "User Pool Id: $user_pool_id"

echo "Checking if admin user already exists..."
if aws cognito-idp admin-get-user \
  --user-pool-id "$user_pool_id" \
  --username admin@$DOMAIN_NAME 2>/dev/null; then
  echo "Admin user already exists. Skipping creation."
else
  echo "Creating Admin User"
  aws cognito-idp admin-create-user \
    --user-pool-id "$user_pool_id" \
    --username admin@$DOMAIN_NAME \
    --user-attributes Name=email,Value=admin@$DOMAIN_NAME \
                     Name=email_verified,Value=true \
                     Name=given_name,Value=Admin \  
                     Name=family_name,Value=User \
                     Name=phone_number,Value=+15551234567 \
    --temporary-password AdminPass123! \
    --message-action SUPPRESS

  echo "Adding Admin User to AdminUserGroup"
  aws cognito-idp admin-add-user-to-group \
    --user-pool-id "$user_pool_id" \
    --username admin@$DOMAIN_NAME \
    --group-name admin
fi


## ----- Frontend Deployment -----
echo "Deploying the frontend..."
if [ -f "./deploy_frontend.sh" ]; then
  ./deploy_frontend.sh
else
  echo "Error: deploy_frontend.sh not found. Skipping frontend deployment."
fi

echo "Deployment complete."