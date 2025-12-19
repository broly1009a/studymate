import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Group from '@/models/Group';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const totalGroups = await Group.countDocuments({ status: 'active' });

    const publicGroups = await Group.countDocuments({
      isPublic: true,
      status: 'active',
    });

    // For now, myGroups will be 0 (requires userId context)
    const myGroups = 0;

    // Calculate total members across all groups
    const groups = await Group.find({ status: 'active' });
    const totalMembers = groups.reduce((sum, group) => sum + group.members_count, 0);

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
