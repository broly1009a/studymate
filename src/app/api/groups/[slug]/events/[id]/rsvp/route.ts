import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import GroupEvent from '@/models/GroupEvent';
import Group from '@/models/Group';
import { verifyToken } from '@/lib/api/auth';
import User from '@/models/User';

// PUT - Update RSVP status for a group event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
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

    const { slug, id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!status || !['going', 'maybe', 'not_going', 'no_response'].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid status. Must be one of: going, maybe, not_going, no_response',
        },
        { status: 400 }
      );
    }

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

    // Check if user is a member or admin of the group
    if (!group.members.includes(user._id) && !group.admins.includes(user._id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access denied. You are not a member of this group.',
        },
        { status: 403 }
      );
    }

    // Find event
    const event = await GroupEvent.findOne({ _id: id, groupId: group._id, isDeleted: false });
    if (!event) {
      return NextResponse.json(
        {
          success: false,
          message: 'Event not found',
        },
        { status: 404 }
      );
    }

    // Update or add attendee status
    const attendeeIndex = event.attendees.findIndex(
      (a: any) => a.userId.toString() === user._id.toString()
    );

    if (attendeeIndex !== -1) {
      // Update existing attendee status
      event.attendees[attendeeIndex].status = status;
    } else {
      // Add new attendee
      event.attendees.push({
        userId: user._id,
        status: status,
      });
    }

    await event.save();

    // Populate creator info for response
    await event.populate('creatorId', 'fullName avatar');

    return NextResponse.json(
      {
        success: true,
        message: 'RSVP status updated successfully',
        data: {
          _id: event._id,
          title: event.title,
          description: event.description,
          startTime: event.startTime,
          endTime: event.endTime,
          location: event.location,
          type: event.type,
          creatorId: event.creatorId,
          attendees: event.attendees,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update RSVP status',
      },
      { status: 500 }
    );
  }
}

// GET - Get RSVP status for current user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
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

    const { slug, id } = await params;

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

    // Find event
    const event = await GroupEvent.findOne({ _id: id, groupId: group._id, isDeleted: false });
    if (!event) {
      return NextResponse.json(
        {
          success: false,
          message: 'Event not found',
        },
        { status: 404 }
      );
    }

    // Find user's RSVP status
    const attendee = event.attendees.find(
      (a: any) => a.userId.toString() === decoded.id
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          status: attendee?.status || 'no_response',
          hasRsvp: !!attendee,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to get RSVP status',
      },
      { status: 500 }
    );
  }
}
