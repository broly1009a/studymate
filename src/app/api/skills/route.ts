import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Skill from '@/models/Skill';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const query: any = { userId };
    if (category) query.category = category;

    const skills = await Skill.find(query)
      .sort({ yearsOfExperience: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Skill.countDocuments(query);

    return NextResponse.json({
      data: skills,
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
    const { userId, name, category, level, yearsOfExperience } = body;

    if (!userId || !name || !category) {
      return NextResponse.json(
        { error: 'userId, name, and category are required' },
        { status: 400 }
      );
    }

    const newSkill = new Skill({
      userId,
      name,
      category,
      level: level || 'beginner',
      yearsOfExperience: yearsOfExperience || 0,
    });

    const savedSkill = await newSkill.save();

    return NextResponse.json(savedSkill, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
