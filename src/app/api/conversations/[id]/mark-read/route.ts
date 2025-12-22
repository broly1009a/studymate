import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';
import mongoose from 'mongoose';

// PUT - Mark all messages in conversation as read
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { userId } = body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid conversation ID',
        },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'userId is required',
        },
        { status: 400 }
      );
    }

    // Use session for atomic operations
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Mark all unread messages from others as read
      const updateResult = await Message.updateMany(
        {
          conversationId: new mongoose.Types.ObjectId(id),
          senderId: { $ne: new mongoose.Types.ObjectId(userId) },
          read: false,
        },
        {
          $set: {
            read: true,
            readAt: new Date(),
          },
        },
        { session }
      );

      // Reset unread count
      await Conversation.findByIdAndUpdate(
        id,
        {
          $set: {
            [`unreadCounts.${userId}`]: 0
          }
        },
        { session }
      );

      await session.commitTransaction();

      return NextResponse.json(
        {
          success: true,
          message: 'All messages marked as read',
          updatedCount: updateResult.modifiedCount,
        },
        { status: 200 }
      );
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error: any) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to mark messages as read',
      },
      { status: 500 }
    );
  }
}
