import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Group from '@/models/Group';
import mongoose from 'mongoose';

// POST - Join/Leave group
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { userId, action } = body; // action: 'join' or 'leave'

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid ID',
        },
        { status: 400 }
      );
    }

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

    const userIdObj = new mongoose.Types.ObjectId(userId);
    const isMember = group.members.includes(userIdObj);

    if (action === 'join' && !isMember) {
      group.members.push(userIdObj);
      group.members_count += 1;
    } else if (action === 'leave' && isMember) {
      group.members = group.members.filter((mId) => !mId.equals(userIdObj));
      group.members_count = Math.max(0, group.members_count - 1);

      // Remove from admins if applicable
      group.admins = group.admins.filter((aId) => !aId.equals(userIdObj));
    }

    await group.save();

    return NextResponse.json(
      {
        success: true,
        message: `User ${action}ed group successfully`,
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
