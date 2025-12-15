import { NextRequest, NextResponse } from 'next/server';
import StudyStreak from '@/models/StudyStreak';
import connectDB from '@/lib/mongodb';

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    let streak = await StudyStreak.findOne({ userId });

    if (!streak) {
      const newStreak = new StudyStreak({ userId, current: 1 });
      streak = await newStreak.save();
      return NextResponse.json(
        { success: true, data: streak, message: 'Study streak started' },
        { status: 201 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastStudy = new Date(streak.lastStudyDate || 0);
    lastStudy.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      return NextResponse.json(
        { success: true, data: streak, message: 'Already studied today' }
      );
    }

    if (daysDiff === 1) {
      streak.current += 1;
      if (streak.current > streak.longest) {
        streak.longest = streak.current;
      }
    } else {
      streak.current = 1;
    }

    streak.lastStudyDate = new Date();
    await streak.save();

    return NextResponse.json(
      { success: true, data: streak, message: 'Study streak updated' }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update study streak', error: String(error) },
      { status: 500 }
    );
  }
}
