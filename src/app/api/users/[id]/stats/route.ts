import { NextRequest, NextResponse } from 'next/server';

// Mock user statistics
const mockUserStats: Record<string, any> = {
  '1': {
    userId: '1',
    totalStudyHours: 1250,
    studyStreak: 45,
    longestStreak: 120,
    questionsAnswered: 342,
    questionsAsked: 89,
    groupsJoined: 12,
    partnersConnected: 28,
    competitionsParticipated: 5,
    goalsCompleted: 67,
    reputation: 2850,
    badges: 15,
    followers: 234,
    following: 156,
    posts: 45,
    completionRate: 85,
  },
};

/**
 * GET /api/users/[id]/stats
 * Get user statistics
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // In real app, fetch from database and calculate stats
    const stats = mockUserStats[id];

    if (!stats) {
      return NextResponse.json(
        { error: 'User statistics not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
