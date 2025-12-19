import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Group from '@/models/Group';
import User from '@/models/User';
import { verifyToken } from '@/lib/api/auth';

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

    // Get members with user details
    const members = await User.find({
      _id: { $in: group.members }
    }).select('fullName avatar email');

    // Transform data to match frontend expectations
    const transformedMembers = members.map(user => ({
      _id: user._id,
      fullName: user.fullName,
      avatar: user.avatar || '/default-avatar.png',
      email: user.email,
      joinedAt: new Date(), // Mock joined date for now
      reputation: 0, // Mock reputation
      role: group.creatorId.equals(user._id) ? 'owner' :
            group.admins.includes(user._id) ? 'admin' : 'member',
    }));

    return NextResponse.json(
      {
        success: true,
        data: transformedMembers,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch members',
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
    const { action } = body; // action: 'join' or 'leave'

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

    const userId = user._id;
    const isMember = group.members.includes(userId);

    if (action === 'join') {
      if (isMember) {
        return NextResponse.json(
          {
            success: false,
            message: 'Already a member of this group',
          },
          { status: 400 }
        );
      }

      group.members.push(userId);
      group.members_count += 1;
    } else if (action === 'leave') {
      if (!isMember) {
        return NextResponse.json(
          {
            success: false,
            message: 'Not a member of this group',
          },
          { status: 400 }
        );
      }

      // Check if user is the creator (can't leave if they're the only admin)
      if (group.creatorId.toString() === userId.toString()) {
        return NextResponse.json(
          {
            success: false,
            message: 'Group creator cannot leave the group',
          },
          { status: 400 }
        );
      }

      group.members = group.members.filter((mId) => mId.toString() !== userId.toString());
      group.members_count = Math.max(0, group.members_count - 1);

      // Remove from admins if applicable
      group.admins = group.admins.filter((aId) => aId.toString() !== userId.toString());
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid action',
        },
        { status: 400 }
      );
    }

    await group.save();

    return NextResponse.json(
      {
        success: true,
        message: `Successfully ${action}ed the group`,
        data: {
          members_count: group.members_count,
          members: group.members,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to join/leave group',
      },
      { status: 500 }
    );
  }
}