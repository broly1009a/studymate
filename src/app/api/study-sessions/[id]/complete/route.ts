import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StudySession from '@/models/StudySession';
import ReputationHistory from '@/models/ReputationHistory';
import User from '@/models/User';

// POST - Complete a study session
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

    // Only creator can complete session manually
    if (session.creatorId.toString() !== userId) {
      return NextResponse.json(
        { success: false, message: 'Only session creator can complete the session' },
        { status: 403 }
      );
    }

    if (session.status === 'completed') {
      return NextResponse.json(
        { success: false, message: 'Session already completed' },
        { status: 400 }
      );
    }

    // Update status
    session.status = 'completed';
    await session.save();

    // Award reputation points to participants
    const participantPoints = 10;
    const creatorBonus = 20;

    // Award to all participants
    for (const participantId of session.participants) {
      await ReputationHistory.create({
        userId: participantId,
        points: participantPoints,
        reason: `Completed study session: ${session.title}`,
        type: 'earned',
        date: new Date()
      });

      await User.findByIdAndUpdate(participantId, {
        $inc: { reputation: participantPoints }
      });
    }

    // Extra bonus for creator
    await ReputationHistory.create({
      userId: session.creatorId,
      points: creatorBonus,
      reason: `Organized study session: ${session.title}`,
      type: 'earned',
      date: new Date()
    });

    await User.findByIdAndUpdate(session.creatorId, {
      $inc: { reputation: creatorBonus }
    });

    // TODO: Request feedback from participants
    // TODO: Send notifications

    return NextResponse.json(
      {
        success: true,
        message: 'Session completed successfully',
        data: {
          session,
          rewards: {
            participants: participantPoints,
            creator: creatorBonus
          }
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error completing session:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to complete session'
      },
      { status: 500 }
    );
  }
}
