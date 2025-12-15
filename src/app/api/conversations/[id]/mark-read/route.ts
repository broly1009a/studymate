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

    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return NextResponse.json(
        {
          success: false,
          message: 'Conversation not found',
        },
        { status: 404 }
      );
    }

    // Mark all unread messages as read
    await Message.updateMany(
      {
        conversationId: id,
        read: false,
      },
      {
        $set: {
          read: true,
          readAt: new Date(),
        },
      }
    );

    // Reset unread count for this user
    if (userId) {
      conversation.unreadCounts.set(userId, 0);
      await conversation.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: 'All messages marked as read',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to mark messages as read',
      },
      { status: 500 }
    );
  }
}
