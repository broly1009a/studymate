import { NextRequest, NextResponse } from 'next/server';
import StudyStreak from '@/models/StudyStreak';
import { connectDB } from '@/lib/mongodb';

// GET - Get user's study streak
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

    let streak = await StudyStreak.findOne({ userId });

    if (!streak) {
      streak = await StudyStreak.create({ userId, current: 0, longest: 0 });
    }

    // Calculate days since last study
    let daysSinceLastStudy = null;
    if (streak.lastStudyDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastStudy = new Date(streak.lastStudyDate);
      lastStudy.setHours(0, 0, 0, 0);
      daysSinceLastStudy = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));
    }

    // Check if streak is at risk (not studied today)
    const isAtRisk = daysSinceLastStudy !== null && daysSinceLastStudy >= 1 && streak.current > 0;

    return NextResponse.json({
      success: true,
      data: {
        ...streak.toObject(),
        daysSinceLastStudy,
        isAtRisk,
        status: daysSinceLastStudy === 0 ? 'active' : 
                daysSinceLastStudy === 1 ? 'at_risk' : 
                'broken'
      }
    });
  } catch (error: any) {
    console.error('Error fetching study streak:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch study streak', error: error.message },
      { status: 500 }
    );
  }
}
