import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Comment from '@/models/Comment';
import mongoose from 'mongoose';

// POST - Like/Unlike comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { userId, action } = body;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid ID',
        },
        { status: 400 }
      );
    }

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

    const userIdObj = new mongoose.Types.ObjectId(userId);
    const hasLiked = comment.likesBy.includes(userIdObj);

    if (action === 'like' && !hasLiked) {
      comment.likesBy.push(userIdObj);
      comment.likes += 1;
    } else if (action === 'unlike' && hasLiked) {
      comment.likesBy = comment.likesBy.filter((id) => !id.equals(userIdObj));
      comment.likes = Math.max(0, comment.likes - 1);
    }

    await comment.save();

    return NextResponse.json(
      {
        success: true,
        message: `Comment ${action}d successfully`,
        data: {
          likes: comment.likes,
          likesBy: comment.likesBy,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to like/unlike comment',
      },
      { status: 500 }
    );
  }
}
