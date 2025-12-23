# Blend - Usage Guide

## Project Structure

```
blend/
├── src/
│   ├── domain/                      # Domain Layer (Core Business Logic)
│   │   ├── entities/                # Domain entities (Product, Category, Order, Admin)
│   │   └── repositories/            # Repository interfaces
│   │
│   ├── application/                 # Application Layer (Use Cases)
│   │   └── use-cases/
│   │       ├── product/             # Product use cases
│   │       ├── category/            # Category use cases
│   │       └── home/                # Home page use cases
│   │
│   ├── infrastructure/              # Infrastructure Layer (External Concerns)
│   │   ├── database/
│   │   │   ├── entities/            # TypeORM entities
│   │   │   ├── mappers/             # Domain <-> TypeORM mappers
│   │   │   └── seeds/               # Database seeds
│   │   └── repositories/            # Repository implementations
│   │
│   ├── presentation/                # Presentation Layer (API)
│   │   ├── controllers/             # REST controllers
│   │   └── dtos/                    # Data Transfer Objects
│   │
│   ├── auth/                        # Authentication Module
│   │   ├── guards/                  # Auth guards
│   │   ├── strategies/              # Passport strategies
│   │   └── decorators/              # Custom decorators
│   │
│   ├── config/                      # Configuration files
│   ├── modules/                     # NestJS modules
│   ├── app.module.ts                # Root module
│   └── main.ts                      # Application entry point
│
├── .env                             # Environment variables
├── .env.example                     # Environment variables example
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd blend
npm install
```

### 2. Configure Database

Create a PostgreSQL database:

```bash
createdb blend
```

Or using psql:

```sql
CREATE DATABASE blend;
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Update `.env` with your database credentials:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=blend

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=24h

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### 4. Start the Application

The application will automatically create database tables on first run (synchronize: true):

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

### 5. Seed Admin User

After the application has started at least once (to create tables):

```bash
npm run seed
```

This will create an admin user with the credentials from your `.env` file.

## API Endpoints

### Authentication

#### Login (Admin)
```http
POST /admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "admin@example.com",
  "role": "admin"
}
```

### Products (Admin Only - Requires JWT Token)

Add the JWT token to all requests:
```
Authorization: Bearer <your-jwt-token>
```

#### Get All Products
```http
GET /products
Authorization: Bearer <token>
```

#### Get Product by ID
```http
GET /products/:id
Authorization: Bearer <token>
```

#### Create Product
```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "iPhone 15 Pro",
  "price": 999.99,
  "stock": 50,
  "categoryId": "uuid-of-category",
  "isFeatured": true,
  "isBestSeller": false,
  "isBestSelect": false,
  "priority": 10
}
```

#### Update Product
```http
PUT /products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "iPhone 15 Pro Max",
  "price": 1099.99,
  "stock": 30
}
```

#### Delete Product
```http
DELETE /products/:id
Authorization: Bearer <token>
```

### Categories (Admin Only - Requires JWT Token)

#### Get All Categories
```http
GET /categories
Authorization: Bearer <token>
```

#### Get Category by ID
```http
GET /categories/:id
Authorization: Bearer <token>
```

#### Create Category
```http
POST /categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Electronics",
  "slug": "electronics",  // Optional - auto-generated if not provided
  "image": "https://example.com/images/electronics.jpg"
}
```

#### Update Category
```http
PUT /categories/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Consumer Electronics",
  "image": "https://example.com/images/electronics-new.jpg"
}
```

#### Delete Category
```http
DELETE /categories/:id
Authorization: Bearer <token>
```

### Home / Public Endpoints (No Authentication Required)

#### Get Featured Products (Slider)
```http
GET /home/slider
```

#### Get Best Seller Products
```http
GET /home/best-seller
```

#### Get Best Select Products
```http
GET /home/best-select
```

#### Get All Categories
```http
GET /home/categories
```

## Testing the API

### Using cURL

1. Login to get JWT token:
```bash
curl -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

2. Create a category:
```bash
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Electronics","image":"https://example.com/electronics.jpg"}'
```

3. Create a product:
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title":"iPhone 15",
    "price":999.99,
    "stock":50,
    "categoryId":"CATEGORY_UUID",
    "isFeatured":true
  }'
```

4. Get featured products (public):
```bash
curl http://localhost:3000/home/slider
```

### Using Postman or Thunder Client

1. Create a new request
2. Set the method and URL
3. Add headers:
   - `Content-Type: application/json`
   - `Authorization: Bearer <token>` (for protected routes)
4. Add request body (for POST/PUT requests)

## DDD Architecture Explained

### Domain Layer
- **Entities**: Core business objects with behavior (Product, Category, Order)
- **Repository Interfaces**: Contracts for data access
- Contains pure business logic, no framework dependencies

### Application Layer
- **Use Cases**: Application-specific business rules
- Orchestrates domain entities and repositories
- One use case per business operation

### Infrastructure Layer
- **TypeORM Entities**: Database mapping
- **Repository Implementations**: Data access using TypeORM
- **Mappers**: Convert between domain and infrastructure entities

### Presentation Layer
- **Controllers**: HTTP request handling
- **DTOs**: Request/response data validation
- Thin layer that delegates to use cases

## Development Tips

### Adding a New Feature

1. **Domain Layer**: Define entity and repository interface
2. **Infrastructure Layer**: Create TypeORM entity, mapper, and repository implementation
3. **Application Layer**: Create use case
4. **Presentation Layer**: Create DTO and controller endpoint
5. **Module**: Wire everything together in a NestJS module

### Database Migrations (Production)

For production, set `synchronize: false` in `database.config.ts` and use TypeORM migrations:

```bash
npm run typeorm migration:generate -- -n MigrationName
npm run typeorm migration:run
```

### Running in Production

```bash
npm run build
npm run start:prod
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env` file
- Ensure database exists: `psql -l`

### JWT Token Issues
- Token expired: Login again to get a new token
- Invalid token: Check if JWT_SECRET matches between seed and runtime

### Seed Script Issues
- Run the app first to create tables
- Ensure database credentials are correct in `.env`
- Admin already exists: Check database or delete existing admin first

## Security Notes

- Change default admin password immediately after first login
- Use strong JWT_SECRET in production (generate with `openssl rand -base64 32`)
- Set `synchronize: false` in production and use migrations
- Enable HTTPS in production
- Implement rate limiting for login endpoint
- Add refresh tokens for better security

## Next Steps

- Implement password change endpoint
- Add refresh token mechanism
- Implement pagination for list endpoints
- Add search and filtering
- Implement order creation with stock validation
- Add file upload for product images
- Implement proper error handling and logging
- Add API documentation with Swagger
- Write unit and integration tests
