import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StudySessionRecord from '@/models/StudySessionRecord';
import ReputationHistory from '@/models/ReputationHistory';
import User from '@/models/User';

// POST - Complete a Pomodoro session
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id: recordId } = await params;
    const body = await request.json();
    const { userId, focusRating = 80 } = body; // focusRating: 0-100

    const record = await StudySessionRecord.findOne({
      _id: recordId,
      userId
    });

    if (!record) {
      return NextResponse.json(
        { success: false, message: 'Session not found' },
        { status: 404 }
      );
    }

    // Increment pomodoro count
    record.pomodoroCount += 1;

    // Calculate average focus score
    const currentTotal = record.focusScore * (record.pomodoroCount - 1);
    record.focusScore = Math.round((currentTotal + focusRating) / record.pomodoroCount);

    await record.save();

    // Award points for milestone (every 4 pomodoros)
    if (record.pomodoroCount % 4 === 0) {
      const points = 5;
      
      await ReputationHistory.create({
        userId,
        points,
        reason: `Completed ${record.pomodoroCount} pomodoros`,
        type: 'earned',
        date: new Date()
      });

      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: points }
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Pomodoro completed',
        data: record,
        milestone: record.pomodoroCount % 4 === 0 ? {
          points: 5,
          message: `Great job! ${record.pomodoroCount} pomodoros completed!`
        } : null
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error completing pomodoro:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to complete pomodoro'
      },
      { status: 500 }
    );
  }
}
