import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StudySessionRecord from '@/models/StudySessionRecord';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const record = await StudySessionRecord.findById(id).populate('userId subjectId');

    if (!record) {
      return NextResponse.json({ error: 'Study record not found' }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await req.json();
    const { topic, notes, focusScore, breaks, pomodoroCount, status, tags } = body;

    const updatedRecord = await StudySessionRecord.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(topic && { topic }),
          ...(notes && { notes }),
          ...(focusScore !== undefined && { focusScore }),
          ...(breaks !== undefined && { breaks }),
          ...(pomodoroCount !== undefined && { pomodoroCount }),
          ...(status && { status }),
          ...(tags && { tags }),
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedRecord) {
      return NextResponse.json({ error: 'Study record not found' }, { status: 404 });
    }

    return NextResponse.json(updatedRecord);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedRecord = await StudySessionRecord.findByIdAndDelete(id);

    if (!deletedRecord) {
      return NextResponse.json({ error: 'Study record not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Study record deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
