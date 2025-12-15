import { NextRequest, NextResponse } from 'next/server';
import Event from '@/models/Event';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(
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

    const event = await Event.findById(id).lean();

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch event', error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const event = await Event.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: event, message: 'Event updated successfully' }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update event', error: String(error) },
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid event ID' },
        { status: 400 }
      );
    }

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: event, message: 'Event deleted successfully' }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete event', error: String(error) },
      { status: 500 }
    );
  }
}
