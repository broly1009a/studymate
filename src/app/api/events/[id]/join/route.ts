import { NextRequest, NextResponse } from 'next/server';
import Event from '@/models/Event';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import { verifyToken } from '@/lib/api/auth';
import User from '@/models/User';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // Authentication check
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid event ID' },
        { status: 400 }
      );
    }

    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if user is already a participant
    const userId = user._id.toString();
    const userObjectId = new mongoose.Types.ObjectId(userId);
    if (event.participants.some((id: any) => id.equals(userObjectId))) {
      return NextResponse.json(
        { success: false, message: 'You are already a participant' },
        { status: 400 }
      );
    }

    // Check if event is full
    if (event.maxParticipants && event.participantCount >= event.maxParticipants) {
      return NextResponse.json(
        { success: false, message: 'Event is full' },
        { status: 400 }
      );
    }

    // Add user to participants
    event.participants.push(userObjectId);
    event.participantCount = event.participants.length;
    await event.save();

    return NextResponse.json({
      success: true,
      data: event,
      message: 'Successfully joined the event',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to join event', error: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // Authentication check
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid event ID' },
        { status: 400 }
      );
    }

    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if user is a participant
    const userId = user._id.toString();
    const userObjectId = new mongoose.Types.ObjectId(userId);
    if (!event.participants.some((id: any) => id.equals(userObjectId))) {
      return NextResponse.json(
        { success: false, message: 'You are not a participant of this event' },
        { status: 400 }
      );
    }

    // Remove user from participants
    event.participants = event.participants.filter((id: any) => !id.equals(userObjectId));
    event.participantCount = event.participants.length;
    await event.save();

    return NextResponse.json({
      success: true,
      data: event,
      message: 'Successfully left the event',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to leave event', error: String(error) },
      { status: 500 }
    );
  }
}
