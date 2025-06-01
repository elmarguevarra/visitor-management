set -e 

get_stack_output() {
  local output_key="$1"
  aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query "Stacks[0].Outputs[?OutputKey=='$output_key'].OutputValue" --output text
}

echo "Plan deploy SAM application (backend)..."

## === Backend Build (SAM) ===
echo "Running: sam build"
sam build

## === Infra Plan Deployment (SAM) ===

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

# --- Plan Deploy Main Application Stack ---
set +e

echo "Running: sam deploy --no-execute-changeset"

sam deploy \
  --no-execute-changeset \
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
  2>&1

set -e