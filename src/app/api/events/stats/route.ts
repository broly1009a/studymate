import { NextRequest, NextResponse } from 'next/server';
import Event from '@/models/Event';
import connectDB from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const eventStats = await Event.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          byType: [
            { $group: { _id: '$type', count: { $sum: 1 } } },
          ],
          upcoming: [
            { $match: { date: { $gte: new Date() } } },
            { $count: 'count' },
          ],
          past: [
            { $match: { date: { $lt: new Date() } } },
            { $count: 'count' },
          ],
          avgParticipants: [
            { $group: { _id: null, avg: { $avg: '$participantCount' } } },
          ],
        },
      },
    ]);

    const stats = {
      totalEvents: eventStats[0].total[0]?.count || 0,
      upcomingEvents: eventStats[0].upcoming[0]?.count || 0,
      pastEvents: eventStats[0].past[0]?.count || 0,
      averageParticipants: Math.round(eventStats[0].avgParticipants[0]?.avg || 0),
      byType: eventStats[0].byType || [],
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch event statistics', error: String(error) },
      { status: 500 }
    );
  }
}
