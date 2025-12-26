import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { resetPasswordSchema } from '@/lib/validations';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/api/auth';
import { verifyToken } from '@/lib/email';
import VerificationToken from '@/models/VerificationToken';

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

    // Connect to database
    await connectDB();

    // Verify reset token
    const tokenData = await verifyToken(resetToken, 'password-reset');

    if (!tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findById(tokenData.userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(validatedData.password);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Delete the used token
    await VerificationToken.deleteOne({ _id: tokenData._id });

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
