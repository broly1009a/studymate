import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StudySession from '@/models/StudySession';

// POST - Leave a study session
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id: sessionId } = await params;
    const body = await request.json();
    const userId = body.userId; // Replace with actual auth

    // Find session
    const session = await StudySession.findById(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Session not found' },
        { status: 404 }
      );
    }

    // Check if user is participant
    const participantIndex = session.participants.findIndex(
      (p: any) => p.toString() === userId
    );

    if (participantIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'You are not a participant of this session' },
        { status: 400 }
      );
    }

    // Cannot leave if session is ongoing
    if (session.status === 'ongoing') {
      return NextResponse.json(
        { success: false, message: 'Cannot leave while session is ongoing' },
        { status: 400 }
      );
    }

    // Remove participant
    session.participants.splice(participantIndex, 1);
    session.participants_count -= 1;
    await session.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully left the session',
        data: session
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error leaving session:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to leave session'
      },
      { status: 500 }
    );
  }
}
