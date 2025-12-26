import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CompetitionTeam from '@/models/CompetitionTeam';
import Competition from '@/models/Competition';

// GET - Fetch a single team
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const teamId = id;
    const team = await CompetitionTeam.findById(teamId).populate('members.userId', 'fullName avatar email');

    if (!team) {
      return NextResponse.json(
        { success: false, message: 'Team not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: team,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch team' },
      { status: 500 }
    );
  }
}

// PUT - Update team
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const teamId = id;
    const body = await request.json();
    const { name, description, maxMembers, skillsNeeded, lookingForMembers } = body;

    const team = await CompetitionTeam.findById(teamId);
    if (!team) {
      return NextResponse.json(
        { success: false, message: 'Team not found' },
        { status: 404 }
      );
    }

    // Update fields
    if (name) team.name = name;
    if (description) team.description = description;
    if (maxMembers) team.maxMembers = maxMembers;
    if (skillsNeeded) team.skillsNeeded = skillsNeeded;
    if (lookingForMembers !== undefined) team.lookingForMembers = lookingForMembers;

    await team.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Team updated successfully',
        data: team,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update team' },
      { status: 500 }
    );
  }
}

// DELETE - Delete team
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const teamId = id;
    const team = await CompetitionTeam.findByIdAndDelete(teamId);

    if (!team) {
      return NextResponse.json(
        { success: false, message: 'Team not found' },
        { status: 404 }
      );
    }

    // Decrement competition teamCount
    await Competition.findByIdAndUpdate(
      team.competitionId,
      { $inc: { teamCount: -1 } }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Team deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete team' },
      { status: 500 }
    );
  }
}
