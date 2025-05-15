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

# --- Backend Deployment (SAM) ---
export STACK_NAME="visitor-management"

echo "Building and deploying the SAM application (backend)..."
echo "Running: sam build"
sam build
echo "Running: sam deploy --stack-name \"$STACK_NAME\""

echo "AWS_REGION is: $AWS_REGION"

SAM_DEPLOY_OUTPUT=$(sam deploy --stack-name "$STACK_NAME" --region "$AWS_REGION" --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND 2>&1)
SAM_DEPLOY_EXIT_CODE=$?
echo "$SAM_DEPLOY_OUTPUT"

if [ $SAM_DEPLOY_EXIT_CODE -ne 0 ]; then
  echo "SAM Deploy failed with exit code: $SAM_DEPLOY_EXIT_CODE"
  # Check if the failure was due to no changes detected
  if [[ "$SAM_DEPLOY_OUTPUT" == "Error: No changes to deploy. Stack $STACK_NAME is up to date" ]]; then
    echo "No infrastructure changes detected. Proceeding with frontend deployment."
  else
    echo "An actual error occurred during SAM deployment. Stopping."
    echo "Error details:"
    echo "$SAM_DEPLOY_OUTPUT"
    exit 1
  fi
else
  echo "Backend deployment (SAM) successful. Proceeding with frontend deployment..."
fi

# --- Frontend Deployment ---
echo "Deploying the frontend..."
if [ -f "./deploy_frontend.sh" ]; then
  ./deploy_frontend.sh
else
  echo "Error: deploy_frontend.sh not found. Skipping frontend deployment."
fi

echo "Deployment complete."
