import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';
import mongoose from 'mongoose';

// GET - Fetch messages for a conversation
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!conversationId) {
      return NextResponse.json(
        {
          success: false,
          message: 'conversationId is required',
        },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find({
      conversationId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('senderId', 'fullName avatar');

    const total = await Message.countDocuments({
      conversationId,
      isDeleted: false,
    });

    return NextResponse.json(
      {
        success: true,
        data: messages.reverse(), // Reverse to get chronological order
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch messages',
      },
      { status: 500 }
    );
  }
}

// POST - Send new message
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      conversationId,
      senderId,
      senderName,
      senderAvatar,
      content,
      type,
      fileUrl,
      fileName,
      fileSize,
    } = body;

    // Validation
    if (!conversationId || !senderId || !senderName || !content) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return NextResponse.json(
        {
          success: false,
          message: 'Conversation not found',
        },
        { status: 404 }
      );
    }

    // Create message
    const message = new Message({
      conversationId,
      senderId,
      senderName,
      senderAvatar: senderAvatar || null,
      content,
      type: type || 'text',
      fileUrl: fileUrl || null,
      fileName: fileName || null,
      fileSize: fileSize || null,
      read: false,
    });

    await message.save();

    // Update conversation last message
    conversation.lastMessage = content;
    conversation.lastMessageTime = new Date();

    // Increment unread count for other participant
    const otherParticipant = conversation.participants.find(
      (p) => !p.equals(new mongoose.Types.ObjectId(senderId))
    );

    if (otherParticipant) {
      const otherUserId = otherParticipant.toString();
      conversation.unreadCounts.set(
        otherUserId,
        (conversation.unreadCounts.get(otherUserId) || 0) + 1
      );
    }

    await conversation.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
        data: message,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to send message',
      },
      { status: 500 }
    );
  }
}
