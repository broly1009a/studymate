import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import mongoose from 'mongoose';

// GET - Fetch all conversations for current user
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'userId is required',
        },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;
    const userIdObj = new mongoose.Types.ObjectId(userId);

    const conversations = await Conversation.find({
      participants: userIdObj,
      isActive: true,
    })
      .populate('participants', 'fullName avatar email')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Conversation.countDocuments({
      participants: userIdObj,
      isActive: true,
    });

    return NextResponse.json(
      {
        success: true,
        data: conversations,
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
        message: error.message || 'Failed to fetch conversations',
      },
      { status: 500 }
    );
  }
}

// POST - Create or get conversation
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId1, user1Name, userId2, user2Name, subject } = body;

    // Validation
    if (!userId1 || !userId2 || !user1Name || !user2Name) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    if (userId1 === userId2) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cannot create conversation with yourself',
        },
        { status: 400 }
      );
    }

    const userIdObj1 = new mongoose.Types.ObjectId(userId1);
    const userIdObj2 = new mongoose.Types.ObjectId(userId2);

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: {
        $all: [userIdObj1, userIdObj2],
      },
    });

    if (conversation) {
      return NextResponse.json(
        {
          success: true,
          message: 'Conversation already exists',
          data: conversation,
        },
        { status: 200 }
      );
    }

    // Create new conversation
    conversation = new Conversation({
      participants: [userIdObj1, userIdObj2],
      participantNames: [user1Name, user2Name],
      subject: subject || '',
      unreadCounts: {
        [userId1]: 0,
        [userId2]: 0,
      },
    });

    await conversation.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Conversation created successfully',
        data: conversation,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create conversation',
      },
      { status: 500 }
    );
  }
}
