import { NextRequest, NextResponse } from 'next/server';
import Event from '@/models/Event';
import connectDB from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 100);
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const sortBy = searchParams.get('sortBy') || 'date';
    const order = searchParams.get('order') === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }
    if (type) query.type = type;

    const events = await Event.find(query)
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Event.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch events', error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { title, description, type, date, time, location, image, organizer, tags, maxParticipants } = body;

    if (!title || !description || !type || !date || !time || !location || !organizer) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const event = new Event({
      title,
      description,
      type,
      date,
      time,
      location,
      image,
      organizer,
      tags: tags || [],
      maxParticipants,
    });

    await event.save();

    return NextResponse.json(
      { success: true, data: event, message: 'Event created successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create event', error: String(error) },
      { status: 500 }
    );
  }
}
