import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ForumComment from '@/models/ForumComment';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get('parentId');
    const parentType = searchParams.get('parentType');
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!parentId || !parentType) {
      return NextResponse.json(
        { error: 'parentId and parentType are required' },
        { status: 400 }
      );
    }

    const comments = await ForumComment.find({ parentId, parentType })
      .populate('authorId', 'username avatar')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    const total = await ForumComment.countDocuments({ parentId, parentType });

    return NextResponse.json({
      data: comments,
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
    const { parentId, parentType, content, authorId } = body;

    if (!parentId || !parentType || !content || !authorId) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    const newComment = new ForumComment({
      parentId,
      parentType,
      content,
      authorId,
    });

    const savedComment = await newComment.save();
    const populatedComment = await savedComment.populate('authorId', 'username avatar');

    return NextResponse.json(populatedComment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
