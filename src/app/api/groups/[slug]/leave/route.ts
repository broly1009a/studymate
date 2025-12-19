import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Group from '@/models/Group';
import User from '@/models/User';
import { verifyToken } from '@/lib/api/auth';

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

    // Check if user is the creator (can't leave if they're the only admin)
    if (group.creatorId.toString() === user._id.toString()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Group creator cannot leave the group',
        },
        { status: 400 }
      );
    }

    // Check if user is a member
    if (!group.members.includes(user._id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Not a member of this group',
        },
        { status: 400 }
      );
    }

    // Remove user from members and admins if they are admin
    group.members = group.members.filter((member: any) => member.toString() !== user._id.toString());
    group.admins = group.admins.filter((admin: any) => admin.toString() !== user._id.toString());
    group.members_count = group.members.length;
    await group.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully left the group',
        data: group,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to leave group',
      },
      { status: 500 }
    );
  }
}