import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StudyGroup from '@/models/StudyGroup';
import GroupMember from '@/models/GroupMember';

// GET - Get groups statistics
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const totalGroups = await StudyGroup.countDocuments({ isDeleted: false });

    const publicGroups = await StudyGroup.countDocuments({
      visibility: 'public',
      isDeleted: false,
    });

    // For now, myGroups will be 0 (requires userId context)
    const myGroups = 0;

    const totalMembers = await GroupMember.countDocuments({
      isActive: true,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          totalGroups,
          publicGroups,
          myGroups,
          totalMembers,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
