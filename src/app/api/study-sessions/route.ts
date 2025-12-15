import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StudySession from '@/models/StudySession';
import User from '@/models/User';
import mongoose from 'mongoose';

// GET - Fetch all study sessions with filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const subject = searchParams.get('subject');
    const status = searchParams.get('status') || 'scheduled';
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;
    let query: any = { status };

    if (subject) {
      query.subject = subject;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const sessions = await StudySession.find(query)
      .populate('creatorId', 'fullName avatar')
      .populate('participants', 'fullName avatar')
      .sort({ startTime: 1 })
      .skip(skip)
      .limit(limit);

    const total = await StudySession.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: sessions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch study sessions',
      },
      { status: 500 }
    );
  }
}

// POST - Create new study session
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      title,
      description,
      creatorId,
      creatorName,
      creatorAvatar,
      subject,
      topic,
      goal,
      startTime,
      endTime,
      location,
      online,
      meetLink,
      maxParticipants,
    } = body;

    // Validation
    if (
      !title ||
      !description ||
      !creatorId ||
      !subject ||
      !topic ||
      !startTime ||
      !endTime
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Calculate duration
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = Math.round((end.getTime() - start.getTime()) / 60000);

    // Create session
    const session = new StudySession({
      title,
      description,
      creatorId,
      creatorName,
      creatorAvatar,
      subject,
      topic,
      goal: goal || '',
      startTime: start,
      endTime: end,
      duration,
      location: location || null,
      online: online !== false,
      meetLink: meetLink || null,
      maxParticipants: maxParticipants || 10,
      participants: [creatorId], // Add creator as participant
      participants_count: 1,
    });

    await session.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Study session created successfully',
        data: session,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create study session',
      },
      { status: 500 }
    );
  }
}
