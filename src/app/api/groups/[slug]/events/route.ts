import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import GroupEvent from '@/models/GroupEvent';
import Group from '@/models/Group';
// Import User model to ensure it's registered before use
import '@/models/User';
import { verifyToken } from '@/lib/api/auth';
import User from '@/models/User';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
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
          message: 'Invalid token',
        },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    const { slug } = await params;

    // Find group by slug first
    const group = await Group.findOne({ slug, status: 'active' });
    if (!group) {
      return NextResponse.json(
        {
          success: false,
          message: 'Group not found',
        },
        { status: 404 }
      );
    }

    // Check if user is a member of the group
    if (!group.members.includes(user._id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access denied. You are not a member of this group.',
        },
        { status: 403 }
      );
    }

    const events = await GroupEvent.find({ groupId: group._id, isDeleted: false })
      .populate('creatorId', 'fullName avatar')
      .sort({ startTime: 1 });

    // Transform events to match frontend expectations
    const transformedEvents = events.map(event => ({
      _id: event._id,
      title: event.title,
      description: event.description,
      date: event.startTime.toISOString().split('T')[0], // YYYY-MM-DD format
      time: event.startTime.toTimeString().slice(0, 5), // HH:MM format
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      type: event.type,
      creatorId: event.creatorId,
      attendees: event.attendees,
    }));

    return NextResponse.json(
      {
        success: true,
        data: transformedEvents,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch events',
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
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
          message: 'Invalid token',
        },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    const { slug } = await params;
    const body = await request.json();
    const {
      title,
      description,
      startTime,
      endTime,
      location,
      type,
      maxAttendees,
      isVirtual,
      meetingLink,
    } = body;

    // Find group by slug
    const group = await Group.findOne({ slug, status: 'active' });
    if (!group) {
      return NextResponse.json(
        {
          success: false,
          message: 'Group not found',
        },
        { status: 404 }
      );
    }

    // Check if user is a member of the group
    if (!group.members.includes(user._id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access denied. You are not a member of this group.',
        },
        { status: 403 }
      );
    }

    // Validation
    if (!title || !description || !startTime) {
      return NextResponse.json(
        {
          success: false,
          message: 'Title, description, and start time are required',
        },
        { status: 400 }
      );
    }

    // Create event
    const event = new GroupEvent({
      groupId: group._id,
      creatorId: user._id, // Use authenticated user as creator
      title,
      description,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : null,
      location,
      type: type || 'study_session',
      maxAttendees: maxAttendees || null,
      isVirtual: isVirtual || false,
      meetingLink,
      attendees: [{ userId: user._id, status: 'going' }], // Creator automatically attends
    });

    await event.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Event created successfully',
        data: event,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create event',
      },
      { status: 500 }
    );
  }
}