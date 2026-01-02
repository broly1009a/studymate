import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ReputationHistory from '@/models/ReputationHistory';
import User from '@/models/User';

// Helper function to get user rank
function getUserRank(reputation: number): string {
  if (reputation >= 10000) return 'Legend';
  if (reputation >= 5000) return 'Master';
  if (reputation >= 2000) return 'Expert';
  if (reputation >= 1000) return 'Advanced';
  if (reputation >= 500) return 'Intermediate';
  if (reputation >= 100) return 'Beginner';
  return 'Novice';
}

function getNextRankThreshold(reputation: number): { rank: string; threshold: number } {
  const ranks = [
    { rank: 'Beginner', threshold: 100 },
    { rank: 'Intermediate', threshold: 500 },
    { rank: 'Advanced', threshold: 1000 },
    { rank: 'Expert', threshold: 2000 },
    { rank: 'Master', threshold: 5000 },
    { rank: 'Legend', threshold: 10000 },
  ];

  for (const rank of ranks) {
    if (reputation < rank.threshold) {
      return rank;
    }
  }

  return { rank: 'Legend', threshold: 10000 };
}

// GET - Get user's reputation stats and rank
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await User.findById(userId).select('reputation fullName avatar');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const reputation = user.reputation || 0;
    const currentRank = getUserRank(reputation);
    const nextRank = getNextRankThreshold(reputation);

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentHistory = await ReputationHistory.aggregate([
      {
        $match: {
          userId: user._id,
          date: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$points' },
          count: { $sum: 1 }
        }
      }
    ]);

    const earnedRecent = recentHistory.find(h => h._id === 'earned') || { total: 0, count: 0 };
    const lostRecent = recentHistory.find(h => h._id === 'lost') || { total: 0, count: 0 };

    // Get top sources of reputation
    const topSources = await ReputationHistory.aggregate([
      {
        $match: {
          userId: user._id,
          type: 'earned'
        }
      },
      {
        $group: {
          _id: '$reason',
          total: { $sum: '$points' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 5 }
    ]);

    // Get leaderboard position
    const usersAbove = await User.countDocuments({
      reputation: { $gt: reputation }
    });
    const leaderboardPosition = usersAbove + 1;

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.fullName,
            avatar: user.avatar
          },
          reputation,
          rank: {
            current: currentRank,
            next: nextRank.rank,
            progress: reputation / nextRank.threshold,
            pointsToNext: nextRank.threshold - reputation
          },
          recentActivity: {
            earned: earnedRecent.total,
            earnedCount: earnedRecent.count,
            lost: lostRecent.total,
            lostCount: lostRecent.count,
            net: earnedRecent.total - lostRecent.total
          },
          topSources: topSources.map(s => ({
            reason: s._id,
            points: s.total,
            count: s.count
          })),
          leaderboardPosition
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching reputation stats:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch reputation stats'
      },
      { status: 500 }
    );
  }
}
