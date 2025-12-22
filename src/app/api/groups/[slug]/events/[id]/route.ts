import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import GroupEvent from '@/models/GroupEvent';
import Group from '@/models/Group';
import { verifyToken } from '@/lib/api/auth';
import User from '@/models/User';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
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

    const { slug, id: eventId } = await params;
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

    // Check if user is member or admin
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
    const event = await GroupEvent.findById(eventId);
    if (!event || event.isDeleted) {
      return NextResponse.json(
        {
          success: false,
          message: 'Event not found',
        },
        { status: 404 }
      );
    }

    // Check if user is creator or admin
    if (event.creatorId.toString() !== user._id.toString() && !group.admins.includes(user._id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access denied. Only event creator or group admin can edit this event.',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, startTime, endTime, location, type, isVirtual, meetingLink } = body;

    // Update event
    if (title) event.title = title;
    if (description) event.description = description;
    if (startTime) event.startTime = new Date(startTime);
    if (endTime) event.endTime = new Date(endTime);
    if (location) event.location = location;
    if (type) event.type = type;
    if (isVirtual !== undefined) event.isVirtual = isVirtual;
    if (meetingLink) event.meetingLink = meetingLink;

    await event.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Event updated successfully',
        data: event,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update event',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
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

    const { slug, id: eventId } = await params;

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

    // Check if user is member or admin
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
    const event = await GroupEvent.findById(eventId);
    if (!event || event.isDeleted) {
      return NextResponse.json(
        {
          success: false,
          message: 'Event not found',
        },
        { status: 404 }
      );
    }

    // Check if user is creator or admin
    if (event.creatorId.toString() !== user._id.toString() && !group.admins.includes(user._id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access denied. Only event creator or group admin can delete this event.',
        },
        { status: 403 }
      );
    }

    // Soft delete
    event.isDeleted = true;
    await event.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Event deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete event',
      },
      { status: 500 }
    );
  }
}