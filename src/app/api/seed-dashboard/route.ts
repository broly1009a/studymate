import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';
import Activity from '@/models/Activity';
import Event from '@/models/Event';
import Goal from '@/models/Goal';
import StudyStreak from '@/models/StudyStreak';
import StudySession from '@/models/StudySession';

const MOCK_USER_ID = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      studyStreak,
      todaySchedule,
      recentActivities,
      studyGoals,
      upcomingEvents,
      mockTinderEvents,
      clearExisting = false,
    } = body;

    const results: any = {};

    // Clear existing data if requested
    if (clearExisting) {
      await Promise.all([
        StudyStreak.deleteMany({ userId: MOCK_USER_ID }),
        StudySession.deleteMany({ creatorId: MOCK_USER_ID }),
        Activity.deleteMany({ userId: MOCK_USER_ID }),
        Goal.deleteMany({ userId: MOCK_USER_ID }),
        Event.deleteMany({ organizer: 'Mock Organizer' }),
        Event.deleteMany({ organizer: { $in: ['ACM ICPC Vietnam', 'Google Developer Vietnam', 'Design Club UIT'] } }),
      ]);
    }

    // Insert StudyStreak
    if (studyStreak) {
      const streakData = {
        userId: MOCK_USER_ID,
        current: studyStreak.current,
        longest: studyStreak.longest,
        lastStudyDate: new Date(studyStreak.lastStudyDate),
      };
      const streak = await StudyStreak.findOneAndUpdate(
        { userId: MOCK_USER_ID },
        streakData,
        { upsert: true, new: true }
      );
      results.studyStreak = streak;
    }

    // Insert Today Schedule (Study Sessions)
    if (todaySchedule && Array.isArray(todaySchedule)) {
      const sessions = todaySchedule.map((session: any) => ({
        title: session.title,
        description: `Study session for ${session.subject}`,
        creatorId: MOCK_USER_ID,
        creatorName: 'Mock User',
        subject: session.subject,
        topic: session.subject,
        startTime: new Date(session.startTime),
        endTime: new Date(session.endTime),
        duration: Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60)),
        location: 'Mock Location',
        online: false,
        maxParticipants: 10,
        participants: [], // Empty for mock
        participants_count: session.participants?.length || 0,
        status: 'scheduled',
        resources: [],
      }));
      const insertedSessions = await StudySession.insertMany(sessions);
      results.todaySchedule = insertedSessions;
    }

    // Insert Recent Activities
    if (recentActivities && Array.isArray(recentActivities)) {
      const activities = recentActivities.map((activity: any) => ({
        userId: MOCK_USER_ID,
        type: activity.type === 'answer' ? 'question_answered' :
              activity.type === 'match' ? 'partner_connected' :
              activity.type === 'group' ? 'group_joined' : 'study_session',
        title: activity.title,
        description: activity.description,
        timestamp: new Date(activity.timestamp),
        metadata: {},
      }));
      const insertedActivities = await Activity.insertMany(activities);
      results.recentActivities = insertedActivities;
    }

    // Insert Study Goals
    if (studyGoals && Array.isArray(studyGoals)) {
      const goals = studyGoals.map((goal: any) => ({
        userId: MOCK_USER_ID,
        title: goal.title,
        description: goal.description,
        type: goal.unit === 'hours' ? 'study_hours' : 'custom',
        category: 'monthly',
        targetValue: goal.target,
        currentValue: goal.current,
        unit: goal.unit,
        startDate: new Date(),
        endDate: new Date(goal.deadline),
        status: 'active',
        priority: 'medium',
        subjectName: goal.title.includes('study') ? 'General' : 'Questions',
      }));
      const insertedGoals = await Goal.insertMany(goals);
      results.studyGoals = insertedGoals;
    }

    // Insert Upcoming Events
    if (upcomingEvents && Array.isArray(upcomingEvents)) {
      const events = upcomingEvents.map((event: any) => ({
        title: event.title,
        description: event.description || event.title,
        type: event.type === 'deadline' ? 'exam' : event.type, // Map deadline to exam
        date: new Date(event.date),
        time: event.time,
        location: event.location || 'Online', // Default to Online if missing
        organizer: 'Mock Organizer',
        tags: [],
        maxParticipants: event.participants || 100,
      }));
      const insertedEvents = await Event.insertMany(events);
      results.upcomingEvents = insertedEvents;
    }

    // Insert Mock Tinder Events
    if (mockTinderEvents && Array.isArray(mockTinderEvents)) {
      const events = mockTinderEvents.map((event: any) => ({
        title: event.title,
        description: event.description,
        type: event.type,
        date: new Date(event.date),
        time: event.time,
        location: event.location,
        image: event.image,
        organizer: event.organizer,
        tags: event.tags,
        maxParticipants: event.maxParticipants,
      }));
      const insertedEvents = await Event.insertMany(events);
      results.mockTinderEvents = insertedEvents;
    }

    return NextResponse.json({
      success: true,
      message: 'Mock data inserted successfully',
      results,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error inserting mock data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to insert mock data', error: error.message },
      { status: 500 }
    );
  }
}