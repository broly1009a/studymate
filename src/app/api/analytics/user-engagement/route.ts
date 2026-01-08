import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import UserActivityInteraction from '@/models/UserActivityInteraction';
import Event from '@/models/Event';
import Competition from '@/models/Competition';
import { verifyToken } from '@/lib/api/auth';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Authentication check
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized - Authentication required',
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired token',
        },
        { status: 401 }
      );
    }

    const userId = decoded.id;

    // Get all interactions for this user
    const interactions = await UserActivityInteraction.find({ userId }).lean();

    // Calculate statistics
    const stats = {
      totalInteractions: interactions.length,
      
      // By action
      byAction: {
        viewed: interactions.filter(i => i.action === 'viewed').length,
        interested: interactions.filter(i => i.action === 'interested').length,
        joined: interactions.filter(i => i.action === 'joined').length,
        skipped: interactions.filter(i => i.action === 'skipped').length,
        left: interactions.filter(i => i.action === 'left').length,
      },
      
      // By activity type
      byActivityType: {
        event: interactions.filter(i => i.activityType === 'event').length,
        competition: interactions.filter(i => i.activityType === 'competition').length,
        group_event: interactions.filter(i => i.activityType === 'group_event').length,
      },
      
      // By source
      bySource: {
        'tinder-swipe': interactions.filter(i => i.source === 'tinder-swipe').length,
        'direct-register': interactions.filter(i => i.source === 'direct-register').length,
        'rsvp': interactions.filter(i => i.source === 'rsvp').length,
        'calendar': interactions.filter(i => i.source === 'calendar').length,
        'search': interactions.filter(i => i.source === 'search').length,
      },
      
      // Engagement metrics
      engagement: {
        interestRate: interactions.length > 0
          ? ((interactions.filter(i => i.action === 'interested').length / 
              interactions.filter(i => i.source === 'tinder-swipe').length || 1) * 100).toFixed(2)
          : 0,
        joinRate: interactions.length > 0
          ? ((interactions.filter(i => i.action === 'joined').length / 
              interactions.filter(i => i.action === 'interested').length || 1) * 100).toFixed(2)
          : 0,
        skipRate: interactions.length > 0
          ? ((interactions.filter(i => i.action === 'skipped').length / 
              interactions.filter(i => i.source === 'tinder-swipe').length || 1) * 100).toFixed(2)
          : 0,
      },
      
      // Time-based
      recentActivity: {
        last7Days: interactions.filter(i => {
          const date = new Date(i.createdAt);
          const now = new Date();
          const diff = now.getTime() - date.getTime();
          return diff < 7 * 24 * 60 * 60 * 1000;
        }).length,
        last30Days: interactions.filter(i => {
          const date = new Date(i.createdAt);
          const now = new Date();
          const diff = now.getTime() - date.getTime();
          return diff < 30 * 24 * 60 * 60 * 1000;
        }).length,
      },
      
      // Most recent interactions
      recentInteractions: interactions
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10)
        .map(i => ({
          activityType: i.activityType,
          action: i.action,
          source: i.source,
          createdAt: i.createdAt,
        })),
    };

    // Get upcoming events user is interested in
    const interestedEventIds = interactions
      .filter(i => i.activityType === 'event' && i.action === 'interested')
      .map(i => i.activityId);

    const upcomingInterestedEvents = await Event.find({
      _id: { $in: interestedEventIds },
      date: { $gte: new Date() },
    })
      .sort({ date: 1 })
      .limit(5)
      .select('title date type')
      .lean();

    // Get competitions user is interested in
    const interestedCompetitionIds = interactions
      .filter(i => i.activityType === 'competition' && i.action === 'interested')
      .map(i => i.activityId);

    const upcomingInterestedCompetitions = await Competition.find({
      _id: { $in: interestedCompetitionIds },
      status: { $in: ['upcoming', 'ongoing'] },
    })
      .sort({ startDate: 1 })
      .limit(5)
      .select('title startDate status')
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: {
          stats,
          upcomingInterestedEvents,
          upcomingInterestedCompetitions,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch analytics',
      },
      { status: 500 }
    );
  }
}
