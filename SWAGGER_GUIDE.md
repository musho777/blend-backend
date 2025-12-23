# Swagger API Documentation Guide

## Accessing Swagger

Once your Blend backend is running, you can access the interactive API documentation at:

**http://localhost:3000/api**

## Features

Swagger provides:
- 📖 **Complete API Documentation** - All endpoints with descriptions
- 🧪 **Interactive Testing** - Test APIs directly from the browser
- 📝 **Request/Response Schemas** - See exact data structures
- 🔐 **JWT Authentication** - Built-in auth support
- 💾 **Persistent Authorization** - Stays logged in between refreshes

## Quick Start Guide

### Step 1: Start the Application

```bash
npm run start:dev
```

You should see:
```
Application is running on: http://localhost:3000
Swagger documentation: http://localhost:3000/api
```

### Step 2: Open Swagger UI

Open your browser and navigate to:
```
http://localhost:3000/api
```

### Step 3: Authenticate

1. **Find the Login Endpoint**
   - Scroll to the **Authentication** section
   - Click on `POST /admin/login`

2. **Execute Login Request**
   - Click "Try it out"
   - Enter credentials in the request body:
     ```json
     {
       "email": "admin@example.com",
       "password": "admin123"
     }
     ```
   - Click "Execute"

3. **Copy the JWT Token**
   - In the response, copy the `accessToken` value
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

4. **Authorize Swagger**
   - Click the **"Authorize"** button at the top right (🔓)
   - Paste the token in the "Value" field
   - Click "Authorize"
   - Click "Close"

### Step 4: Test Endpoints

Now you can test any protected endpoint:

**Example: Create a Category**
1. Go to **Categories** section
2. Click `POST /categories`
3. Click "Try it out"
4. Enter category data:
   ```json
   {
     "title": "Electronics",
     "image": "https://example.com/electronics.jpg"
   }
   ```
5. Click "Execute"
6. See the response with the created category

**Example: Create a Product**
1. Copy the category `id` from previous response
2. Go to **Products** section
3. Click `POST /products`
4. Click "Try it out"
5. Enter product data:
   ```json
   {
     "title": "iPhone 15 Pro",
     "price": 999.99,
     "stock": 50,
     "categoryId": "<paste-category-id-here>",
     "isFeatured": true,
     "priority": 10
   }
   ```
6. Click "Execute"

## API Sections

### 🔐 Authentication (Public)
- `POST /admin/login` - Get JWT token

### 📦 Products (Protected)
All endpoints require JWT authentication:
- `GET /products` - List all products
- `GET /products/{id}` - Get specific product
- `POST /products` - Create new product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### 📁 Categories (Protected)
All endpoints require JWT authentication:
- `GET /categories` - List all categories
- `GET /categories/{id}` - Get specific category
- `POST /categories` - Create new category
- `PUT /categories/{id}` - Update category
- `DELETE /categories/{id}` - Delete category

### 🏠 Home (Public)
No authentication required:
- `GET /home/slider` - Featured products
- `GET /home/best-seller` - Best seller products
- `GET /home/best-select` - Best select products
- `GET /home/categories` - All categories

## Understanding the UI

### Endpoint Colors
- 🟢 **GET** - Green (Retrieve data)
- 🟡 **POST** - Yellow (Create data)
- 🔵 **PUT** - Blue (Update data)
- 🔴 **DELETE** - Red (Delete data)

### Lock Icon 🔒
- Indicates protected endpoints requiring JWT authentication

### Request Body
- Shows expected JSON structure
- Click "Try it out" to edit
- Examples are pre-filled

### Response Section
- **Code 200/201** - Success
- **Code 400** - Bad request (validation error)
- **Code 401** - Unauthorized (missing/invalid token)
- **Code 404** - Not found

### Schemas
- Scroll to bottom to see all DTOs
- Click on schema names to expand
- Shows all properties and types

## Common Workflows

### 1. Complete Product Setup

```
1. Login → Get JWT token
2. Authorize Swagger with token
3. Create Category → Note the ID
4. Create Product with category ID
5. Mark product as featured (isFeatured: true)
6. Test public endpoint GET /home/slider to see it
```

### 2. Update Product Stock

```
1. Get all products: GET /products
2. Find product ID
3. Update stock: PUT /products/{id}
   {
     "stock": 100
   }
```

### 3. Test Public Endpoints

No authentication needed:
```
1. GET /home/categories - See all categories
2. GET /home/slider - See featured products
3. GET /home/best-seller - See best sellers
```

## Tips & Tricks

### Persistent Authorization
- ✅ Once authorized, Swagger remembers your token
- ✅ Token persists even after page refresh
- ✅ Click 🔓 icon to logout/change token

### Copy as cURL
- Click "Execute" on any request
- Scroll down to "Curl" section
- Copy the cURL command for terminal use

### Testing Validation
Try invalid data to see validation errors:
```json
{
  "title": "",           // Empty title will fail
  "price": -10,          // Negative price will fail
  "categoryId": "abc"    // Invalid UUID will fail
}
```

### Response Time
- Swagger shows response time for each request
- Useful for performance monitoring

## Troubleshooting

### "Unauthorized" Error
**Solution:**
1. Check if token is set (🔓 should show as locked 🔒)
2. Token might be expired - login again
3. Make sure you clicked "Authorize" after pasting token

### "Failed to Fetch"
**Solution:**
1. Ensure backend is running (`npm run start:dev`)
2. Check console for errors
3. Verify port 3000 is not blocked

### Changes Not Showing
**Solution:**
1. Refresh the page (Ctrl+R / Cmd+R)
2. Clear browser cache if needed
3. Restart backend if DTOs changed

## Development Notes

### Adding New Endpoints
When you add new endpoints to the code:
1. Add `@ApiOperation()` decorator
2. Add `@ApiResponse()` decorators
3. Refresh Swagger UI to see changes

### Updating DTOs
When modifying DTOs:
1. Update `@ApiProperty()` decorators
2. Restart the application
3. Refresh Swagger UI

## Advanced Usage

### Testing Error Cases

**404 Not Found:**
```
GET /products/00000000-0000-0000-0000-000000000000
```

**400 Validation Error:**
```
POST /products
{
  "title": "",
  "price": -100
}
```

**401 Unauthorized:**
```
1. Logout (click 🔒 → Logout)
2. Try any protected endpoint
```

### Batch Testing
1. Create multiple categories
2. Create products in each category
3. Mark some as featured, best seller, best select
4. Test all public endpoints to verify

## Export/Import

### Exporting OpenAPI Spec
The OpenAPI specification is available at:
```
http://localhost:3000/api-json
```

You can import this into:
- Postman
- Insomnia
- API testing tools
- Code generators

## Additional Resources

- **OpenAPI Specification:** https://swagger.io/specification/
- **NestJS Swagger:** https://docs.nestjs.com/openapi/introduction
- **USAGE_GUIDE.md** - Detailed API usage with cURL examples
- **PROJECT_SUMMARY.md** - Complete architecture documentation

---

**Happy Testing! 🚀**
