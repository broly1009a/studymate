import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { registerSchema } from '@/lib/validations';
import type { AuthResponse } from '@/types/auth';
import { createToken, hashPassword } from '@/lib/api/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    // Check if user already exists - in real app, query database
    // const existingUser = await User.findOne({ $or: [{ email: validatedData.email }, { username: validatedData.username }] });
    // if (existingUser) {
    //   return NextResponse.json(
    //     { error: 'Email or username already exists' },
    //     { status: 409 }
    //   );
    // }

    // Hash password - in real app, use bcrypt
    // const hashedPassword = await hashPassword(validatedData.password);

    // Create user - in real app, save to database
    const newUser = {
      id: Date.now().toString(),
      email: validatedData.email,
      username: validatedData.username,
      fullName: validatedData.fullName,
      role: 'student' as const,
      isEmailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Create token
    const token = createToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    const response: AuthResponse = {
      user: newUser,
      token,
    };

    // TODO: Send verification email
    // await sendVerificationEmail(newUser.email, verificationToken);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
