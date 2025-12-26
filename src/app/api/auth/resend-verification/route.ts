import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { createVerificationToken, sendVerificationEmail } from '@/lib/email';

const resendEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = resendEmailSchema.parse(body);

    // Connect to database
    await connectDB();

    // Find user
    const user = await User.findOne({ email: validatedData.email });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: 'If an account exists with this email, a verification email will be sent' },
        { status: 200 }
      );
    }

    // Check if already verified
    if (user.verified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Create and send new verification token
    try {
      const verificationToken = await createVerificationToken(
        user._id.toString(),
        user.email,
        'email'
      );
      await sendVerificationEmail(user.email, user.fullName, verificationToken);

      return NextResponse.json(
        { message: 'Verification email sent successfully' },
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again later.' },
        { status: 500 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
