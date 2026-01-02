import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ReputationHistory from '@/models/ReputationHistory';
import User from '@/models/User';

// GET - Get reputation history with filters
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type'); // 'earned' | 'lost'
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const query: any = { userId };

    if (type) {
      query.type = type;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    // Get history
    const history = await ReputationHistory
      .find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ReputationHistory.countDocuments(query);

    // Aggregate stats
    const stats = await ReputationHistory.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$points' },
          count: { $sum: 1 }
        }
      }
    ]);

    const earnedStats = stats.find(s => s._id === 'earned') || { total: 0, count: 0 };
    const lostStats = stats.find(s => s._id === 'lost') || { total: 0, count: 0 };

    return NextResponse.json(
      {
        success: true,
        data: {
          history,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          },
          stats: {
            earned: earnedStats.total,
            earnedCount: earnedStats.count,
            lost: lostStats.total,
            lostCount: lostStats.count,
            net: earnedStats.total - lostStats.total
          }
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching reputation history:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch reputation history'
      },
      { status: 500 }
    );
  }
}

// POST - Award or deduct reputation
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, points, reason, type = 'earned' } = body;

    if (!userId || !points || !reason) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (points < 0) {
      return NextResponse.json(
        { success: false, message: 'Points must be positive' },
        { status: 400 }
      );
    }

    // Create history record
    const historyEntry = await ReputationHistory.create({
      userId,
      points,
      reason,
      type,
      date: new Date()
    });

    // Update user's total reputation
    const increment = type === 'earned' ? points : -points;
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        $inc: { reputation: increment },
        $max: { reputation: 0 } // Prevent negative reputation
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Reputation ${type === 'earned' ? 'awarded' : 'deducted'} successfully`,
        data: {
          historyEntry,
          currentReputation: user.reputation
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error managing reputation:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to manage reputation'
      },
      { status: 500 }
    );
  }
}
