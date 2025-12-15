# Authentication System Setup Guide

## 📋 Overview

Hệ thống xác thực hoàn chỉnh cho ứng dụng StudyMate NextJS, bao gồm:
- ✅ API endpoints cho login, register, password reset, email verification
- ✅ JWT token management
- ✅ Authentication middleware
- ✅ Client-side hooks và helpers
- ✅ Type-safe implementations

## 📁 Structure

```
src/
├── app/api/auth/
│   ├── login/route.ts           # Login endpoint
│   ├── register/route.ts        # Registration endpoint
│   ├── logout/route.ts          # Logout endpoint
│   ├── me/route.ts              # Get current user
│   ├── verify-email/route.ts    # Email verification
│   ├── forgot-password/route.ts # Password reset request
│   └── reset-password/route.ts  # Password reset
├── hooks/
│   └── use-auth.tsx             # Auth hook (updated)
├── lib/api/
│   ├── auth.ts                  # Token & password utilities
│   ├── auth-client.ts           # Client API helpers
│   └── middleware.ts            # Auth middleware for protected routes
└── types/
    └── auth.ts                  # Type definitions
```

## 🚀 Quick Start

### 1. Environment Setup

Add to `.env.local`:
```env
JWT_SECRET=your-secret-key-change-in-production
```

### 2. Basic Usage in Components

#### Login
```tsx
import { useAuth } from '@/hooks/use-auth';

export function LoginComponent() {
  const { login, isLoading } = useAuth();
  
  const handleLogin = async (email: string, password: string) => {
    try {
      await login({ email, password });
      // User is now logged in and redirected
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return (
    <button onClick={() => handleLogin('test@example.com', 'password123')}>
      Login
    </button>
  );
}
```

#### Register
```tsx
import { useAuth } from '@/hooks/use-auth';

export function RegisterComponent() {
  const { register, isLoading } = useAuth();
  
  const handleRegister = async (data) => {
    try {
      await register(data);
      // User is registered and redirected
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleRegister({
        email: 'newuser@example.com',
        username: 'newuser',
        fullName: 'New User',
        password: 'SecurePass123',
        passwordConfirmation: 'SecurePass123',
        acceptTerms: true
      });
    }}>
      {/* Form fields */}
    </form>
  );
}
```

#### Check Authentication
```tsx
import { useAuth } from '@/hooks/use-auth';

export function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }
  
  return (
    <div>
      <h1>Welcome, {user?.fullName}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 3. Using Client API Helpers

```tsx
import { loginUser, getCurrentUser } from '@/lib/api/auth-client';

// Direct API calls
const response = await loginUser({
  email: 'test@example.com',
  password: 'password123'
});

const user = await getCurrentUser(token);
```

## 🔒 Protected API Routes

### Using Middleware

```tsx
// src/app/api/protected/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/api/middleware';

async function handler(request: NextRequest) {
  const user = (request as any).user;
  
  return NextResponse.json({
    message: `Hello ${user.email}`,
    user
  });
}

export const POST = withAuth(handler);
```

### With Role Check

```tsx
import { withRole } from '@/lib/api/middleware';

async function adminHandler(request: NextRequest) {
  const user = (request as any).user;
  
  return NextResponse.json({
    message: 'This is admin only'
  });
}

export const POST = withRole('admin')(adminHandler);
```

## 🔐 Security Best Practices

### 1. Environment Variables
- ✅ Change `JWT_SECRET` in production
- ✅ Use strong, random values
- ✅ Store securely (never commit to git)

### 2. Password Hashing
Current implementation uses base64 for demo. For production:

```bash
npm install bcrypt @types/bcrypt
```

Update `src/lib/api/auth.ts`:
```typescript
import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### 3. JWT Implementation
Current implementation is simplified. For production:

```bash
npm install jsonwebtoken @types/jsonwebtoken
```

Update `src/lib/api/auth.ts`:
```typescript
import jwt from 'jsonwebtoken';

export function createToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '24h'
  });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  } catch {
    return null;
  }
}
```

### 4. Email Verification
Set up email service (SendGrid, Nodemailer, etc.):

```typescript
// src/lib/api/email.ts
import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  
  const transporter = nodemailer.createTransport({
    // Your email service config
  });

  await transporter.sendMail({
    to: email,
    subject: 'Verify your email',
    html: `<a href="${verificationUrl}">Click here to verify</a>`
  });
}
```

### 5. Database Integration

Replace mock users with MongoDB queries:

```typescript
import { User } from '@/models/User';

// In login route
const user = await User.findOne({ email: validatedData.email });

// In register route
const existingUser = await User.findOne({
  $or: [{ email }, { username }]
});

const newUser = await User.create({
  email,
  username,
  fullName,
  password: hashedPassword,
  role: 'student'
});
```

## 📊 Testing

### Using cURL
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"newuser@example.com",
    "username":"newuser",
    "fullName":"New User",
    "password":"SecurePass123",
    "passwordConfirmation":"SecurePass123",
    "acceptTerms":true
  }'

# Get current user
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Account (Demo Only)
- Email: `test@example.com`
- Password: `password123`

## 🔧 Configuration

### Token Expiration
Update in `src/lib/api/auth.ts`:
```typescript
exp: now + 24 * 60 * 60 // Change to desired duration (in seconds)
```

### Validation Rules
Update in `src/lib/validations.ts`:
```typescript
// Adjust password requirements, username length, etc.
```

### Public Routes
Update in `middleware.ts`:
```typescript
const publicRoutes = [
  '/',
  '/login',
  '/register',
  // Add more public routes
];
```

## 📝 API Documentation

See `AUTH_API_DOCUMENTATION.md` for complete API reference with:
- All endpoints
- Request/response examples
- Error codes
- Rate limiting recommendations

## 🐛 Troubleshooting

### "Token verification failed"
- Ensure token is passed with `Bearer ` prefix
- Check token expiration time
- Verify `JWT_SECRET` is set

### "CORS errors"
Add to `next.config.ts`:
```typescript
export default {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};
```

### "Email not sent"
- Configure email service
- Check environment variables
- Verify email credentials

## 📚 Resources

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [JWT Introduction](https://jwt.io/introduction)
- [Zod Validation](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)

## ✅ Next Steps

1. ✅ Implement database integration with MongoDB
2. ✅ Add email verification service
3. ✅ Implement password hashing with bcrypt
4. ✅ Use proper JWT library
5. ✅ Add rate limiting
6. ✅ Implement refresh tokens
7. ✅ Add 2FA support
8. ✅ Add OAuth providers (Google, Facebook, etc.)

---

**Last Updated:** December 15, 2025
**Version:** 1.0.0
