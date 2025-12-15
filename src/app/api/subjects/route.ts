import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Subject from '@/models/Subject';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const subjects = await Subject.find({ userId })
      .sort({ lastStudied: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Subject.countDocuments({ userId });

    return NextResponse.json({
      data: subjects,
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
    const { userId, name, color, icon, goalHours, topics } = body;

    if (!userId || !name) {
      return NextResponse.json({ error: 'userId and name are required' }, { status: 400 });
    }

    const newSubject = new Subject({
      userId,
      name,
      color: color || '#3b82f6',
      icon: icon || '📚',
      goalHours: goalHours || 0,
      topics: topics || [],
    });

    const savedSubject = await newSubject.save();

    return NextResponse.json(savedSubject, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
