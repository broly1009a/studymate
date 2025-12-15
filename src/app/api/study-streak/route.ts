import { NextRequest, NextResponse } from 'next/server';
import StudyStreak from '@/models/StudyStreak';
import connectDB from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    let streak = await StudyStreak.findOne({ userId }).lean();

    if (!streak) {
      const newStreak = new StudyStreak({ userId });
      streak = await newStreak.save();
    }

    return NextResponse.json({ success: true, data: streak });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch study streak', error: String(error) },
      { status: 500 }
    );
  }
}
