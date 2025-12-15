import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
import mongoose from 'mongoose';

// GET - Fetch single comment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid comment ID',
        },
        { status: 400 }
      );
    }

    const comment = await Comment.findById(id)
      .populate('authorId', 'fullName avatar email')
      .populate({
        path: 'replies',
        populate: {
          path: 'authorId',
          select: 'fullName avatar email',
        },
      });

    if (!comment) {
      return NextResponse.json(
        {
          success: false,
          message: 'Comment not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: comment,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch comment',
      },
      { status: 500 }
    );
  }
}

// PUT - Update comment
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid comment ID',
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { content } = body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return NextResponse.json(
        {
          success: false,
          message: 'Comment not found',
        },
        { status: 404 }
      );
    }

    if (content) comment.content = content;

    await comment.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Comment updated successfully',
        data: comment,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update comment',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid comment ID',
        },
        { status: 400 }
      );
    }

    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return NextResponse.json(
        {
          success: false,
          message: 'Comment not found',
        },
        { status: 404 }
      );
    }

    // Update post comments count
    await Post.findByIdAndUpdate(comment.postId, {
      $inc: { commentsCount: -1 },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Comment deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete comment',
      },
      { status: 500 }
    );
  }
}
