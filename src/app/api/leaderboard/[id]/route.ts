import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ReputationHistory from '@/models/ReputationHistory';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get reputation history for a user
    const history = await ReputationHistory.find({ userId: params.id })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ReputationHistory.countDocuments({ userId: params.id });

    return NextResponse.json({
      data: history,
      total,
      skip,
      limit,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
