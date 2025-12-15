import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import GroupEvent from '@/models/GroupEvent';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const event = await GroupEvent.findById(params.id).populate('creatorId', 'username avatar');

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const body = await req.json();
    const { title, description, startTime, endTime, location, type } = body;

    const updatedEvent = await GroupEvent.findByIdAndUpdate(
      params.id,
      {
        $set: {
          ...(title && { title }),
          ...(description && { description }),
          ...(startTime && { startTime: new Date(startTime) }),
          ...(endTime && { endTime: new Date(endTime) }),
          ...(location && { location }),
          ...(type && { type }),
        },
      },
      { new: true, runValidators: true }
    ).populate('creatorId', 'username avatar');

    if (!updatedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(updatedEvent);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const deletedEvent = await GroupEvent.findByIdAndDelete(params.id);

    if (!deletedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
