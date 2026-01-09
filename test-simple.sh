#!/bin/bash

set -e

echo "=== Simple GCS Upload Test ==="
echo ""

# Login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.accessToken')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Login failed"
  exit 1
fi

echo "✅ Login successful"

# Get category
CATEGORIES=$(curl -s http://localhost:3000/categories)
CATEGORY_ID=$(echo "$CATEGORIES" | jq -r '.[0].id')

if [ "$CATEGORY_ID" == "null" ] || [ -z "$CATEGORY_ID" ]; then
  echo "❌ No categories found"
  exit 1
fi

echo "✅ Category ID: $CATEGORY_ID"
echo ""

# Create product with image
echo "Creating product with image..."
RESPONSE=$(curl -s -X POST http://localhost:3000/products \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=iPhone 15 Pro Max GCS" \
  -F "price=1299.99" \
  -F "stock=25" \
  -F "categoryId=$CATEGORY_ID" \
  -F "isFeatured=true" \
  -F "images=@/tmp/test-product.jpg")

echo "$RESPONSE" | jq '.'

# Check if GCS URLs are present
if echo "$RESPONSE" | jq -r '.imageUrls[]' 2>/dev/null | grep -q "storage.googleapis.com"; then
  echo ""
  echo "✅ SUCCESS! Images uploaded to Google Cloud Storage"
  echo ""
  echo "Image URLs:"
  echo "$RESPONSE" | jq -r '.imageUrls[]'
else
  echo ""
  echo "❌ Images not uploaded to GCS"
  echo "Image URLs:"
  echo "$RESPONSE" | jq -r '.imageUrls[]' 2>/dev/null || echo "No imageUrls found"
fi
