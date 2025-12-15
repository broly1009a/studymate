import { NextRequest, NextResponse } from 'next/server';
import Goal from '@/models/Goal';
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

    // For now, return mock stats
    // In production, calculate actual stats from database
    const quickStats = {
      todayStudyTime: 45,
      weeklyStudyTime: 320,
      questionsAnswered: 12,
      upcomingDeadlines: 3,
    };

    return NextResponse.json({
      success: true,
      data: quickStats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch statistics', error: String(error) },
      { status: 500 }
    );
  }
}
