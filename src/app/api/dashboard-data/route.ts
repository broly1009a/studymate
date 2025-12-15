import { NextRequest, NextResponse } from 'next/server';
import Event from '@/models/Event';
import Goal from '@/models/Goal';
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

    // Fetch all data in parallel
    const [events, goals, streak] = await Promise.all([
      Event.find({}).limit(6).sort({ date: 1 }).lean(),
      Goal.find({ userId, status: 'active' }).limit(2).lean(),
      StudyStreak.findOne({ userId }).lean(),
    ]);

    const quickStats = {
      todayStudyTime: 45,
      weeklyStudyTime: 320,
      questionsAnswered: 12,
      upcomingDeadlines: goals.length,
    };

    return NextResponse.json({
      success: true,
      data: {
        events,
        goals,
        streak: streak || { current: 0, longest: 0 },
        quickStats,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard data', error: String(error) },
      { status: 500 }
    );
  }
}
