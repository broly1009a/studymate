import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { loginSchema } from '@/lib/validations';
import type { AuthResponse } from '@/types/auth';
import { createToken, hashPassword, verifyPassword } from '@/lib/api/auth';

// Mock user database - replace with actual DB query
const mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'hashed_password_123', // In real app, use bcrypt
    username: 'testuser',
    fullName: 'Test User',
    role: 'student' as const,
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = loginSchema.parse(body);

    // Find user by email
    const user = mockUsers.find((u) => u.email === validatedData.email);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // In real app, verify password with bcrypt
    // const passwordMatch = await verifyPassword(validatedData.password, user.password);
    // For mock, just check if password is 'password123'
    const passwordMatch = validatedData.password === 'password123';

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create token
    const token = createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove sensitive data
    const { password, ...userWithoutPassword } = user;

    const response: AuthResponse = {
      user: userWithoutPassword,
      token,
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
