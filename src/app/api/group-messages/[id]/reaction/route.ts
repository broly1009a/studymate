import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import GroupMessage from '@/models/GroupMessage';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const body = await req.json();
    const { emoji, userId } = body;

    if (!emoji || !userId) {
      return NextResponse.json({ error: 'emoji and userId are required' }, { status: 400 });
    }

    const message = await GroupMessage.findById(params.id);
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    // Check if reaction already exists
    const reactionIndex = message.reactions.findIndex((r) => r.emoji === emoji);

    if (reactionIndex !== -1) {
      // Toggle reaction
      const userIndex = message.reactions[reactionIndex].userIds.findIndex(
        (id) => id.toString() === userId
      );

      if (userIndex !== -1) {
        // Remove reaction
        message.reactions[reactionIndex].userIds.splice(userIndex, 1);
        if (message.reactions[reactionIndex].userIds.length === 0) {
          message.reactions.splice(reactionIndex, 1);
        }
      } else {
        // Add reaction
        message.reactions[reactionIndex].userIds.push(userId);
      }
    } else {
      // Create new reaction
      message.reactions.push({
        emoji,
        userIds: [userId],
      });
    }

    await message.save();
    const updatedMessage = await message.populate('userId', 'username avatar');

    return NextResponse.json(updatedMessage);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
