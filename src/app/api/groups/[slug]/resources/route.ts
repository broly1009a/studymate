import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import GroupResource from '@/models/GroupResource';
import Group from '@/models/Group';
// Import User model to ensure it's registered before use
import '@/models/User';
import { verifyToken } from '@/lib/api/auth';
import User from '@/models/User';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid token',
        },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');

    // Find group by slug
    const group = await Group.findOne({ slug, status: 'active' });
    if (!group) {
      return NextResponse.json(
        {
          success: false,
          message: 'Group not found',
        },
        { status: 404 }
      );
    }

    // Check if user is a member of the group
    if (!group.members.includes(user._id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access denied. You are not a member of this group.',
        },
        { status: 403 }
      );
    }

    const query: any = { groupId: group._id };
    if (parentId) {
      query.parentId = parentId;
    } else {
      query.parentId = null; // Root level resources
    }

    const resources = await GroupResource.find(query)
      .populate('uploaderId', 'fullName avatar')
      .sort({ type: 1, createdAt: -1 });

    // Transform data to match expected format
    const transformedResources = resources.map(resource => ({
      id: resource._id,
      name: resource.name,
      type: resource.type,
      fileUrl: resource.fileUrl,
      fileSize: resource.fileSize,
      uploaderName: (resource.uploaderId as any)?.fullName || 'Unknown',
      uploaderAvatar: (resource.uploaderId as any)?.avatar || '/default-avatar.png',
      createdAt: resource.createdAt,
      tags: resource.tags,
    }));

    return NextResponse.json(
      {
        success: true,
        data: transformedResources,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch resources',
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid token',
        },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    const { slug } = await params;
    const body = await request.json();
    const { name, type, fileUrl, fileSize, tags } = body;

    // Find group by slug
    const group = await Group.findOne({ slug, status: 'active' });
    if (!group) {
      return NextResponse.json(
        {
          success: false,
          message: 'Group not found',
        },
        { status: 404 }
      );
    }

    // Check if user is a member of the group
    if (!group.members.includes(user._id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access denied. You are not a member of this group.',
        },
        { status: 403 }
      );
    }

    // Validation
    if (!name || !type) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name and type are required',
        },
        { status: 400 }
      );
    }

    // Create resource
    const resource = new GroupResource({
      groupId: group._id,
      name,
      type,
      fileUrl,
      fileSize,
      uploaderId: user._id, // Use authenticated user as uploader
      tags: tags || [],
    });

    await resource.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Resource uploaded successfully',
        data: resource,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to upload resource',
      },
      { status: 500 }
    );
  }
}