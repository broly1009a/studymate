import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StudySession from '@/models/StudySession';
import mongoose from 'mongoose';

// POST - Join/Leave study session
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { userId, action } = body; // action: 'join' or 'leave'

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid ID',
        },
        { status: 400 }
      );
    }

    const session = await StudySession.findById(id);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: 'Study session not found',
        },
        { status: 404 }
      );
    }

    const userIdObj = new mongoose.Types.ObjectId(userId);
    const isParticipant = session.participants.includes(userIdObj);

    if (action === 'join' && !isParticipant) {
      if (
        session.maxParticipants &&
        session.participants_count >= session.maxParticipants
      ) {
        return NextResponse.json(
          {
            success: false,
            message: 'Session is full',
          },
          { status: 400 }
        );
      }
      session.participants.push(userIdObj);
      session.participants_count += 1;
    } else if (action === 'leave' && isParticipant) {
      session.participants = session.participants.filter(
        (pId) => !pId.equals(userIdObj)
      );
      session.participants_count = Math.max(0, session.participants_count - 1);
    }

    await session.save();

    return NextResponse.json(
      {
        success: true,
        message: `User ${action}ed session successfully`,
        data: {
          participants_count: session.participants_count,
          participants: session.participants,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to join/leave session',
      },
      { status: 500 }
    );
  }
}
