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

    // Check if user is already a member
    if (group.members.includes(user._id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Already a member of this group',
        },
        { status: 400 }
      );
    }

    // Check if group is private and requires approval
    if (!group.isPublic) {
      // For now, auto-approve. In future, could add pending status
      // return NextResponse.json({
      //   success: false,
      //   message: 'Private group - join request sent for approval',
      // }, { status: 200 });
    }

    // Add user to members
    group.members.push(user._id);
    group.members_count = group.members.length;
    await group.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully joined the group',
        data: group,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to join group',
      },
      { status: 500 }
    );
  }
}