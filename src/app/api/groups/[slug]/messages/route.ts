import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import GroupMessage from '@/models/GroupMessage';
import Group from '@/models/Group';
// Import User model to ensure it's registered before use
import '@/models/User';
import { verifyToken } from '@/lib/api/auth';
import User from '@/models/User';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Find group by slug first
    const group = await Group.findOne({ slug, status: 'active' });
    if (!group) {
      return NextResponse.json(
        {
          success: false,
          message: 'Group not found',
        },
        { status: 404 }
      );
    }

    const messages = await GroupMessage.find({
      groupId: group._id,
      isDeleted: false
    })
    .populate('userId', 'fullName avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await GroupMessage.countDocuments({
      groupId: group._id,
      isDeleted: false
    });

    // Transform data to match expected format
    const transformedMessages = messages.reverse().map(msg => ({
      id: msg._id,
      content: msg.content,
      createdAt: msg.createdAt,
      userId: (msg.userId as any)._id,
      userName: (msg.userId as any).fullName,
      userAvatar: (msg.userId as any).avatar || '/default-avatar.png',
    }));

    return NextResponse.json(
      {
        success: true,
        data: transformedMessages,
        pagination: {
          total,
          skip,
          limit,
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid token',
        },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    const { slug } = await params;
    const { content } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Message content is required',
        },
        { status: 400 }
      );
    }

    // Find group by slug
    const group = await Group.findOne({ slug, status: 'active' });
    if (!group) {
      return NextResponse.json(
        {
          success: false,
          message: 'Group not found',
        },
        { status: 404 }
      );
    }

    // Check if user is a member of the group
    if (!group.members.includes(user._id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'You must be a member of this group to send messages',
        },
        { status: 403 }
      );
    }

    // Create message
    const message = new GroupMessage({
      groupId: group._id,
      userId: user._id,
      content: content.trim(),
    });

    await message.save();

    // Populate user data for response
    await message.populate('userId', 'fullName avatar');

    const transformedMessage = {
      id: message._id,
      content: message.content,
      createdAt: message.createdAt,
      userId: (message.userId as any)._id,
      userName: (message.userId as any).fullName,
      userAvatar: (message.userId as any).avatar || '/default-avatar.png',
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
        data: transformedMessage,
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