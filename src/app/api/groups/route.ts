import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Group from '@/models/Group';

// GET - Fetch all groups with filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const subject = searchParams.get('subject');
    const category = searchParams.get('category');
    const isPublic = searchParams.get('isPublic') === 'true';
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;
    let query: any = { status: 'active' };

    if (isPublic) {
      query.isPublic = true;
    }

    if (subject) {
      query.subject = subject;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const groups = await Group.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ members_count: -1, createdAt: -1 })
      .populate('creatorId', 'fullName avatar')
      .populate('members', 'fullName avatar');

    const total = await Group.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: groups,
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
        message: error.message || 'Failed to fetch groups',
      },
      { status: 500 }
    );
  }
}

// POST - Create new group
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      name,
      slug,
      description,
      avatar,
      coverImage,
      creatorId,
      creatorName,
      subject,
      category,
      isPublic,
      rules,
    } = body;

    // Validation
    if (!name || !slug || !description || !creatorId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingGroup = await Group.findOne({ slug });
    if (existingGroup) {
      return NextResponse.json(
        {
          success: false,
          message: 'Group slug already exists',
        },
        { status: 400 }
      );
    }

    // Create group
    const group = new Group({
      name,
      slug,
      description,
      avatar: avatar || null,
      coverImage: coverImage || null,
      creatorId,
      creatorName,
      admins: [creatorId],
      members: [creatorId],
      members_count: 1,
      subject: subject || '',
      category: category || '',
      isPublic: isPublic !== false,
      rules: rules || '',
      status: 'active',
    });

    await group.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Group created successfully',
        data: group,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create group',
      },
      { status: 500 }
    );
  }
}
