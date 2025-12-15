import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BlogComment from '@/models/BlogComment';
import BlogPost from '@/models/BlogPost';
import mongoose from 'mongoose';

// GET - Fetch comments for a post
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!postId) {
      return NextResponse.json(
        { success: false, message: 'postId is required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid post ID' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;
    const comments = await BlogComment.find({
      postId: new mongoose.Types.ObjectId(postId),
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('authorId', 'fullName avatar email');

    const total = await BlogComment.countDocuments({
      postId: new mongoose.Types.ObjectId(postId),
      isDeleted: false,
    });

    return NextResponse.json(
      {
        success: true,
        data: comments,
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
      { success: false, message: error.message || 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST - Create comment on post
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { postId, authorId, authorName, authorAvatar, content } = body;

    if (!postId || !authorId || !authorName || !content) {
      return NextResponse.json(
        { success: false, message: 'postId, authorId, authorName, and content are required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid post ID' },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await BlogPost.findById(postId);
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    const newComment = new BlogComment({
      postId: new mongoose.Types.ObjectId(postId),
      authorId: new mongoose.Types.ObjectId(authorId),
      authorName,
      authorAvatar: authorAvatar || null,
      content,
    });

    await newComment.save();

    // Update post commentsCount
    await BlogPost.findByIdAndUpdate(
      postId,
      { $inc: { commentsCount: 1 } }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Comment created successfully',
        data: newComment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create comment' },
      { status: 500 }
    );
  }
}
