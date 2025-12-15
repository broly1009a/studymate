import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Group from '@/models/Group';
import mongoose from 'mongoose';

// GET - Fetch single group
export async function GET(
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
          message: 'Invalid group ID',
        },
        { status: 400 }
      );
    }

    const group = await Group.findById(id)
      .populate('creatorId', 'fullName avatar email')
      .populate('admins', 'fullName avatar')
      .populate('members', 'fullName avatar');

    if (!group) {
      return NextResponse.json(
        {
          success: false,
          message: 'Group not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: group,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch group',
      },
      { status: 500 }
    );
  }
}

// PUT - Update group
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
          message: 'Invalid group ID',
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      avatar,
      coverImage,
      subject,
      category,
      isPublic,
      rules,
      status,
    } = body;

    const group = await Group.findById(id);

    if (!group) {
      return NextResponse.json(
        {
          success: false,
          message: 'Group not found',
        },
        { status: 404 }
      );
    }

    // Update fields
    if (name) group.name = name;
    if (description) group.description = description;
    if (avatar !== undefined) group.avatar = avatar;
    if (coverImage !== undefined) group.coverImage = coverImage;
    if (subject !== undefined) group.subject = subject;
    if (category !== undefined) group.category = category;
    if (isPublic !== undefined) group.isPublic = isPublic;
    if (rules !== undefined) group.rules = rules;
    if (status) group.status = status;

    await group.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Group updated successfully',
        data: group,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update group',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete group
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
          message: 'Invalid group ID',
        },
        { status: 400 }
      );
    }

    const group = await Group.findByIdAndDelete(id);

    if (!group) {
      return NextResponse.json(
        {
          success: false,
          message: 'Group not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Group deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete group',
      },
      { status: 500 }
    );
  }
}
