import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import mongoose from 'mongoose';

// POST - Like/Unlike a blog post
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const postId = params.id;
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'userId is required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid post ID' },
        { status: 400 }
      );
    }

    const post = await BlogPost.findById(postId);
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const userLikedIndex = post.likedBy.findIndex((id) => id.toString() === userId);

    if (userLikedIndex !== -1) {
      // User already liked - remove like
      post.likedBy.splice(userLikedIndex, 1);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      // User hasn't liked - add like
      post.likedBy.push(userObjectId);
      post.likes += 1;
    }

    await post.save();

    return NextResponse.json(
      {
        success: true,
        message: userLikedIndex !== -1 ? 'Post unliked' : 'Post liked',
        data: post,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to like post' },
      { status: 500 }
    );
  }
}
