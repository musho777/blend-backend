#!/bin/bash

echo "=== Testing Google Cloud Storage Integration (Final) ==="
echo ""

# Login
echo "1. Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to login"
  exit 1
fi

echo "✅ Login successful"
echo ""

# Get categories
echo "2. Fetching categories..."
CATEGORIES=$(curl -s http://localhost:3000/categories)
CATEGORY_ID=$(echo $CATEGORIES | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$CATEGORY_ID" ]; then
  echo "Creating a category first..."

  # Create category with image
  CATEGORY_RESPONSE=$(curl -s -X POST http://localhost:3000/categories \
    -H "Authorization: Bearer $TOKEN" \
    -F "title=Electronics GCS Test" \
    -F "slug=electronics-gcs-test" \
    -F "image=@/tmp/test-image.png")

  echo "Category Response:"
  echo $CATEGORY_RESPONSE | jq '.' 2>/dev/null || echo $CATEGORY_RESPONSE

  CATEGORY_ID=$(echo $CATEGORY_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
  IMAGE_URL=$(echo $CATEGORY_RESPONSE | grep -o '"image":"[^"]*' | cut -d'"' -f4)

  echo ""
  if [[ $IMAGE_URL == *"storage.googleapis.com"* ]]; then
    echo "✅ Category image uploaded to GCS!"
    echo "   URL: $IMAGE_URL"
  elif [ -n "$IMAGE_URL" ]; then
    echo "⚠️  Category image URL: $IMAGE_URL"
  else
    echo "❌ No image URL found"
  fi
  echo ""
fi

if [ -z "$CATEGORY_ID" ]; then
  echo "❌ Failed to get category ID"
  exit 1
fi

echo "Using category ID: $CATEGORY_ID"
echo ""

# Test product creation
echo "3. Testing product creation with GCS..."
PRODUCT_RESPONSE=$(curl -s -X POST http://localhost:3000/products \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=iPhone 15 Pro GCS Test" \
  -F "price=999.99" \
  -F "stock=50" \
  -F "categoryId=$CATEGORY_ID" \
  -F "isFeatured=true" \
  -F "images=@/tmp/test-image.png")

echo "Product Response:"
echo $PRODUCT_RESPONSE | jq '.' 2>/dev/null || echo $PRODUCT_RESPONSE
echo ""

# Check image URLs
IMAGE_URLS=$(echo $PRODUCT_RESPONSE | grep -o '"imageUrls":\[[^]]*\]')
if [[ $IMAGE_URLS == *"storage.googleapis.com"* ]]; then
  echo "✅ Product images uploaded to GCS!"
  echo "   Check the imageUrls field above"
elif [[ $IMAGE_URLS == *"["* ]]; then
  echo "⚠️  Product has imageUrls but they might not be GCS URLs"
  echo "   URLs: $IMAGE_URLS"
else
  echo "❌ No image URLs found in response"
fi

echo ""
echo "=== Test Complete ==="
echo ""
echo "Note: If images are uploaded to GCS but return 403 Forbidden when accessing,"
echo "you need to configure bucket permissions. Run:"
echo "  ./configure-gcs-public-access.sh"
echo ""
echo "Or configure manually via Google Cloud Console:"
echo "  https://console.cloud.google.com/storage/browser/blend1"
