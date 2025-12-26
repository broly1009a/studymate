import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { registerSchema } from '@/lib/validations';
import type { AuthResponse } from '@/types/auth';
import { createToken, hashPassword } from '@/lib/api/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { createVerificationToken, sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email: validatedData.email }, { username: validatedData.username }] 
    });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email or username already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user
    const newUser = new User({
      email: validatedData.email,
      username: validatedData.username,
      fullName: validatedData.fullName,
      password: hashedPassword,
      role: 'student',
      verified: false,
    });

    await newUser.save();

    // Create token
    const token = createToken({
      id: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    });

    const response: AuthResponse = {
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        username: newUser.username,
        fullName: newUser.fullName,
        avatar: newUser.avatar,
        role: newUser.role,
        isEmailVerified: newUser.verified,
        createdAt: newUser.createdAt.toISOString(),
        updatedAt: newUser.updatedAt.toISOString(),
      },
      token,
    };

    // Send verification email
    try {
      const verificationToken = await createVerificationToken(
        newUser._id.toString(),
        newUser.email,
        'email'
      );
      await sendVerificationEmail(newUser.email, newUser.fullName, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails - user can request resend later
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
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
