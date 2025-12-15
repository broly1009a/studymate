import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = verifyEmailSchema.parse(body);

    // In real app:
    // 1. Verify the token
    // 2. Find user with matching verification token
    // 3. Update isEmailVerified to true
    // 4. Delete verification token

    // Mock implementation
    const isValid = validatedData.token.length > 10; // Simple validation

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
