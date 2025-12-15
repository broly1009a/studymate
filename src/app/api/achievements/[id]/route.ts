import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Achievement from '@/models/Achievement';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const achievement = await Achievement.findById(params.id);

    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    return NextResponse.json(achievement);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const body = await req.json();
    const { isUnlocked, progress } = body;

    const updatedAchievement = await Achievement.findByIdAndUpdate(
      params.id,
      {
        $set: {
          ...(isUnlocked !== undefined && {
            isUnlocked,
            ...(isUnlocked && { unlockedAt: new Date() }),
          }),
          ...(progress !== undefined && { progress: Math.min(progress, 100) }),
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedAchievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    return NextResponse.json(updatedAchievement);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const deletedAchievement = await Achievement.findByIdAndDelete(params.id);

    if (!deletedAchievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Achievement deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
