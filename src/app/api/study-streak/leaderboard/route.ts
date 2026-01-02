import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StudyStreak from '@/models/StudyStreak';

// GET - Get streak leaderboard
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type') || 'current'; // 'current' | 'longest'

    const sortField = type === 'current' ? 'current' : 'longest';

    const leaderboard = await StudyStreak
      .find({ [sortField]: { $gt: 0 } })
      .populate('userId', 'fullName avatar')
      .sort({ [sortField]: -1 })
      .limit(limit);

    return NextResponse.json(
      {
        success: true,
        data: leaderboard.map((entry: any, index) => ({
          rank: index + 1,
          user: {
            id: entry.userId._id,
            name: entry.userId.fullName,
            avatar: entry.userId.avatar
          },
          streak: type === 'current' ? entry.current : entry.longest,
          lastStudyDate: entry.lastStudyDate
        }))
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching streak leaderboard:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch leaderboard'
      },
      { status: 500 }
    );
  }
}
