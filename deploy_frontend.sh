#!/bin/bash

set -e

# Hardcoded stack name
stack_name="visitor-management"

echo "--- Getting AWS Stack Outputs ---"

# Function to get stack output by key
get_stack_output() {
  local output_key="$1"
  aws cloudformation describe-stacks --stack-name "$stack_name" --query "Stacks[0].Outputs[?OutputKey=='$output_key'].OutputValue" --output text
}

# Get the API Gateway URL from the stack
api_gateway_endpoint=$(get_stack_output "APIGatewayEndpoint")
echo "API Gateway URL: $api_gateway_endpoint"

# Get Cognito config from the stack
user_pool_id=$(get_stack_output "UserPoolId")
echo "User Pool Id: $user_pool_id"
user_pool_client_id=$(get_stack_output "UserPoolClientId")
echo "User Pool Client Id: $user_pool_client_id"
user_pool_domain_url=$(get_stack_output "UserPoolDomainUrl")
echo "User Pool Domain Url: $user_pool_domain_url"
authority_url=$(get_stack_output "AuthorityUrl")
echo "Authority Url: $authority_url"

# Get the CloudFront Distribution ID from the stack
cloudfront_distribution_id=$(get_stack_output "CloudFrontDistributionId")
echo "CloudFront Distribution ID: $cloudfront_distribution_id"

# Get the S3 Bucket Name from the stack
s3_bucket_name=$(get_stack_output "WebS3BucketName")
echo "S3 Bucket Name: $s3_bucket_name"

echo "--- Frontend Build and Configuration ---"

# Move to frontend and install dependencies
cd frontend/ || exit 1
echo "Installing frontend dependencies (npm install)..."
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
  echo "Creating .env file..."
  touch .env
fi

# Add the API Gateway endpoint to the .env file
echo "Adding API Gateway endpoint to .env..."
echo "VUE_APP_API_ENDPOINT=$api_gateway_endpoint" > .env

# Add Cognito config to the .env file
echo "Adding Cognito config to .env..."
echo "VUE_APP_COGNITO_USER_POOL_ID=$user_pool_id" >> .env
echo "VUE_APP_COGNITO_USER_POOL_CLIENT_ID=$user_pool_client_id" >> .env
echo "VUE_APP_COGNITO_USER_POOL_DOMAIN_URL=$user_pool_domain_url" >> .env
echo "VUE_APP_COGNITO_AUTHORITY_URL=$authority_url" >> .env

# Confirm that the endpoint has been added to the .env file
echo "Contents of .env:"
cat .env

# Build the frontend
echo "Building the frontend (npm run build)..."
npm run build
build_status=$?
if [ $build_status -ne 0 ]; then
  echo "Error: Frontend build failed. Aborting deployment."
  exit 1
fi

cd dist/ || exit 1

echo "--- Deploying Frontend to S3 ---"

# Sync distribution with S3
echo "Syncing build output to S3 bucket: s3://$s3_bucket_name/"
aws s3 sync . s3://$s3_bucket_name/

echo "--- Invalidating CloudFront Cache ---"

# Create cloudfront invalidation
echo "Creating CloudFront invalidation for distribution: $cloudfront_distribution_id"
invalidation_output=$(aws cloudfront create-invalidation --distribution-id "$cloudfront_distribution_id" --paths "/*")
invalidation_id=$(echo "$invalidation_output" | grep -oP '(?<="Id": ")[^"]+')
echo "Invalidation ID: $invalidation_id"

# Wait for cloudfront invalidation to complete
echo "Waiting for CloudFront invalidation to complete..."
aws cloudfront wait invalidation-completed --distribution-id "$cloudfront_distribution_id" --id "$invalidation_id"

# Get cloudfront domain name
cloudfront_domain_name=$(aws cloudfront list-distributions --query "DistributionList.Items[?Id=='$cloudfront_distribution_id'].DomainName" --output text)
echo "CloudFront Domain Name: $cloudfront_domain_name"

echo "--- Deployment Complete ---"
echo "Please visit your CloudFront URL to test: https://$cloudfront_domain_name"