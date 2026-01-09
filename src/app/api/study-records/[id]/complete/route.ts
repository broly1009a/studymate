import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StudySessionRecord from '@/models/StudySessionRecord';
import StudyStreak from '@/models/StudyStreak';
import ReputationHistory from '@/models/ReputationHistory';
import User from '@/models/User';
import Subject from '@/models/Subject';

// POST - Complete a study session
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id: recordId } = await params;
    const body = await request.json();
    const { userId, notes = '', tags = [], finalFocusScore } = body;

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

    // Update record
    record.endTime = new Date();
    record.duration = Math.round((record.endTime.getTime() - record.startTime.getTime()) / (1000 * 60));
    record.status = 'completed';
    record.notes = notes;
    record.tags = tags;
    if (finalFocusScore !== undefined) {
      record.focusScore = finalFocusScore;
    }
    await record.save();

    // Update Study Streak
    const streakResult = await updateStudyStreak(userId);

    // Award reputation based on duration
    let points = 0;
    if (record.duration >= 120) points = 30; // 2h+
    else if (record.duration >= 60) points = 20; // 1h+
    else if (record.duration >= 30) points = 10; // 30min+
    else points = 5;

    // Bonus for high focus score
    if (record.focusScore >= 80) {
      points += 10;
    }

    await ReputationHistory.create({
      userId,
      points,
      reason: `Completed ${record.duration} min study session on ${record.subjectName}`,
      type: 'earned',
      date: new Date()
    });

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: points }
    });

    // Update Subject statistics
    await Subject.findByIdAndUpdate(record.subjectId, {
      $inc: {
        totalStudyTime: record.duration,
        sessionsCompleted: 1
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Study session completed successfully',
        data: {
          record,
          streak: streakResult,
          reputation: {
            points,
            reason: `Study session completed`
          }
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error completing session:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to complete session'
      },
      { status: 500 }
    );
  }
}

// Helper function to update study streak
async function updateStudyStreak(userId: string) {
  let streak = await StudyStreak.findOne({ userId });

  if (!streak) {
    streak = await StudyStreak.create({
      userId,
      current: 1,
      longest: 1,
      lastStudyDate: new Date()
    });
    return streak;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastStudy = new Date(streak.lastStudyDate);
  lastStudy.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    // Same day - no change
  } else if (daysDiff === 1) {
    // Consecutive day - increase streak
    streak.current += 1;
    if (streak.current > streak.longest) {
      streak.longest = streak.current;
    }

    // Check milestone achievements
    const milestones = [3, 7, 14, 30, 60, 90, 180, 365];
    if (milestones.includes(streak.current)) {
      const bonusPoints = streak.current >= 30 ? 100 : streak.current * 5;
      
      await ReputationHistory.create({
        userId,
        points: bonusPoints,
        reason: `Achieved ${streak.current}-day study streak!`,
        type: 'earned',
        date: new Date()
      });

      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: bonusPoints }
      });
    }
  } else if (daysDiff > 1) {
    // Missed days - reset streak
    streak.current = 1;
  }

  streak.lastStudyDate = new Date();
  await streak.save();

  return streak;
}
