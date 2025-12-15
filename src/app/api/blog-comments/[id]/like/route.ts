import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BlogComment from '@/models/BlogComment';
import mongoose from 'mongoose';

// POST - Like/Unlike a blog comment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const commentId = params.id;
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'userId is required' },
        { status: 400 }
      );
    }

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

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const userLikedIndex = comment.likedBy.findIndex((id) => id.toString() === userId);

    if (userLikedIndex !== -1) {
      // User already liked - remove like
      comment.likedBy.splice(userLikedIndex, 1);
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      // User hasn't liked - add like
      comment.likedBy.push(userObjectId);
      comment.likes += 1;
    }

    await comment.save();

    return NextResponse.json(
      {
        success: true,
        message: userLikedIndex !== -1 ? 'Comment unliked' : 'Comment liked',
        data: comment,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to like comment' },
      { status: 500 }
    );
  }
}
