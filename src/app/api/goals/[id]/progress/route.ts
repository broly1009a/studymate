import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Goal from '@/models/Goal';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await req.json();
    const { currentValue } = body;

    if (currentValue === undefined) {
      return NextResponse.json({ error: 'currentValue is required' }, { status: 400 });
    }

    const goal = await Goal.findById(id);
    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    // Update current value
    goal.currentValue = Math.min(goal.currentValue + currentValue, goal.targetValue);

    // Auto-complete if target reached
    if (goal.currentValue >= goal.targetValue && goal.status === 'active') {
      goal.status = 'completed';
      goal.completedAt = new Date();
    }

    const updatedGoal = await goal.save();

    return NextResponse.json(updatedGoal);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
