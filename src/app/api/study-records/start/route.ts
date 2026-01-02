import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StudySessionRecord from '@/models/StudySessionRecord';
import Subject from '@/models/Subject';
import { getServerSession } from 'next-auth';

// POST - Start a new study session
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { subjectId, topic, estimatedDuration = 60 } = body;

    // Get user from session (you'll need to implement auth)
    const userId = body.userId; // Replace with actual auth

    if (!userId || !subjectId || !topic) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for ongoing session
    const ongoingSession = await StudySessionRecord.findOne({
      userId,
      status: { $in: ['ongoing', 'paused'] }
    });

    if (ongoingSession) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'You have an ongoing session. Please complete it first.',
          data: ongoingSession
        },
        { status: 400 }
      );
    }

    // Get subject info
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return NextResponse.json(
        { success: false, message: 'Subject not found' },
        { status: 404 }
      );
    }

    // Create new record
    const record = await StudySessionRecord.create({
      userId,
      subjectId,
      subjectName: subject.name,
      topic,
      startTime: new Date(),
      endTime: new Date(Date.now() + estimatedDuration * 60 * 1000),
      duration: 0,
      status: 'ongoing',
      focusScore: 0,
      breaks: 0,
      pomodoroCount: 0,
      notes: '',
      tags: []
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Study session started successfully',
        data: record
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error starting study session:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to start study session'
      },
      { status: 500 }
    );
  }
}
