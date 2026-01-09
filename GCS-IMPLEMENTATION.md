# Google Cloud Storage Implementation

This document describes the GCS integration for product and category image uploads.

## Configuration

### Environment Variables (.env)

```bash
PROJECT_ID=105943171338601188249
BUCKET_NAME=blend1
KEYFILENAME=project-3b02420b-ecd7-4dbd-8a2-db2ca8a8e3b4.json
```

### GCS Credentials

The service account key file `project-3b02420b-ecd7-4dbd-8a2-db2ca8a8e3b4.json` must be present in the project root.

## Implementation Details

### Service Created

**File:** `src/common/services/google-cloud-storage.service.ts`

This service provides:
- `uploadFile()` - Upload a single file to GCS
- `uploadMultipleFiles()` - Upload multiple files to GCS
- `deleteFile()` - Delete a file from GCS
- `deleteMultipleFiles()` - Delete multiple files from GCS
- `fileExists()` - Check if a file exists in GCS

### Controllers Modified

#### Product Controller
**File:** `src/presentation/controllers/product.controller.ts`

Changes:
- Images are optimized locally first using `ImageOptimizationService`
- Optimized images are saved to `./uploads/products/temp-optimized`
- Images are then uploaded to GCS under `products/` folder
- Local temporary files are automatically deleted after upload
- Product `imageUrls` are set to the GCS public URLs

#### Category Controller
**File:** `src/presentation/controllers/category.controller.ts`

Changes:
- Category image is optimized locally first
- Optimized image is saved to `./uploads/categories/temp-optimized`
- Image is uploaded to GCS under `categories/` folder
- Local temporary file is automatically deleted after upload
- Category `image` is set to the GCS public URL

### Modules Updated

Both `ProductModule` and `CategoryModule` now include `GoogleCloudStorageService` in their providers.

## Image Upload Flow

### For Products

1. Client uploads image(s) via multipart/form-data
2. Multer saves to `./uploads/products/temp`
3. ImageOptimizationService optimizes and converts to WebP
4. Optimized files saved to `./uploads/products/temp-optimized`
5. GoogleCloudStorageService uploads to `gs://blend1/products/`
6. Public URLs returned: `https://storage.googleapis.com/blend1/products/{filename}`
7. All local temporary files are deleted
8. URLs saved to database

### For Categories

1. Client uploads image via multipart/form-data
2. Multer saves to `./uploads/categories/temp`
3. ImageOptimizationService optimizes and converts to WebP
4. Optimized file saved to `./uploads/categories/temp-optimized`
5. GoogleCloudStorageService uploads to `gs://blend1/categories/`
6. Public URL returned: `https://storage.googleapis.com/blend1/categories/{filename}`
7. All local temporary files are deleted
8. URL saved to database

## Bucket Configuration

### Uniform Bucket-Level Access

The bucket `blend1` has uniform bucket-level access enabled. This means:
- Individual file permissions cannot be set
- Bucket-level IAM policy controls access for all files
- The service gracefully handles this by logging a warning instead of failing

### Making Files Publicly Accessible

To make uploaded files publicly accessible, configure the bucket IAM policy:

#### Option 1: Using gcloud CLI

```bash
gcloud storage buckets add-iam-policy-binding gs://blend1 \
    --member=allUsers \
    --role=roles/storage.objectViewer \
    --project=105943171338601188249
```

#### Option 2: Using Google Cloud Console

1. Go to: https://console.cloud.google.com/storage/browser/blend1
2. Click on the **Permissions** tab
3. Click **Grant Access**
4. Add principal: `allUsers`
5. Select role: **Storage Object Viewer**
6. Click **Save**

## Testing

### Manual Testing with cURL

#### 1. Login as Admin

```bash
curl -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

Save the `accessToken` from the response.

#### 2. Create Product with Image

```bash
curl -X POST http://localhost:3000/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "title=iPhone 15 Pro" \
  -F "price=999.99" \
  -F "stock=50" \
  -F "categoryId=CATEGORY_ID" \
  -F "isFeatured=true" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

Check the response `imageUrls` field - it should contain URLs like:
```
https://storage.googleapis.com/blend1/products/{filename}.webp
```

#### 3. Create Category with Image

```bash
curl -X POST http://localhost:3000/categories \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "title=Electronics" \
  -F "slug=electronics" \
  -F "image=@/path/to/image.jpg"
```

Check the response `image` field - it should contain a URL like:
```
https://storage.googleapis.com/blend1/categories/{filename}.webp
```

### Testing with Postman

1. **Login**: POST `http://localhost:3000/admin/login`
   - Body (JSON):
     ```json
     {
       "email": "admin@example.com",
       "password": "admin123"
     }
     ```
   - Copy the `accessToken`

2. **Create Product**: POST `http://localhost:3000/products`
   - Headers: `Authorization: Bearer {accessToken}`
   - Body (form-data):
     - `title`: iPhone 15 Pro
     - `price`: 999.99
     - `stock`: 50
     - `categoryId`: {valid-category-id}
     - `isFeatured`: true
     - `images`: (File) - select image file(s)

3. **Create Category**: POST `http://localhost:3000/categories`
   - Headers: `Authorization: Bearer {accessToken}`
   - Body (form-data):
     - `title`: Electronics
     - `slug`: electronics
     - `image`: (File) - select image file

## Verification

After uploading, verify:

1. **Database**: Check that imageUrls/image fields contain GCS URLs
2. **GCS Console**: Visit https://console.cloud.google.com/storage/browser/blend1
   - Files should be visible in `products/` and `categories/` folders
3. **Public Access**: Open the GCS URL in a browser
   - If properly configured, image should load
   - If you get 403 Forbidden, configure bucket permissions (see above)

## Best Practices Implemented

1. **Image Optimization**: All images are optimized before upload
   - Resized to appropriate dimensions
   - Converted to WebP for better compression
   - Metadata removed for smaller file size

2. **Cleanup**: Temporary local files are deleted after successful upload

3. **Error Handling**: Service logs errors and continues operation when possible

4. **Caching**: Files are uploaded with cache-control headers (1 year)

5. **Security**: Service account key is used for authentication

6. **Scalability**: Images are served from GCS CDN, not the application server

## Troubleshooting

### Issue: Images not uploading

Check server logs for errors. Common issues:
- Missing or invalid GCS credentials
- Incorrect bucket name
- Missing permissions on service account

### Issue: 403 Forbidden when accessing images

The bucket needs to be configured for public access. See "Making Files Publicly Accessible" section above.

### Issue: Old local file system URLs in database

Only new uploads will use GCS. Existing records will keep their local paths. You may need to migrate old data if required.

## Dependencies Added

```json
{
  "@google-cloud/storage": "^7.18.0"
}
```

## Files Modified/Created

### Created:
- `src/common/services/google-cloud-storage.service.ts`
- `configure-gcs-public-access.sh`

### Modified:
- `src/presentation/controllers/product.controller.ts`
- `src/presentation/controllers/category.controller.ts`
- `src/modules/product.module.ts`
- `src/modules/category.module.ts`
- `.env`
