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
sam deploy --region $AWS_REGION || true

# --- Frontend Deployment ---
echo "Deploying the frontend..."
if [ -f "./deploy_frontend.sh" ]; then
  ./deploy_frontend.sh
else
  echo "Error: deploy_frontend.sh not found. Skipping frontend deployment."
fi

echo "Deployment complete."
