import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/api/auth';

// Mock user stats - replace with DB query
const mockUserStats = {
  totalStudyHours: 1250,
  studyStreak: 45,
  longestStreak: 120,
  questionsAnswered: 342,
  questionsAsked: 89,
  groupsJoined: 12,
  partnersConnected: 28,
  competitionsParticipated: 5,
  goalsCompleted: 67,
  reputation: 1520,
  badges: 12,
  followers: 156,
  following: 89,
};

/**
 * GET /api/profiles/me/stats
 * Get user's statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // In real app, calculate stats from database
    return NextResponse.json({ stats: mockUserStats });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
