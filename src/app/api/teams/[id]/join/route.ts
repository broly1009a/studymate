import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CompetitionTeam from '@/models/CompetitionTeam';

// POST - Request to join team
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { userId, userName, userAvatar } = body;

    if (!userId || !userName) {
      return NextResponse.json(
        { success: false, message: 'userId and userName are required' },
        { status: 400 }
      );
    }

    const team = await CompetitionTeam.findById(id);
    if (!team) {
      return NextResponse.json(
        { success: false, message: 'Team not found' },
        { status: 404 }
      );
    }

    // Check if team is full
    if (team.memberCount >= team.maxMembers) {
      return NextResponse.json(
        { success: false, message: 'Team is full' },
        { status: 400 }
      );
    }

    // Check if user is already a member
    const isAlreadyMember = team.members.some(
      (member) => member.userId.toString() === userId
    );

    if (isAlreadyMember) {
      return NextResponse.json(
        { success: false, message: 'You are already a member of this team' },
        { status: 400 }
      );
    }

    // Check if user is in another team for the same competition
    const existingTeam = await CompetitionTeam.findOne({
      competitionId: team.competitionId,
      'members.userId': userId,
    });

    if (existingTeam) {
      return NextResponse.json(
        {
          success: false,
          message: 'You are already in another team for this competition',
        },
        { status: 400 }
      );
    }

    // Add user to team
    team.members.push({
      userId: userId as any,
      userName,
      userAvatar,
      role: 'member',
      joinedAt: new Date(),
    });

    team.memberCount = team.members.length;

    // If team is full, set lookingForMembers to false
    if (team.memberCount >= team.maxMembers) {
      team.lookingForMembers = false;
    }

    await team.save();

    return NextResponse.json(
      {
        success: true,
        data: team,
        message: 'Successfully joined the team',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to join team' },
      { status: 500 }
    );
  }
}
