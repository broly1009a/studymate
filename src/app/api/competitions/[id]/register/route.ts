import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Competition from '@/models/Competition';
import mongoose from 'mongoose';

// POST - Register/Unregister participant
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { userId, action } = body; // action: 'register' or 'unregister'

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid ID',
        },
        { status: 400 }
      );
    }

    const competition = await Competition.findById(id);

    if (!competition) {
      return NextResponse.json(
        {
          success: false,
          message: 'Competition not found',
        },
        { status: 404 }
      );
    }

    // Check registration dates
    const now = new Date();
    if (now < competition.registrationStartDate || now > competition.registrationEndDate) {
      return NextResponse.json(
        {
          success: false,
          message: 'Registration is not open',
        },
        { status: 400 }
      );
    }

    const userIdObj = new mongoose.Types.ObjectId(userId);
    const isParticipant = competition.participants.includes(userIdObj);

    if (action === 'register' && !isParticipant) {
      if (
        competition.maxParticipants &&
        competition.participants_count >= competition.maxParticipants
      ) {
        return NextResponse.json(
          {
            success: false,
            message: 'Competition is full',
          },
          { status: 400 }
        );
      }
      competition.participants.push(userIdObj);
      competition.participants_count += 1;
    } else if (action === 'unregister' && isParticipant) {
      competition.participants = competition.participants.filter(
        (pId) => !pId.equals(userIdObj)
      );
      competition.participants_count = Math.max(0, competition.participants_count - 1);
    }

    await competition.save();

    return NextResponse.json(
      {
        success: true,
        message: `User ${action}ed successfully`,
        data: {
          participants_count: competition.participants_count,
          participants: competition.participants,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to register/unregister',
      },
      { status: 500 }
    );
  }
}
