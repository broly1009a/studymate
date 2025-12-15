import { NextRequest, NextResponse } from 'next/server';

// Mock activities data
const mockActivities: Record<string, any[]> = {
  '1': [
    {
      id: '1',
      userId: '1',
      type: 'question_asked',
      title: 'Hỏi về Calculus',
      description: 'Giải thích đạo hàm của hàm lượng giác',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 12,
      replies: 5,
    },
    {
      id: '2',
      userId: '1',
      type: 'answer_given',
      title: 'Trả lời về Physics',
      description: 'Giải thích về định luật Newton thứ hai',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 28,
      replies: 3,
    },
    {
      id: '3',
      userId: '1',
      type: 'session_completed',
      title: 'Hoàn thành phiên học',
      description: '2 giờ học Toán học',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      likes: 5,
      replies: 0,
    },
  ],
};

/**
 * GET /api/users/[id]/activities
 * Get user activities with pagination
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // In real app, fetch from database with pagination
    const activities = mockActivities[id] || [];
    const start = (page - 1) * limit;
    const paginatedActivities = activities.slice(start, start + limit);

    return NextResponse.json({
      success: true,
      data: paginatedActivities,
      pagination: {
        page,
        limit,
        total: activities.length,
        pages: Math.ceil(activities.length / limit),
      },
    });
  } catch (error) {
    console.error('Get user activities error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
