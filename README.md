# Blend

A NestJS backend with DDD architecture for an online shop.

## Features

- Admin authentication with JWT
- Product and Category management
- Order management
- Stock validation
- Public endpoints for home page (featured, best sellers, etc.)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and configure your database:
```bash
cp .env.example .env
```

3. Create PostgreSQL database:
```bash
createdb blend
```

4. Run the application (it will auto-create tables):
```bash
npm run start:dev
```

5. Seed the admin user:
```bash
npm run seed
```

## Swagger API Documentation

Interactive API documentation is available at:

**http://localhost:3000/api**

Once the application is running, open this URL in your browser to:
- View all available endpoints
- Test API requests directly
- See request/response schemas
- Authenticate with JWT tokens

### Using Swagger:
1. Start the application (`npm run start:dev`)
2. Open http://localhost:3000/api in your browser
3. Click "Authorize" button (top right)
4. Login via `/admin/login` endpoint to get JWT token
5. Copy the token and paste it in the authorization popup
6. Now you can test all protected endpoints!

## API Endpoints

### Authentication
- `POST /admin/login` - Admin login (returns JWT)

### Products (Admin only)
- `GET /products` - List all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Categories (Admin only)
- `GET /categories` - List all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Public Home Endpoints
- `GET /home/slider` - Get featured products
- `GET /home/best-seller` - Get best seller products
- `GET /home/best-select` - Get best select products
- `GET /home/categories` - Get all categories

## Architecture

```
src/
├── domain/              # Domain layer (business entities & interfaces)
│   ├── entities/        # Domain entities
│   └── repositories/    # Repository interfaces
├── application/         # Application layer (use cases)
│   └── use-cases/       # Business logic use cases
├── infrastructure/      # Infrastructure layer (external concerns)
│   ├── database/        # TypeORM entities & migrations
│   └── repositories/    # Repository implementations
├── presentation/        # Presentation layer (API)
│   ├── controllers/     # REST controllers
│   └── dtos/            # Data Transfer Objects
└── auth/               # Authentication module
    ├── guards/          # Auth guards
    ├── strategies/      # Passport strategies
    └── decorators/      # Custom decorators
```

## Default Admin Credentials

- Email: admin@example.com
- Password: admin123

**Change these in production!**
