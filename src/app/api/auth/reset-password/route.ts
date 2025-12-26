import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { resetPasswordSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get reset token from query or body
    const resetToken = body.token || request.nextUrl.searchParams.get('token');

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Reset token is required' },
        { status: 400 }
      );
    }

    // Validate password data
    const validatedData = resetPasswordSchema.parse(body);

    // In real app:
    // 1. Verify reset token is valid and not expired
    // 2. Find user with matching reset token
    // 3. Hash new password
    // 4. Update user password
    // 5. Delete reset token from database

    // Mock implementation
    if (!resetToken || resetToken.length < 5) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
