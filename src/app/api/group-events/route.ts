import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import GroupEvent from '@/models/GroupEvent';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get('groupId');
    const type = searchParams.get('type');
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!groupId) {
      return NextResponse.json({ error: 'groupId is required' }, { status: 400 });
    }

    const query: any = { groupId };
    if (type) query.type = type;

    const events = await GroupEvent.find(query)
      .populate('creatorId', 'username avatar')
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(limit);

    const total = await GroupEvent.countDocuments(query);

    return NextResponse.json({
      data: events,
      total,
      skip,
      limit,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { groupId, title, description, startTime, endTime, location, type, creatorId } = body;

    if (!groupId || !title || !description || !startTime || !endTime || !location || !creatorId) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    const newEvent = new GroupEvent({
      groupId,
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      location,
      type: type || 'study_session',
      creatorId,
      attendees: [{ userId: creatorId, status: 'going' }],
    });

    const savedEvent = await newEvent.save();
    const populatedEvent = await savedEvent.populate('creatorId', 'username avatar');

    return NextResponse.json(populatedEvent, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
