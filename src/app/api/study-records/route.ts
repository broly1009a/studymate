import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StudySessionRecord from '@/models/StudySessionRecord';
import Subject from '@/models/Subject';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const subjectId = searchParams.get('subjectId');
    const status = searchParams.get('status');
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const query: any = { userId };
    if (subjectId) query.subjectId = subjectId;
    if (status) query.status = status;

    const records = await StudySessionRecord.find(query)
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(limit);

    const total = await StudySessionRecord.countDocuments(query);

    return NextResponse.json({
      data: records,
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
      subjectId,
      subjectName,
      topic,
      startTime,
      endTime,
      focusScore,
      breaks,
      pomodoroCount,
      notes,
      tags,
    } = body;

    if (!userId || !subjectId || !topic || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'userId, subjectId, topic, startTime, endTime are required' },
        { status: 400 }
      );
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = Math.round((end.getTime() - start.getTime()) / 60000); // in minutes

    const newRecord = new StudySessionRecord({
      userId,
      subjectId,
      subjectName,
      topic,
      startTime: start,
      endTime: end,
      duration,
      focusScore: focusScore || 0,
      breaks: breaks || 0,
      pomodoroCount: pomodoroCount || 0,
      notes: notes || '',
      tags: tags || [],
      status: 'completed',
    });

    const savedRecord = await newRecord.save();

    // Update subject metrics
    await Subject.findByIdAndUpdate(
      subjectId,
      {
        $inc: {
          sessionsCount: 1,
          totalHours: duration / 60,
        },
        $set: { lastStudied: new Date() },
      }
    );

    return NextResponse.json(savedRecord, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
