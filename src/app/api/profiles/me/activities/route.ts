import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/api/auth';

// Mock activities data - replace with DB query
const mockActivities = [
  {
    id: '1',
    type: 'study_session_completed',
    title: 'Completed a 2-hour study session',
    description: 'You finished a study session on Mathematics',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    icon: '📚',
  },
  {
    id: '2',
    type: 'question_answered',
    title: 'Answered a question',
    description: 'Your answer was marked as helpful by 5 users',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    icon: '💡',
  },
  {
    id: '3',
    type: 'badge_earned',
    title: 'Earned a badge',
    description: 'Congratulations! You earned the "100-day streak" badge',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    icon: '🏆',
  },
];

/**
 * GET /api/profiles/me/activities
 * Get user's activities
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

    // Get pagination params
    const page = request.nextUrl.searchParams.get('page') || '1';
    const limit = request.nextUrl.searchParams.get('limit') || '10';

    // In real app, query database with pagination
    const activities = mockActivities.slice(0, parseInt(limit));

    return NextResponse.json({ 
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: mockActivities.length,
      }
    });
  } catch (error) {
    console.error('Get activities error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
