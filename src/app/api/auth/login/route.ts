import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { loginSchema } from '@/lib/validations';
import type { AuthResponse } from '@/types/auth';
import { createToken, verifyPassword } from '@/lib/api/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

// Mock user database - replace with actual DB query
const mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // Hashed version of 'password123'
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
    //console.log('Login request body:', body);
    // Validate input
    const validatedData = loginSchema.parse(body);

    // Connect to database
    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({ email: validatedData.email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    //console.log('User found:', user.email);
   // console.log('User password field:', user.password, 'Type:', typeof user.password, 'Length:', user.password?.length);

    // Verify password with bcrypt
    const passwordMatch = await verifyPassword(validatedData.password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create token
    const token = createToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Remove sensitive data and convert to plain object
    const userObj = user.toObject();
    const userWithoutPassword = {
      id: userObj._id.toString(),
      email: userObj.email,
      username: userObj.email.split('@')[0], // Use email prefix as username
      fullName: userObj.fullName,
      avatar: userObj.avatar,
      role: userObj.role,
      isEmailVerified: userObj.verified,
      createdAt: userObj.createdAt.toISOString(),
      updatedAt: userObj.updatedAt.toISOString(),
    };

    const response: AuthResponse = {
      user: userWithoutPassword,
      token,
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
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
