import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CompetitionTeam from '@/models/CompetitionTeam';

// GET - Fetch all competition teams with filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const lookingForMembers = searchParams.get('lookingForMembers');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;
    const query: any = {};

    if (lookingForMembers === 'true') {
      query.lookingForMembers = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skillsNeeded: { $regex: search, $options: 'i' } },
      ];
    }

    const teams = await CompetitionTeam.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('competitionId', 'title status')
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
