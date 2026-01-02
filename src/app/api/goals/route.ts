import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Goal from '@/models/Goal';
// import Subject from '@/models/Subject';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const query: any = { userId };
    if (status) query.status = status;
    if (category) query.category = category;

    const goals = await Goal.find(query)
      .populate('subjectId', 'name')
      .sort({ priority: -1, endDate: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Goal.countDocuments(query);

    return NextResponse.json({
      data: goals,
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
    const {
      userId,
      title,
      description,
      type,
      category,
      targetValue,
      unit,
      startDate,
      endDate,
      priority,
      subjectId,
      subjectName,
      color,
      icon,
    } = body;

    if (!userId || !title || !description || !targetValue || !unit || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return NextResponse.json(
        { error: 'Start date must be before end date' },
        { status: 400 }
      );
    }

    const newGoal = new Goal({
      userId,
      title,
      description,
      type: type || 'custom',
      category: category || 'weekly',
      targetValue,
      unit,
      startDate: start,
      endDate: end,
      priority: priority || 'medium',
      subjectId: subjectId || null,
      subjectName: subjectName || null,
      color: color || '#3b82f6',
      icon: icon || '🎯',
    });

    const savedGoal = await newGoal.save();

    return NextResponse.json(savedGoal, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
