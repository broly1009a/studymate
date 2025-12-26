import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CompetitionTeam from '@/models/CompetitionTeam';

// PUT - Update member role in team
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id: teamId } = await params;
    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, message: 'userId and role are required' },
        { status: 400 }
      );
    }

    if (!['leader', 'member'].includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role. Must be leader or member' },
        { status: 400 }
      );
    }

    const team = await CompetitionTeam.findById(teamId);
    if (!team) {
      return NextResponse.json(
        { success: false, message: 'Team not found' },
        { status: 404 }
      );
    }

    const member = team.members.find((m) => m.userId.toString() === userId);
    if (!member) {
      return NextResponse.json(
        { success: false, message: 'Member not found in team' },
        { status: 404 }
      );
    }

    // Check if role change is from leader
    const currentLeaders = team.members.filter((m) => m.role === 'leader');
    if (member.role === 'leader' && currentLeaders.length === 1 && role !== 'leader') {
      return NextResponse.json(
        { success: false, message: 'Team must have at least one leader' },
        { status: 403 }
      );
    }

    member.role = role;
    await team.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Member role updated successfully',
        data: team,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update member role' },
      { status: 500 }
    );
  }
}
