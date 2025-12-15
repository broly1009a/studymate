import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Post from '@/models/Post';
import mongoose from 'mongoose';

// POST - Like/Unlike post
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { userId, action } = body; // action: 'like' or 'unlike'

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid ID',
        },
        { status: 400 }
      );
    }

    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: 'Post not found',
        },
        { status: 404 }
      );
    }

    const userIdObj = new mongoose.Types.ObjectId(userId);
    const hasLiked = post.likesBy.includes(userIdObj);

    if (action === 'like' && !hasLiked) {
      post.likesBy.push(userIdObj);
      post.likes += 1;
    } else if (action === 'unlike' && hasLiked) {
      post.likesBy = post.likesBy.filter((id) => !id.equals(userIdObj));
      post.likes = Math.max(0, post.likes - 1);
    }

    await post.save();

    return NextResponse.json(
      {
        success: true,
        message: `Post ${action}d successfully`,
        data: {
          likes: post.likes,
          likesBy: post.likesBy,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to like/unlike post',
      },
      { status: 500 }
    );
  }
}
