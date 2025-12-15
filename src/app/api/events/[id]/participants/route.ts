import { NextRequest, NextResponse } from 'next/server';
import Event from '@/models/Event';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid event ID' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
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

    if (event.participants.some((p: any) => p.toString() === userId)) {
      return NextResponse.json(
        { success: false, message: 'User already joined this event' },
        { status: 409 }
      );
    }

    if (event.maxParticipants && event.participantCount >= event.maxParticipants) {
      return NextResponse.json(
        { success: false, message: 'Event is full' },
        { status: 409 }
      );
    }

    event.participants.push(new mongoose.Types.ObjectId(userId));
    event.participantCount += 1;
    await event.save();

    return NextResponse.json(
      { success: true, data: event, message: 'Joined event successfully' },
      { status: 201 }
    );
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

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid event ID' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
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

    const participantIndex = event.participants.findIndex((p: any) => p.toString() === userId);

    if (participantIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'User not in event' },
        { status: 404 }
      );
    }

    event.participants.splice(participantIndex, 1);
    event.participantCount = Math.max(0, event.participantCount - 1);
    await event.save();

    return NextResponse.json(
      { success: true, data: event, message: 'Left event successfully' }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to leave event', error: String(error) },
      { status: 500 }
    );
  }
}
