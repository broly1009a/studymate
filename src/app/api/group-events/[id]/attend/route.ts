import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import GroupEvent from '@/models/GroupEvent';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const body = await req.json();
    const { userId, status } = body;

    if (!userId || !status) {
      return NextResponse.json({ error: 'userId and status are required' }, { status: 400 });
    }

    const event = await GroupEvent.findById(params.id);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Find or create attendee
    const attendeeIndex = event.attendees.findIndex((a) => a.userId.toString() === userId);

    if (attendeeIndex !== -1) {
      event.attendees[attendeeIndex].status = status;
    } else {
      event.attendees.push({
        userId,
        status,
      });
    }

    const updatedEvent = await event.save();
    await updatedEvent.populate('creatorId', 'username avatar');

    return NextResponse.json(updatedEvent);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
