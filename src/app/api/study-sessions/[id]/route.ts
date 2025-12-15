import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StudySession from '@/models/StudySession';
import mongoose from 'mongoose';

// GET - Fetch single study session
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid session ID',
        },
        { status: 400 }
      );
    }

    const session = await StudySession.findById(id)
      .populate('creatorId', 'fullName avatar email')
      .populate('participants', 'fullName avatar email');

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: 'Study session not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: session,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch study session',
      },
      { status: 500 }
    );
  }
}

// PUT - Update study session
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid session ID',
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      subject,
      topic,
      goal,
      startTime,
      endTime,
      location,
      online,
      meetLink,
      maxParticipants,
      status,
      notes,
    } = body;

    const session = await StudySession.findById(id);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: 'Study session not found',
        },
        { status: 404 }
      );
    }

    // Update fields
    if (title) session.title = title;
    if (description) session.description = description;
    if (subject) session.subject = subject;
    if (topic) session.topic = topic;
    if (goal !== undefined) session.goal = goal;
    if (location !== undefined) session.location = location;
    if (online !== undefined) session.online = online;
    if (meetLink !== undefined) session.meetLink = meetLink;
    if (maxParticipants) session.maxParticipants = maxParticipants;
    if (status) session.status = status;
    if (notes !== undefined) session.notes = notes;

    // Update duration if time changed
    if (startTime || endTime) {
      const start = startTime ? new Date(startTime) : session.startTime;
      const end = endTime ? new Date(endTime) : session.endTime;
      session.startTime = start;
      session.endTime = end;
      session.duration = Math.round((end.getTime() - start.getTime()) / 60000);
    }

    await session.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Study session updated successfully',
        data: session,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update study session',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete study session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid session ID',
        },
        { status: 400 }
      );
    }

    const session = await StudySession.findByIdAndDelete(id);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: 'Study session not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Study session deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete study session',
      },
      { status: 500 }
    );
  }
}
