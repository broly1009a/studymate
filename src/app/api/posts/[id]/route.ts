import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Post from '@/models/Post';
import mongoose from 'mongoose';

// GET - Fetch single post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid post ID',
        },
        { status: 400 }
      );
    }

    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('authorId', 'fullName avatar email');

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: 'Post not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: post,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch post',
      },
      { status: 500 }
    );
  }
}

// PUT - Update post
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
          message: 'Invalid post ID',
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      title,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      readTime,
      status,
      featured,
    } = body;

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

    // Update fields
    if (title) post.title = title;
    if (excerpt) post.excerpt = excerpt;
    if (content) post.content = content;
    if (coverImage) post.coverImage = coverImage;
    if (category) post.category = category;
    if (tags) post.tags = tags;
    if (readTime) post.readTime = readTime;
    if (status) {
      post.status = status;
      if (status === 'published' && !post.publishedAt) {
        post.publishedAt = new Date();
      }
    }
    if (featured !== undefined) post.featured = featured;

    await post.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Post updated successfully',
        data: post,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update post',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete post
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
          message: 'Invalid post ID',
        },
        { status: 400 }
      );
    }

    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: 'Post not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Post deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete post',
      },
      { status: 500 }
    );
  }
}
