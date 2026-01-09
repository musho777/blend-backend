#!/bin/bash

# Test script for Google Cloud Storage integration
# This script tests uploading a product and category image to GCS

echo "=== Testing Google Cloud Storage Integration ==="
echo ""

# First, let's login to get JWT token
echo "1. Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }')

# Extract the access token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to login. Please check your credentials."
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Successfully logged in"
echo ""

# Get categories to find a category ID
echo "2. Fetching categories..."
CATEGORIES=$(curl -s http://localhost:3000/categories)
CATEGORY_ID=$(echo $CATEGORIES | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$CATEGORY_ID" ]; then
  echo "⚠️  No categories found. Let's create one first."

  # Create a test image file
  echo "Creating test image for category..."
  # Create a simple 100x100 red square PNG using base64
  echo "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8/5+hnoEIwDiqkL4KAcT9GO0U4BxoAAAAAElFTkSuQmCC" | base64 -d > /tmp/test-category-image.png

  echo "3. Testing category creation with GCS upload..."
  CATEGORY_RESPONSE=$(curl -s -X POST http://localhost:3000/categories \
    -H "Authorization: Bearer $TOKEN" \
    -F "title=Test GCS Category" \
    -F "slug=test-gcs-category" \
    -F "image=@/tmp/test-category-image.png")

  echo "Category creation response:"
  echo $CATEGORY_RESPONSE | jq '.' 2>/dev/null || echo $CATEGORY_RESPONSE
  echo ""

  # Extract category ID
  CATEGORY_ID=$(echo $CATEGORY_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

  # Check if image URL contains Google Cloud Storage
  IMAGE_URL=$(echo $CATEGORY_RESPONSE | grep -o '"image":"[^"]*' | cut -d'"' -f4)
  if [[ $IMAGE_URL == *"storage.googleapis.com"* ]]; then
    echo "✅ Category image uploaded to Google Cloud Storage!"
    echo "   URL: $IMAGE_URL"
  else
    echo "❌ Image was not uploaded to GCS. URL: $IMAGE_URL"
  fi
  echo ""
fi

if [ -z "$CATEGORY_ID" ]; then
  echo "❌ Failed to get category ID"
  exit 1
fi

echo "Using category ID: $CATEGORY_ID"
echo ""

# Create a test image file for product
echo "Creating test image for product..."
echo "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FAP2/DNKG9KdZAAAAAElFTkSuQmCC" | base64 -d > /tmp/test-product-image.png

echo "4. Testing product creation with GCS upload..."
PRODUCT_RESPONSE=$(curl -s -X POST http://localhost:3000/products \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Test GCS Product" \
  -F "price=99.99" \
  -F "stock=10" \
  -F "categoryId=$CATEGORY_ID" \
  -F "isFeatured=true" \
  -F "images=@/tmp/test-product-image.png")

echo "Product creation response:"
echo $PRODUCT_RESPONSE | jq '.' 2>/dev/null || echo $PRODUCT_RESPONSE
echo ""

# Check if image URLs contain Google Cloud Storage
IMAGE_URLS=$(echo $PRODUCT_RESPONSE | grep -o '"imageUrls":\[[^]]*\]')
if [[ $IMAGE_URLS == *"storage.googleapis.com"* ]]; then
  echo "✅ Product images uploaded to Google Cloud Storage!"
  echo "   Image URLs in response contain: storage.googleapis.com/blend1/products/"
else
  echo "❌ Images were not uploaded to GCS."
  echo "   Image URLs: $IMAGE_URLS"
fi

echo ""
echo "=== Test Complete ==="
echo ""
echo "To verify the images are publicly accessible, check the URLs in the responses above."
echo "They should be accessible at: https://storage.googleapis.com/blend1/..."

# Cleanup
rm -f /tmp/test-category-image.png /tmp/test-product-image.png
