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

    const events = await GroupEvent.find({ groupId: group._id, isDeleted: false })
      .populate('creatorId', 'fullName avatar')
      .sort({ startTime: 1 });

    return NextResponse.json(
      {
        success: true,
        data: events,
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
      creatorId: group.creatorId, // Use group creator for now
      title,
      description,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : null,
      location,
      type: type || 'study_session',
      maxAttendees: maxAttendees || null,
      isVirtual: isVirtual || false,
      meetingLink,
      attendees: [group.creatorId], // Creator automatically attends
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