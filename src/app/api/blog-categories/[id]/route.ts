import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BlogCategory from '@/models/BlogCategory';
import mongoose from 'mongoose';

// GET - Fetch single category by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const categoryId = id;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const category = await BlogCategory.findById(categoryId);

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const categoryId = id;
    const body = await request.json();
    const { name, slug, description, color } = body;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const category = await BlogCategory.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if new slug is unique (if slug is being changed)
    if (slug && slug !== category.slug) {
      const existingCategory = await BlogCategory.findOne({ slug: slug.toLowerCase() });
      if (existingCategory) {
        return NextResponse.json(
          { success: false, message: 'Category with this slug already exists' },
          { status: 409 }
        );
      }
    }

    if (name) category.name = name;
    if (slug) category.slug = slug.toLowerCase();
    if (description) category.description = description;
    if (color) category.color = color;

    await category.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Category updated successfully',
        data: category,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const categoryId = id;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const category = await BlogCategory.findByIdAndDelete(categoryId);

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Category deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}
