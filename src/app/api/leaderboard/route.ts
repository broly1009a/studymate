import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ReputationHistory from '@/models/ReputationHistory';
import UserProfile from '@/models/UserProfile';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get leaderboard: all users sorted by reputation
    const profiles = await UserProfile.find()
      .sort({ reputation: -1 })
      .skip(skip)
      .limit(limit);

    const leaderboard = profiles.map((profile, index) => ({
      rank: skip + index + 1,
      userId: profile.userId,
      username: profile.username,
      fullName: profile.fullName,
      avatar: profile.avatar,
      reputation: profile.reputation,
    }));

    const total = await UserProfile.countDocuments();

    return NextResponse.json({
      data: leaderboard,
      total,
      skip,
      limit,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Add reputation points to user
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { userId, points, reason } = body;

    if (!userId || !points || !reason) {
      return NextResponse.json(
        { error: 'userId, points, and reason are required' },
        { status: 400 }
      );
    }

    // Create reputation history record
    const newHistory = new ReputationHistory({
      userId,
      points,
      reason,
      type: 'earned',
      date: new Date(),
    });

    await newHistory.save();

    // Update user profile reputation
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $inc: { reputation: points } },
      { new: true }
    );

    return NextResponse.json({ history: newHistory, profile: updatedProfile }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
