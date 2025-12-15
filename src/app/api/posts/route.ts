import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Post from '@/models/Post';
import Category from '@/models/Category';

// GET - Fetch all posts with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'published';
    const search = searchParams.get('search');
    const featured = searchParams.get('featured') === 'true';

    const skip = (page - 1) * limit;
    let query: any = { status };

    if (category) {
      query.category = category;
    }

    if (featured) {
      query.featured = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const posts = await Post.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('authorId', 'fullName avatar email');

    const total = await Post.countDocuments(query);

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
      {
        success: false,
        message: error.message || 'Failed to fetch posts',
      },
      { status: 500 }
    );
  }
}

// POST - Create new post
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
      category,
      tags,
      readTime,
      status,
      featured,
    } = body;

    // Validation
    if (!title || !slug || !excerpt || !content || !authorId || !category) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        {
          success: false,
          message: 'Slug already exists',
        },
        { status: 400 }
      );
    }

    // Create post
    const post = new Post({
      title,
      slug,
      excerpt,
      content,
      coverImage,
      authorId,
      authorName,
      authorAvatar,
      category,
      tags: tags || [],
      readTime: readTime || 1,
      status: status || 'draft',
      featured: featured || false,
      publishedAt: status === 'published' ? new Date() : null,
    });

    await post.save();

    // Update category post count if published
    if (status === 'published') {
      await Category.findOneAndUpdate(
        { name: category },
        { $inc: { postCount: 1 } }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Post created successfully',
        data: post,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create post',
      },
      { status: 500 }
    );
  }
}
