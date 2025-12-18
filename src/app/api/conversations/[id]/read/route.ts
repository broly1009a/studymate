import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import mongoose from 'mongoose';

// POST - Mark conversation as read for user
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

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

    const conversation = await Conversation.findById(params.id);
    if (!conversation) {
      return NextResponse.json(
        {
          success: false,
          message: 'Conversation not found',
        },
        { status: 404 }
      );
    }

    // Ensure unreadCounts is a Map
    if (!(conversation.unreadCounts instanceof Map)) {
      conversation.unreadCounts = new Map(Object.entries(conversation.unreadCounts || {}));
    }

    // Reset unread count for this user
    conversation.unreadCounts.set(userId, 0);
    await conversation.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Marked as read',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to mark as read',
      },
      { status: 500 }
    );
  }
}