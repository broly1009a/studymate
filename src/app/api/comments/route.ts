import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
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
        {
          success: false,
          message: 'postId is required',
        },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const comments = await Comment.find({
      postId,
      status: 'active',
      parentCommentId: null,
    })
      .populate('authorId', 'fullName avatar email')
      .populate({
        path: 'replies',
        populate: {
          path: 'authorId',
          select: 'fullName avatar email',
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({
      postId,
      status: 'active',
      parentCommentId: null,
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
      {
        success: false,
        message: error.message || 'Failed to fetch comments',
      },
      { status: 500 }
    );
  }
}

// POST - Create new comment
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      postId,
      authorId,
      authorName,
      authorAvatar,
      content,
      parentCommentId,
    } = body;

    // Validation
    if (!postId || !authorId || !authorName || !content) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: 'Post not found',
        },
        { status: 404 }
      );
    }

    // Create comment
    const comment = new Comment({
      postId,
      authorId,
      authorName,
      authorAvatar,
      content,
      parentCommentId,
      status: 'active',
    });

    await comment.save();

    // Update post comments count
    post.commentsCount += 1;
    await post.save();

    // If reply, add to parent comment
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (parentComment) {
        parentComment.replies.push(comment._id as mongoose.Types.ObjectId);
        await parentComment.save();
      }
    }

    const populatedComment = await Comment.findById(comment._id).populate(
      'authorId',
      'fullName avatar email'
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Comment created successfully',
        data: populatedComment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create comment',
      },
      { status: 500 }
    );
  }
}
