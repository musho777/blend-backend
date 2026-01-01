# User Authentication System - Setup Guide

This guide will help you set up and use the user authentication system with email verification and Google OAuth login.

## Features Implemented

### 1. **User Registration with Email Verification**
- Users register with email, password, first name, last name, and phone number
- 6-digit verification code sent to email
- Verification code expires in 15 minutes
- Guest orders automatically linked to user account upon email verification

### 2. **Email & Password Login**
- Standard email/password authentication
- Returns JWT token for authenticated requests
- Only verified users can login

### 3. **Google OAuth Login**
- Sign in with Google account
- Automatically creates user account if not exists
- Links existing guest orders to Google account

### 4. **Guest Checkout**
- Users can place orders without authentication
- Guest orders require email address
- Orders automatically linked when user verifies email or logs in with Google

## Configuration

### 1. Email Service Setup (Gmail SMTP)

You need to configure Gmail SMTP to send verification emails:

1. **Enable 2-Step Verification** on your Gmail account:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Update .env file**:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   ```

### 2. Google OAuth Setup

1. **Create Google Cloud Project**:
   - Go to https://console.cloud.google.com/
   - Create a new project or select existing one

2. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: "Web application"
   - Authorized redirect URIs:
     - Development: `http://localhost:3000/auth/google/callback`
     - Production: `https://yourdomain.com/auth/google/callback`

4. **Update .env file**:
   ```env
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
   ```

## API Endpoints

### User Authentication Endpoints

All endpoints are under the `/auth` prefix:

#### 1. **Register** - `POST /auth/register`
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "userId": "uuid",
  "message": "Registration successful. Please check your email for verification code."
}
```

#### 2. **Verify Email** - `POST /auth/verify-email`
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response:**
```json
{
  "message": "Email verified successfully",
  "accessToken": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "isVerified": true
  }
}
```

#### 3. **Resend Verification Code** - `POST /auth/resend-code`
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Verification code has been resent to your email."
}
```

#### 4. **Login** - `POST /auth/login`
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "accessToken": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "isVerified": true
  }
}
```

#### 5. **Google OAuth Login** - `GET /auth/google`
Redirects to Google OAuth consent screen.

#### 6. **Google OAuth Callback** - `GET /auth/google/callback`
Handles Google OAuth callback and returns JWT token.

### Order Endpoints

#### 1. **Create Order** - `POST /public/orders`
Supports both authenticated users and guests.

**Authenticated User:**
```json
{
  "productId": "product-uuid",
  "quantity": 2
}
```

**Guest User:**
```json
{
  "productId": "product-uuid",
  "quantity": 2,
  "guestEmail": "guest@example.com"
}
```

**Headers (Optional for authenticated users):**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": "order-uuid",
  "productId": "product-uuid",
  "quantity": 2,
  "totalPrice": 1999.98,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### 2. **Get My Orders** - `GET /public/orders/my-orders`
Requires authentication.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

## Database Schema

The system creates the following database tables:

### `users`
- `id` (UUID, Primary Key)
- `email` (Unique)
- `password_hash` (Nullable for Google OAuth users)
- `first_name`
- `last_name`
- `phone`
- `is_verified` (Boolean, default: false)
- `google_id` (Unique, Nullable)
- `created_at`
- `updated_at`

### `verification_codes`
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key → users.id, CASCADE delete)
- `code` (6-digit string)
- `expires_at` (Timestamp)
- `created_at`

### `orders` (Updated)
- `id` (UUID, Primary Key)
- `product_id` (Foreign Key → products.id)
- `quantity` (Integer)
- `total_price` (Decimal)
- `user_id` (Foreign Key → users.id, Nullable)
- `guest_email` (Nullable)
- `created_at`

## Testing the System

### 1. Test User Registration & Email Verification

```bash
# Register a new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "confirmPassword": "Test123!",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+1234567890"
  }'

# Check your email for verification code

# Verify email
curl -X POST http://localhost:3000/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456"
  }'
```

### 2. Test Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### 3. Test Guest Order

```bash
curl -X POST http://localhost:3000/public/orders \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "your-product-uuid",
    "quantity": 2,
    "guestEmail": "guest@example.com"
  }'
```

### 4. Test Authenticated Order

```bash
curl -X POST http://localhost:3000/public/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "productId": "your-product-uuid",
    "quantity": 2
  }'
```

## Email Templates

The system sends two types of emails:

### 1. Verification Email
- Subject: "Email Verification - Blend"
- Contains 6-digit verification code
- Code expires in 15 minutes

### 2. Welcome Email
- Subject: "Welcome to Blend!"
- Sent after successful email verification

You can customize these templates in:
`src/common/services/email.service.ts`

## Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with configurable expiration (default: 24h)
- Email verification required before login
- Verification codes expire after 15 minutes
- Guest orders automatically linked to prevent orphaned data
- Separate JWT strategies for admin and user authentication

## Architecture

The implementation follows Domain-Driven Design (DDD):

```
src/
├── domain/                    # Business entities and interfaces
│   ├── entities/
│   │   ├── user.entity.ts
│   │   ├── verification-code.entity.ts
│   │   └── order.entity.ts (updated)
│   └── repositories/
│
├── application/               # Business logic (use cases)
│   └── use-cases/
│       └── user-auth/
│           ├── register-user.use-case.ts
│           ├── verify-email.use-case.ts
│           ├── resend-verification-code.use-case.ts
│           ├── login-user.use-case.ts
│           └── google-login.use-case.ts
│
├── infrastructure/            # Data access layer
│   ├── database/
│   │   ├── entities/         # TypeORM entities
│   │   ├── mappers/          # Domain ↔ TypeORM mapping
│   │   └── repositories/     # Repository implementations
│
├── presentation/              # API layer
│   ├── controllers/
│   │   ├── user-auth.controller.ts
│   │   └── public-order.controller.ts
│   └── dtos/
│
├── auth/                      # Authentication strategies & guards
│   ├── strategies/
│   │   ├── user-jwt.strategy.ts
│   │   └── google.strategy.ts
│   └── guards/
│       ├── user-jwt-auth.guard.ts
│       ├── google-auth.guard.ts
│       └── optional-jwt-auth.guard.ts
│
└── common/
    └── services/
        └── email.service.ts   # Nodemailer email service
```

## Troubleshooting

### Email not sending
1. Check that 2-Step Verification is enabled on your Gmail account
2. Verify App Password is correct (no spaces)
3. Check EMAIL_USER and EMAIL_PASSWORD in .env
4. Check application logs for error messages

### Google OAuth not working
1. Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env
2. Check that redirect URI matches exactly in Google Console
3. Ensure Google+ API is enabled in Google Cloud Console
4. Check that callback URL is accessible

### Database errors
1. Ensure PostgreSQL is running
2. Check database credentials in .env
3. Run `npm run start:dev` to auto-sync database schema
4. Check TypeORM logs for migration errors

## Next Steps

Consider implementing:
1. Password reset functionality
2. Email change with verification
3. Phone number verification (SMS)
4. User profile update endpoints
5. Order history with pagination
6. Social login with Facebook, Twitter, etc.
7. Two-factor authentication (2FA)
8. Rate limiting for authentication endpoints
