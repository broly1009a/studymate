import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import User from '@/models/User';
import BlogCategory from '@/models/BlogCategory';
import mongoose from 'mongoose';

// GET - Fetch single post and increment views
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const postId = id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid post ID' },
        { status: 400 }
      );
    }

    const post = await BlogPost.findByIdAndUpdate(
      postId,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    // Populate author and category manually
    const author = await User.findById(post.authorId).select('fullName avatar email');
    const category = await BlogCategory.findById(post.categoryId).select('name slug color');

    const populatedPost = {
      ...post.toObject(),
      authorId: author,
      categoryId: category,
    };

    return NextResponse.json(
      {
        success: true,
        data: populatedPost,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT - Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const postId = id;
    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, categoryId, tags, readTime, status, featured } = body;

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

    // Check if new slug is unique
    if (slug && slug !== post.slug) {
      const existingPost = await BlogPost.findOne({ slug: slug.toLowerCase() });
      if (existingPost) {
        return NextResponse.json(
          { success: false, message: 'Post with this slug already exists' },
          { status: 409 }
        );
      }
    }

    if (title) post.title = title;
    if (slug) post.slug = slug.toLowerCase();
    if (excerpt) post.excerpt = excerpt;
    if (content) post.content = content;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (categoryId) post.categoryId = new mongoose.Types.ObjectId(categoryId);
    if (tags) post.tags = tags;
    if (readTime) post.readTime = readTime;
    if (status) {
      post.status = status;
      // Set publishedAt when publishing
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
      { success: false, message: error.message || 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const postId = id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid post ID' },
        { status: 400 }
      );
    }

    const post = await BlogPost.findByIdAndDelete(postId);

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
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
      { success: false, message: error.message || 'Failed to delete post' },
      { status: 500 }
    );
  }
}
