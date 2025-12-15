import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';

// GET - Fetch all categories
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    const categories = await Category.find()
      .sort({ postCount: -1 })
      .limit(limit);

    return NextResponse.json(
      {
        success: true,
        data: categories,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}

// POST - Create new category (Admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, slug, description, icon, color } = body;

    // Validation
    if (!name || !slug) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name and slug are required',
        },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: 'Category already exists',
        },
        { status: 400 }
      );
    }

    const category = new Category({
      name,
      slug,
      description: description || '',
      icon: icon || null,
      color: color || 'blue',
    });

    await category.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Category created successfully',
        data: category,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create category',
      },
      { status: 500 }
    );
  }
}
