import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Competition from '@/models/Competition';

// GET - Fetch competition statistics
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const totalCompetitions = await Competition.countDocuments();
    const upcomingCompetitions = await Competition.countDocuments({ status: 'upcoming' });
    const ongoingCompetitions = await Competition.countDocuments({ status: 'ongoing' });
    const completedCompetitions = await Competition.countDocuments({ status: 'completed' });

    // Calculate total participants across all competitions
    const competitions = await Competition.find({}, 'participants');
    const totalParticipants = competitions.reduce((total, comp) => total + (comp.participants?.length || 0), 0);

    return NextResponse.json(
      {
        success: true,
        data: {
          totalCompetitions,
          upcomingCompetitions,
          ongoingCompetitions,
          completedCompetitions,
          totalParticipants,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch competition stats',
      },
      { status: 500 }
    );
  }
}