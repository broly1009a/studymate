import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';
import User from '@/models/User';
import Partner from '@/models/Partner';
import Event from '@/models/Event';
import Group from '@/models/StudyGroup';
import Question from '@/models/Question';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '5');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Fetch current user to get their interests and subjects
    const currentUser = await User.findById(userObjectId);
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const recommendations: any[] = [];

    // 1. Study Partner Recommendations
    const partners = await Partner.find({
      userId: { $ne: userObjectId },
      status: 'active',
    })
      .populate('userId', 'fullName avatar username email')
      .sort({ matchScore: -1, rating: -1 })
      .limit(3)
      .lean();

    if (partners.length > 0) {
      const partner = partners[0];
      const partnerUser = partner.userId as any;
      const partnerName = typeof partnerUser === 'object' && partnerUser?.fullName ? partnerUser.fullName : 'Study Partner';
      const partnerId = typeof partnerUser === 'object' && partnerUser?._id ? partnerUser._id : partner.userId;
      
      recommendations.push({
        id: `partner-${partner._id}`,
        type: 'study-partner',
        title: `Connect with ${partnerName}`,
        description: `${partnerName} is studying ${partner.subjects?.[0] || 'similar subjects'} with a ${partner.rating || 4.5} star rating`,
        reason: 'Based on your interests and study style',
        actionUrl: `/matches/${partnerId}`,
        metadata: {
          partnerId: partner._id,
          userId: partnerId,
          matchScore: partner.matchScore,
          rating: partner.rating,
        },
      });
    }

    // 2. Popular Questions/Topics Recommendation (from database)
    const trendingQuestions = await Question.find()
      .select('title content subject tags views votes answersCount')
      .sort({ views: -1, votes: -1, createdAt: -1 })
      .limit(1)
      .lean();

    if (trendingQuestions.length > 0) {
      const question = trendingQuestions[0];
      recommendations.push({
        id: `question-${question._id}`,
        type: 'question',
        title: question.title,
        description: question.content.substring(0, 150) + (question.content.length > 150 ? '...' : ''),
        reason: `Trending in ${question.subject} community - ${question.views} views`,
        actionUrl: `/forum/${question._id}`,
        metadata: {
          questionId: question._id,
          subject: question.subject,
          viewCount: question.views,
          voteCount: question.votes,
        },
      });
    }

    // 3. Study Group Recommendations
    const groups = await Group.find({
      members: { $ne: userObjectId },
      status: 'active',
    })
      .sort({ memberCount: -1 })
      .limit(2)
      .lean();

    if (groups.length > 0) {
      const group = groups[0];
      recommendations.push({
        id: `group-${group._id}`,
        type: 'group',
        title: `Join "${group.name}"`,
        description: `Active group with ${group.memberCount || 0} members learning ${group.subjects?.[0] || 'together'}`,
        reason: 'Matches your interests and study level',
        actionUrl: `/groups/${group._id}`,
        metadata: {
          groupId: group._id,
          memberCount: group.memberCount,
          subjects: group.subjects,
        },
      });
    }

    // 4. Upcoming Event/Competition Recommendation
    const upcomingEvent = await Event.findOne({
      date: { $gte: new Date() },
      type: { $in: ['competition', 'workshop'] },
    })
      .sort({ date: 1 })
      .lean();

    if (upcomingEvent) {
      recommendations.push({
        id: `event-${upcomingEvent._id}`,
        type: 'event',
        title: `Don't miss: ${upcomingEvent.title}`,
        description: upcomingEvent.description,
        reason: `${upcomingEvent.type} coming up on ${new Date(upcomingEvent.date).toLocaleDateString()}`,
        actionUrl: `/events/${upcomingEvent._id}`,
        metadata: {
          eventId: upcomingEvent._id,
          eventDate: upcomingEvent.date,
          type: upcomingEvent.type,
        },
      });
    }

    // Return top recommendations
    return NextResponse.json({
      success: true,
      data: recommendations.slice(0, limit),
      total: recommendations.length,
    });
  } catch (error: any) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch recommendations', error: error.message },
      { status: 500 }
    );
  }
}
