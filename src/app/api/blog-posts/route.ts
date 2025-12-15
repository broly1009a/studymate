import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import mongoose from 'mongoose';

// GET - Fetch all blog posts with filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const categoryId = searchParams.get('categoryId');
    const authorId = searchParams.get('authorId');
    const featured = searchParams.get('featured');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;
    const query: any = { status: 'published' }; // Default to published only

    if (status === 'draft' || status === 'archived') {
      query.status = status;
    }

    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      query.categoryId = new mongoose.Types.ObjectId(categoryId);
    }

    if (authorId && mongoose.Types.ObjectId.isValid(authorId)) {
      query.authorId = new mongoose.Types.ObjectId(authorId);
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const posts = await BlogPost.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ publishedAt: -1, createdAt: -1 })
      .populate('authorId', 'fullName avatar email')
      .populate('categoryId', 'name slug color');

    const total = await BlogPost.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: posts,
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
      { success: false, message: error.message || 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      authorId,
      authorName,
      authorAvatar,
      categoryId,
      tags,
      readTime,
      status,
      featured,
    } = body;

    if (!title || !slug || !excerpt || !content || !authorId || !categoryId) {
      return NextResponse.json(
        { success: false, message: 'Title, slug, excerpt, content, authorId, and categoryId are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await BlogPost.findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        { success: false, message: 'Post with this slug already exists' },
        { status: 409 }
      );
    }

    const newPost = new BlogPost({
      title,
      slug: slug.toLowerCase(),
      excerpt,
      content,
      coverImage: coverImage || null,
      authorId: new mongoose.Types.ObjectId(authorId),
      authorName,
      authorAvatar: authorAvatar || null,
      categoryId: new mongoose.Types.ObjectId(categoryId),
      tags: tags || [],
      readTime: readTime || 1,
      status: status || 'draft',
      featured: featured || false,
      publishedAt: (status === 'published') ? new Date() : null,
    });

    await newPost.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Post created successfully',
        data: newPost,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create post' },
      { status: 500 }
    );
  }
}
