import { NextRequest, NextResponse } from 'next/server';
import Event from '@/models/Event';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import { verifyToken } from '@/lib/api/auth';
import User from '@/models/User';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid event ID' },
        { status: 400 }
      );
    }

    const event = await Event.findById(id).lean();

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch event', error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // Authentication check
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid event ID' },
        { status: 400 }
      );
    }

    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    // Authorization check - only creator or admin can edit
    const isOrganizer = event.organizer === (user.fullName || user.username);
    const isAdmin = user.role === 'admin';

    if (!isOrganizer && !isAdmin) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Access denied - Only event creator or admin can edit' 
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, description, type, date, time, location, image, tags, maxParticipants } = body;

    // Update fields
    if (title) event.title = title;
    if (description) event.description = description;
    if (type) event.type = type;
    if (date) event.date = date;
    if (time) event.time = time;
    if (location) event.location = location;
    if (image !== undefined) event.image = image;
    if (tags) event.tags = tags;
    if (maxParticipants !== undefined) event.maxParticipants = maxParticipants;

    await event.save();

    return NextResponse.json(
      { success: true, data: event, message: 'Event updated successfully' }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update event', error: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // Authentication check
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid event ID' },
        { status: 400 }
      );
    }

    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    // Authorization check - only creator or admin can delete
    const isOrganizer = event.organizer === (user.fullName || user.username);
    const isAdmin = user.role === 'admin';

    if (!isOrganizer && !isAdmin) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Access denied - Only event creator or admin can delete' 
        },
        { status: 403 }
      );
    }

    await Event.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, data: event, message: 'Event deleted successfully' }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete event', error: String(error) },
      { status: 500 }
    );
  }
}
