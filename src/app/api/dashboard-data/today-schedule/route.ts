import { NextRequest, NextResponse } from 'next/server';
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

    // For now, return mock today's schedule
    // In production, fetch from StudySessionRecord or Event collection
    // filtered by today's date and userId
    const todaySchedule = [
      {
        id: '1',
        title: 'Phiên học Toán',
        type: 'study-session',
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
        subject: 'Giải tích',
        participants: ['Nguyễn Văn A'],
      },
      {
        id: '2',
        title: 'Họp nhóm Vật lý',
        type: 'group-meeting',
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
        subject: 'Cơ học lượng tử',
        participants: ['Alice', 'Bob', 'Charlie'],
      },
    ];

    return NextResponse.json({
      success: true,
      data: todaySchedule,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch today schedule', error: String(error) },
      { status: 500 }
    );
  }
}
