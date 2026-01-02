import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StudySessionRecord from '@/models/StudySessionRecord';

// POST - Pause an ongoing study session
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const recordId = params.id;
    const body = await request.json();
    const userId = body.userId; // Replace with actual auth

    const record = await StudySessionRecord.findOne({
      _id: recordId,
      userId,
      status: 'ongoing'
    });

    if (!record) {
      return NextResponse.json(
        { success: false, message: 'No active session found' },
        { status: 404 }
      );
    }

    // Update status
    record.status = 'paused';
    record.breaks += 1;
    await record.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Session paused',
        data: record
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error pausing session:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to pause session'
      },
      { status: 500 }
    );
  }
}
