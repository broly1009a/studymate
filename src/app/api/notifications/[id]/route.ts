import { NextRequest, NextResponse } from 'next/server';
import Notification from '@/models/Notification';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(
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

    const notification = await Notification.findById(id).lean();

    if (!notification) {
      return NextResponse.json(
        { success: false, message: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: notification });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch notification', error: String(error) },
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

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid notification ID' },
        { status: 400 }
      );
    }

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return NextResponse.json(
        { success: false, message: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: notification, message: 'Notification deleted successfully' }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete notification', error: String(error) },
      { status: 500 }
    );
  }
}
