import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Group from '@/models/Group';
// Import User model to ensure it's registered before use
import '@/models/User';
import { verifyToken } from '@/lib/api/auth';
import User from '@/models/User';

export async function GET(request: NextRequest) {
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

    // Find groups where user is a member
    const groups = await Group.find({
      members: user._id,
      status: 'active'
    })
    .populate('creatorId', 'fullName avatar')
    .populate('admins', 'fullName avatar')
    .sort({ updatedAt: -1 });

    // Add additional data for each group
    const groupsWithData = groups.map(group => {
      const groupObj = group.toObject();

      // Mock unread messages and upcoming events for now
      // In real implementation, this would come from separate collections
      (groupObj as any).unreadMessages = Math.floor(Math.random() * 5); // Mock data
      (groupObj as any).upcomingEvents = Math.floor(Math.random() * 3); // Mock data
      (groupObj as any).memberCount = group.members.length;

      return groupObj;
    });

    return NextResponse.json(
      {
        success: true,
        data: groupsWithData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch my groups',
      },
      { status: 500 }
    );
  }
}