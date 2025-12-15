import { NextRequest, NextResponse } from 'next/server';
import Notification from '@/models/Notification';
import connectDB from '@/lib/mongodb';

export async function DELETE(req: NextRequest) {
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

    const result = await Notification.deleteMany({ userId });

    return NextResponse.json({
      success: true,
      message: 'All notifications deleted',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete all notifications', error: String(error) },
      { status: 500 }
    );
  }
}
