import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import mongoose from 'mongoose';

// POST - Quick mark conversation as read (only update unread count, not messages)
// This is lightweight and called frequently when user views conversation
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'userId is required',
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid conversation ID',
        },
        { status: 400 }
      );
    }

    // Only update unread count - lightweight operation
    const conversation = await Conversation.findByIdAndUpdate(
      id,
      {
        $set: {
          [`unreadCounts.${userId}`]: 0
        }
      },
      { new: true }
    );

    if (!conversation) {
      return NextResponse.json(
        {
          success: false,
          message: 'Conversation not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Marked as read',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error marking conversation as read:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to mark as read',
      },
      { status: 500 }
    );
  }
}