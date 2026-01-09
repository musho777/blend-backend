#!/bin/bash

# Script to configure Google Cloud Storage bucket for public access
# This is required when uniform bucket-level access is enabled

echo "=== Configuring GCS Bucket for Public Access ==="
echo ""

BUCKET_NAME="blend1"
PROJECT_ID="105943171338601188249"

echo "Bucket: $BUCKET_NAME"
echo "Project: $PROJECT_ID"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed"
    echo ""
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    echo ""
    echo "Or configure public access via the Google Cloud Console:"
    echo "1. Go to: https://console.cloud.google.com/storage/browser/$BUCKET_NAME"
    echo "2. Click on the 'Permissions' tab"
    echo "3. Click 'Grant Access'"
    echo "4. Add principal: 'allUsers'"
    echo "5. Select role: 'Storage Object Viewer'"
    echo "6. Click 'Save'"
    exit 1
fi

echo "Configuring IAM policy to allow public read access..."
echo ""

# Add allUsers as Storage Object Viewer
gcloud storage buckets add-iam-policy-binding gs://$BUCKET_NAME \
    --member=allUsers \
    --role=roles/storage.objectViewer \
    --project=$PROJECT_ID

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully configured bucket for public access!"
    echo ""
    echo "All objects in the bucket are now publicly readable."
else
    echo ""
    echo "❌ Failed to configure bucket access"
    echo ""
    echo "You can configure it manually via the Google Cloud Console:"
    echo "1. Go to: https://console.cloud.google.com/storage/browser/$BUCKET_NAME"
    echo "2. Click on the 'Permissions' tab"
    echo "3. Click 'Grant Access'"
    echo "4. Add principal: 'allUsers'"
    echo "5. Select role: 'Storage Object Viewer'"
    echo "6. Click 'Save'"
fi
