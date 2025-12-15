import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BlogComment from '@/models/BlogComment';
import BlogPost from '@/models/BlogPost';
import mongoose from 'mongoose';

// GET - Fetch single comment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const commentId = params.id;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid comment ID' },
        { status: 400 }
      );
    }

    const comment = await BlogComment.findById(commentId).populate('authorId', 'fullName avatar email');

    if (!comment) {
      return NextResponse.json(
        { success: false, message: 'Comment not found' },
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
      { success: false, message: error.message || 'Failed to fetch comment' },
      { status: 500 }
    );
  }
}

// PUT - Update comment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const commentId = params.id;
    const body = await request.json();
    const { content } = body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid comment ID' },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { success: false, message: 'Content is required' },
        { status: 400 }
      );
    }

    const comment = await BlogComment.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { success: false, message: 'Comment not found' },
        { status: 404 }
      );
    }

    comment.content = content;
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
      { success: false, message: error.message || 'Failed to update comment' },
      { status: 500 }
    );
  }
}

// DELETE - Delete comment (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const commentId = params.id;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid comment ID' },
        { status: 400 }
      );
    }

    const comment = await BlogComment.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { success: false, message: 'Comment not found' },
        { status: 404 }
      );
    }

    // Soft delete
    comment.isDeleted = true;
    await comment.save();

    // Decrement post commentsCount
    await BlogPost.findByIdAndUpdate(
      comment.postId,
      { $inc: { commentsCount: -1 } }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Comment deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
