import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StudySession from '@/models/StudySession';

// POST - Start a study session
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id: sessionId } = await params;
    const body = await request.json();
    const userId = body.userId; // Replace with actual auth

    const session = await StudySession.findById(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Session not found' },
        { status: 404 }
      );
    }

    // Only creator can start session manually
    if (session.creatorId.toString() !== userId) {
      return NextResponse.json(
        { success: false, message: 'Only session creator can start the session' },
        { status: 403 }
      );
    }

    if (session.status !== 'scheduled') {
      return NextResponse.json(
        { success: false, message: 'Session cannot be started' },
        { status: 400 }
      );
    }

    // Update status
    session.status = 'ongoing';
    await session.save();

    // TODO: Notify all participants
    // TODO: Send real-time notification via Socket.io

    return NextResponse.json(
      {
        success: true,
        message: 'Session started successfully',
        data: session
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error starting session:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to start session'
      },
      { status: 500 }
    );
  }
}
