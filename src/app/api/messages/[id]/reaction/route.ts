import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Message from '@/models/Message';
import mongoose from 'mongoose';

// POST - Add/Remove reaction to message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { emoji, userId, userName, action } = body; // action: 'add' or 'remove'

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid ID',
        },
        { status: 400 }
      );
    }

    const message = await Message.findById(id);

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          message: 'Message not found',
        },
        { status: 404 }
      );
    }

    const userIdObj = new mongoose.Types.ObjectId(userId);

    if (action === 'add') {
      // Check if user already reacted with this emoji
      const existingReaction = message.reactions.find(
        (r) => r.emoji === emoji && r.userId.equals(userIdObj)
      );

      if (!existingReaction) {
        message.reactions.push({
          emoji,
          userId: userIdObj,
          userName: userName || '',
        });
      }
    } else if (action === 'remove') {
      message.reactions = message.reactions.filter(
        (r) => !(r.emoji === emoji && r.userId.equals(userIdObj))
      );
    }

    await message.save();

    return NextResponse.json(
      {
        success: true,
        message: `Reaction ${action}ed successfully`,
        data: {
          reactions: message.reactions,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update reaction',
      },
      { status: 500 }
    );
  }
}
