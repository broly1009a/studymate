import { NextRequest, NextResponse } from 'next/server';
import Notification from '@/models/Notification';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid notification ID' },
        { status: 400 }
      );
    }

    const notification = await Notification.findByIdAndUpdate(
      id,
      {
        isRead: true,
        readAt: new Date(),
      },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json(
        { success: false, message: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: notification, message: 'Notification marked as read' }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to mark notification as read', error: String(error) },
      { status: 500 }
    );
  }
}
