import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

// POST - Follow/Unfollow user
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { userId, action } = body; // action: 'follow' or 'unfollow'

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid ID',
        },
        { status: 400 }
      );
    }

    const targetUser = await User.findById(id);
    const followUser = await User.findById(userId);

    if (!targetUser || !followUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    const userIdObj = new mongoose.Types.ObjectId(userId);
    const isFollowing = targetUser.followers.includes(userIdObj);

    if (action === 'follow' && !isFollowing) {
      targetUser.followers.push(userIdObj);
      targetUser.followers_count += 1;
      followUser.following.push(new mongoose.Types.ObjectId(id));
      followUser.following_count += 1;
    } else if (action === 'unfollow' && isFollowing) {
      targetUser.followers = targetUser.followers.filter(
        (fId) => !fId.equals(userIdObj)
      );
      targetUser.followers_count = Math.max(0, targetUser.followers_count - 1);
      followUser.following = followUser.following.filter(
        (fId) => !fId.equals(new mongoose.Types.ObjectId(id))
      );
      followUser.following_count = Math.max(0, followUser.following_count - 1);
    }

    await Promise.all([targetUser.save(), followUser.save()]);

    return NextResponse.json(
      {
        success: true,
        message: `User ${action}ed successfully`,
        data: {
          followers: targetUser.followers_count,
          following: followUser.following_count,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to follow/unfollow user',
      },
      { status: 500 }
    );
  }
}
