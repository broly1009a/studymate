import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

// GET - Fetch post by slug
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Slug is required' },
        { status: 400 }
      );
    }

    const post = await BlogPost.findOneAndUpdate(
      { slug: slug.toLowerCase(), status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('authorId', 'fullName avatar email')
      .populate('categoryId', 'name slug color');

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
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
      { success: false, message: error.message || 'Failed to fetch post' },
      { status: 500 }
    );
  }
}
