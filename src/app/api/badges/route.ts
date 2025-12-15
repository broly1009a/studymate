import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Badge from '@/models/Badge';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');
    const locked = searchParams.get('locked');
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const query: any = { userId };
    if (category) query.category = category;
    if (locked !== undefined) query.locked = locked === 'true';

    const badges = await Badge.find(query)
      .sort({ earnedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Badge.countDocuments(query);

    return NextResponse.json({
      data: badges,
      total,
      skip,
      limit,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { userId, name, description, icon, category, requirement } = body;

    if (!userId || !name || !description || !icon) {
      return NextResponse.json(
        { error: 'userId, name, description, and icon are required' },
        { status: 400 }
      );
    }

    const newBadge = new Badge({
      userId,
      name,
      description,
      icon,
      category: category || 'achievement',
      requirement: requirement || null,
      locked: true,
    });

    const savedBadge = await newBadge.save();

    return NextResponse.json(savedBadge, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
