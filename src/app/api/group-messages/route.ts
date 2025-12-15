import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import GroupMessage from '@/models/GroupMessage';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get('groupId');
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!groupId) {
      return NextResponse.json({ error: 'groupId is required' }, { status: 400 });
    }

    const messages = await GroupMessage.find({ groupId, isDeleted: false })
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await GroupMessage.countDocuments({ groupId, isDeleted: false });

    return NextResponse.json({
      data: messages.reverse(),
      total,
      skip,
      limit,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { groupId, userId, content } = body;

    if (!groupId || !userId || !content) {
      return NextResponse.json(
        { error: 'groupId, userId, and content are required' },
        { status: 400 }
      );
    }

    const newMessage = new GroupMessage({
      groupId,
      userId,
      content,
    });

    const savedMessage = await newMessage.save();
    const populatedMessage = await savedMessage.populate('userId', 'username avatar');

    return NextResponse.json(populatedMessage, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
