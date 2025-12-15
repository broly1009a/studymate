import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Partner from '@/models/Partner';

// GET - Get partners statistics
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const totalPartners = await Partner.countDocuments();

    const activePartners = await Partner.countDocuments({ status: 'available' });

    const averageRating = await Partner.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    const completedSessions = await Partner.aggregate([
      {
        $group: {
          _id: null,
          totalSessions: { $sum: '$sessionsCompleted' },
        },
      },
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          totalPartners,
          activePartners,
          averageRating: averageRating[0]?.avgRating || 0,
          completedSessions: completedSessions[0]?.totalSessions || 0,
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
