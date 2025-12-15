# API Authentication Documentation

## Overview
The authentication system provides endpoints for user login, registration, password reset, and email verification.

## Base URL
```
http://localhost:3000/api/auth
```

## Endpoints

### 1. Login
**POST** `/auth/login`

Authenticate user with email and password.

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "password123",
  "rememberMe": false
}
```

**Validation:**
- `email`: Must be a valid email address
- `password`: Minimum 6 characters
- `rememberMe`: Optional boolean

**Success Response (200):**
```json
{
  "user": {
    "id": "1",
    "email": "test@example.com",
    "username": "testuser",
    "fullName": "Test User",
    "role": "student",
    "isEmailVerified": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- 400: Validation error
- 401: Invalid email or password
- 500: Internal server error

---

### 2. Register
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "username": "newuser",
  "fullName": "New User",
  "password": "SecurePass123",
  "passwordConfirmation": "SecurePass123",
  "acceptTerms": true
}
```

**Validation:**
- `email`: Valid email address, must be unique
- `username`: 3-20 characters, letters/numbers/underscores only, must be unique
- `fullName`: At least 2 characters
- `password`: Minimum 8 characters, must contain uppercase, lowercase, and number
- `passwordConfirmation`: Must match password
- `acceptTerms`: Must be true

**Success Response (201):**
```json
{
  "user": {
    "id": "newly-generated-id",
    "email": "newuser@example.com",
    "username": "newuser",
    "fullName": "New User",
    "role": "student",
    "isEmailVerified": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- 400: Validation error
- 409: Email or username already exists
- 500: Internal server error

---

### 3. Get Current User
**GET** `/auth/me`

Get the current authenticated user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "user": {
    "id": "1",
    "email": "test@example.com",
    "username": "testuser",
    "fullName": "Test User",
    "role": "student",
    "isEmailVerified": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

**Error Responses:**
- 401: Missing or invalid token
- 500: Internal server error

---

### 4. Logout
**POST** `/auth/logout`

Logout the current user. The client should remove the token from localStorage.

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### 5. Verify Email
**POST** `/auth/verify-email`

Verify user email address using the verification token sent to their email.

**Request Body:**
```json
{
  "token": "verification-token-from-email"
}
```

**Success Response (200):**
```json
{
  "message": "Email verified successfully"
}
```

**Error Responses:**
- 400: Invalid or expired token
- 500: Internal server error

---

### 6. Forgot Password
**POST** `/auth/forgot-password`

Request a password reset email.

**Request Body:**
```json
{
  "email": "test@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "If an account exists with this email, a password reset link will be sent",
  "resetToken": "reset-token-for-testing"
}
```

**Note:** In production, the resetToken should NOT be returned. The token should be sent via email only.

**Error Responses:**
- 400: Validation error
- 500: Internal server error

---

### 7. Reset Password
**POST** `/auth/reset-password`

Reset the user password using the reset token.

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "NewSecurePass123",
  "passwordConfirmation": "NewSecurePass123"
}
```

**Validation:**
- `token`: Reset token from email
- `password`: Minimum 8 characters, must contain uppercase, lowercase, and number
- `passwordConfirmation`: Must match password

**Success Response (200):**
```json
{
  "message": "Password reset successfully"
}
```

**Error Responses:**
- 400: Invalid token or validation error
- 500: Internal server error

---

## Authentication

All protected endpoints require the `Authorization` header with a Bearer token:

```
Authorization: Bearer <your-jwt-token>
```

The token is obtained from the login or register endpoints and should be stored in localStorage on the client side.

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error message",
  "details": [] // Optional: validation error details
}
```

## Implementation Notes

1. **Password Hashing:** Currently using base64 for demonstration. In production, use bcrypt:
   ```bash
   npm install bcrypt
   ```

2. **JWT Tokens:** Current implementation is simplified. For production, use jsonwebtoken:
   ```bash
   npm install jsonwebtoken
   ```

3. **Email Verification:** Implement with a service like SendGrid, Nodemailer, or AWS SES

4. **Database:** Connect to MongoDB using the `User` model in `/src/models/User.ts`

5. **Environment Variables:** Add to `.env.local`:
   ```
   JWT_SECRET=your-secret-key-here
   DATABASE_URL=your-mongodb-connection-string
   EMAIL_SERVICE_API_KEY=your-email-service-key
   ```

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "username": "newuser",
    "fullName": "New User",
    "password": "SecurePass123",
    "passwordConfirmation": "SecurePass123",
    "acceptTerms": true
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer your-token-here"
```

## Rate Limiting

Consider implementing rate limiting for security:
- Login attempts: 5 per minute per IP
- Register: 3 per minute per IP
- Password reset: 3 per hour per email

Use middleware like `express-rate-limit` or `nextjs-rate-limit`.
