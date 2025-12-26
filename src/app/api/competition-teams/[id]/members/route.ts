import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CompetitionTeam from '@/models/CompetitionTeam';
import Competition from '@/models/Competition';
import mongoose from 'mongoose';

// POST - Add member to team
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const teamId = id;
    const body = await request.json();
    const { userId, userName, userAvatar } = body;

    if (!userId || !userName) {
      return NextResponse.json(
        { success: false, message: 'userId and userName are required' },
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

    // Check if team is full
    if (team.memberCount >= team.maxMembers) {
      return NextResponse.json(
        { success: false, message: 'Team is full' },
        { status: 409 }
      );
    }

    // Check if user is already in team
    const userInTeam = team.members.some(
      (member) => member.userId.toString() === userId
    );
    if (userInTeam) {
      return NextResponse.json(
        { success: false, message: 'User is already in this team' },
        { status: 409 }
      );
    }

    // Check if user is already in another team for same competition
    const otherTeam = await CompetitionTeam.findOne({
      competitionId: team.competitionId,
      'members.userId': new mongoose.Types.ObjectId(userId),
    });
    if (otherTeam) {
      return NextResponse.json(
        { success: false, message: 'User is already in another team for this competition' },
        { status: 409 }
      );
    }

    // Add member
    team.members.push({
      userId: new mongoose.Types.ObjectId(userId),
      userName,
      userAvatar: userAvatar || null,
      role: 'member',
      joinedAt: new Date(),
    });

    team.memberCount = team.members.length;
    await team.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Member added successfully',
        data: team,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to add member' },
      { status: 500 }
    );
  }
}

// DELETE - Remove member from team
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const teamId = id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'userId is required' },
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

    const memberIndex = team.members.findIndex(
      (member) => member.userId.toString() === userId
    );

    if (memberIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Member not found in team' },
        { status: 404 }
      );
    }

    // Don't allow removal of team leader
    if (team.members[memberIndex].role === 'leader') {
      return NextResponse.json(
        { success: false, message: 'Cannot remove team leader' },
        { status: 403 }
      );
    }

    // Remove member
    team.members.splice(memberIndex, 1);
    team.memberCount = team.members.length;

    // If team is empty or only has leader, mark as not looking for members
    if (team.memberCount <= 1) {
      team.lookingForMembers = false;
    }

    await team.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Member removed successfully',
        data: team,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to remove member' },
      { status: 500 }
    );
  }
}
