import { NextRequest, NextResponse } from 'next/server';
import Goal from '@/models/Goal';
import connectDB from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const goalStats = await Goal.aggregate([
      { $match: { userId: { $oid: userId } } },
      {
        $facet: {
          total: [{ $count: 'count' }],
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
          ],
          avgProgress: [
            { $group: { _id: null, avg: { $avg: '$progress' } } },
          ],
          completed: [
            { $match: { status: 'completed' } },
            { $count: 'count' },
          ],
        },
      },
    ]);

    // Use try-catch because oid might not work
    let query: any = { userId };

    const stats = await Goal.aggregate([
      { $match: query },
      {
        $facet: {
          total: [{ $count: 'count' }],
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
          ],
          avgProgress: [
            { $group: { _id: null, avg: { $avg: '$progress' } } },
          ],
          completed: [
            { $match: { status: 'completed' } },
            { $count: 'count' },
          ],
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalGoals: stats[0].total[0]?.count || 0,
        completedGoals: stats[0].completed[0]?.count || 0,
        averageProgress: Math.round(stats[0].avgProgress[0]?.avg || 0),
        byStatus: stats[0].byStatus || [],
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch goal statistics', error: String(error) },
      { status: 500 }
    );
  }
}
