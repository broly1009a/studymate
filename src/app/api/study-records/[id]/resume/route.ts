import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StudySessionRecord from '@/models/StudySessionRecord';

// POST - Resume a paused study session
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
      status: 'paused'
    });

    if (!record) {
      return NextResponse.json(
        { success: false, message: 'No paused session found' },
        { status: 404 }
      );
    }

    // Update status
    record.status = 'ongoing';
    await record.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Session resumed',
        data: record
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error resuming session:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to resume session'
      },
      { status: 500 }
    );
  }
}
