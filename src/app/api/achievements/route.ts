import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Achievement from '@/models/Achievement';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const isUnlocked = searchParams.get('isUnlocked');
    const category = searchParams.get('category');
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const query: any = { userId };
    if (isUnlocked !== undefined) query.isUnlocked = isUnlocked === 'true';
    if (category) query.category = category;

    const achievements = await Achievement.find(query)
      .sort({ unlockedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Achievement.countDocuments(query);

    // Get stats
    const unlockedCount = await Achievement.countDocuments({ userId, isUnlocked: true });
    const totalPoints = await Achievement.aggregate([
      { $match: { userId: new (require('mongodb')).ObjectId(userId), isUnlocked: true } },
      { $group: { _id: null, totalPoints: { $sum: '$points' } } },
    ]);

    return NextResponse.json({
      data: achievements,
      total,
      skip,
      limit,
      stats: {
        unlockedCount,
        totalPoints: totalPoints[0]?.totalPoints || 0,
        completionRate: (unlockedCount / total) * 100,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      userId,
      title,
      description,
      icon,
      category,
      rarity,
      points,
      requirement,
    } = body;

    if (!userId || !title || !description || !icon || !points || !requirement) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    const newAchievement = new Achievement({
      userId,
      title,
      description,
      icon,
      category: category || 'milestone',
      rarity: rarity || 'common',
      points,
      requirement,
      isUnlocked: false,
      progress: 0,
    });

    const savedAchievement = await newAchievement.save();

    return NextResponse.json(savedAchievement, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
