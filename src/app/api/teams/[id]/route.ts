import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CompetitionTeam from '@/models/CompetitionTeam';
import Competition from '@/models/Competition';
import User from '@/models/User';

// GET - Fetch team details by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const team = await CompetitionTeam.findById(id)
      .populate('competitionId', 'title description')
      .populate('members.userId', 'fullName avatar email');

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

// PUT - Update team (e.g., add member, update info)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const team = await CompetitionTeam.findById(id);
    if (!team) {
      return NextResponse.json(
        { success: false, message: 'Team not found' },
        { status: 404 }
      );
    }

    // Update team fields
    if (body.name) team.name = body.name;
    if (body.description) team.description = body.description;
    if (body.skillsNeeded) team.skillsNeeded = body.skillsNeeded;
    if (typeof body.lookingForMembers === 'boolean') {
      team.lookingForMembers = body.lookingForMembers;
    }

    await team.save();

    return NextResponse.json(
      {
        success: true,
        data: team,
        message: 'Team updated successfully',
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

    const team = await CompetitionTeam.findByIdAndDelete(id);
    if (!team) {
      return NextResponse.json(
        { success: false, message: 'Team not found' },
        { status: 404 }
      );
    }

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
