import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Activity from '@/models/Activity';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const query: any = { userId };
    if (type) query.type = type;

    const activities = await Activity.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Activity.countDocuments(query);

    return NextResponse.json({
      data: activities,
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
    const { userId, type, title, description, metadata } = body;

    if (!userId || !type || !title || !description) {
      return NextResponse.json(
        { error: 'userId, type, title, and description are required' },
        { status: 400 }
      );
    }

    const newActivity = new Activity({
      userId,
      type,
      title,
      description,
      timestamp: new Date(),
      metadata: metadata || {},
    });

    const savedActivity = await newActivity.save();

    return NextResponse.json(savedActivity, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
