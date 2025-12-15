import { NextRequest, NextResponse } from 'next/server';
import Notification from '@/models/Notification';
import connectDB from '@/lib/mongodb';

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    await Notification.updateMany(
      { userId, isRead: false },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    return NextResponse.json(
      { success: true, message: 'All notifications marked as read' }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to mark all as read', error: String(error) },
      { status: 500 }
    );
  }
}
