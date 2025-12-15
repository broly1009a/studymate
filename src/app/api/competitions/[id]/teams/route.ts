import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CompetitionTeam from '@/models/CompetitionTeam';
import Competition from '@/models/Competition';
import mongoose from 'mongoose';

// GET - Fetch teams for a competition with filtering
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const competitionId = params.id;

    // Verify competition exists
    const competition = await Competition.findById(competitionId);
    if (!competition) {
      return NextResponse.json(
        { success: false, message: 'Competition not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const lookingForMembers = searchParams.get('lookingForMembers');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;
    const query: any = { competitionId: new mongoose.Types.ObjectId(competitionId) };

    if (lookingForMembers === 'true') {
      query.lookingForMembers = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { skillsNeeded: { $regex: search, $options: 'i' } },
      ];
    }

    const teams = await CompetitionTeam.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('members.userId', 'fullName avatar email');

    const total = await CompetitionTeam.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: teams,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}

// POST - Create a new team for competition
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const competitionId = params.id;
    const body = await request.json();
    const { name, description, maxMembers, skillsNeeded, leaderUserId, leaderUserName, leaderUserAvatar } = body;

    // Validate required fields
    if (!name || !description || !leaderUserId) {
      return NextResponse.json(
        { success: false, message: 'Name, description, and leaderUserId are required' },
        { status: 400 }
      );
    }

    // Verify competition exists
    const competition = await Competition.findById(competitionId);
    if (!competition) {
      return NextResponse.json(
        { success: false, message: 'Competition not found' },
        { status: 404 }
      );
    }

    // Check if user is already in another team for this competition
    const existingTeam = await CompetitionTeam.findOne({
      competitionId: new mongoose.Types.ObjectId(competitionId),
      'members.userId': new mongoose.Types.ObjectId(leaderUserId),
    });

    if (existingTeam) {
      return NextResponse.json(
        { success: false, message: 'User is already in a team for this competition' },
        { status: 409 }
      );
    }

    const newTeam = new CompetitionTeam({
      competitionId: new mongoose.Types.ObjectId(competitionId),
      name,
      description,
      maxMembers: maxMembers || 5,
      skillsNeeded: skillsNeeded || [],
      members: [
        {
          userId: new mongoose.Types.ObjectId(leaderUserId),
          userName: leaderUserName || 'Unknown',
          userAvatar: leaderUserAvatar || null,
          role: 'leader',
          joinedAt: new Date(),
        },
      ],
      memberCount: 1,
      lookingForMembers: true,
    });

    await newTeam.save();

    // Update competition teamCount
    await Competition.findByIdAndUpdate(
      competitionId,
      { $inc: { teamCount: 1 } }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Team created successfully',
        data: newTeam,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create team' },
      { status: 500 }
    );
  }
}
