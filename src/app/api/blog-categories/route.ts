import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BlogCategory from '@/models/BlogCategory';

// GET - Fetch all categories
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const categories = await BlogCategory.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });

    const total = await BlogCategory.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: categories,
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
      { success: false, message: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, slug, description, color } = body;

    if (!name || !slug || !description) {
      return NextResponse.json(
        { success: false, message: 'Name, slug, and description are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCategory = await BlogCategory.findOne({ slug });
    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: 'Category with this slug already exists' },
        { status: 409 }
      );
    }

    const newCategory = new BlogCategory({
      name,
      slug: slug.toLowerCase(),
      description,
      color: color || 'blue',
    });

    await newCategory.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Category created successfully',
        data: newCategory,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}
