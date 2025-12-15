import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Goal from '@/models/Goal';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const goal = await Goal.findById(params.id).populate('subjectId', 'name');

    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    return NextResponse.json(goal);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const body = await req.json();
    const { title, description, targetValue, currentValue, status, priority, color, icon } = body;

    const updatedGoal = await Goal.findByIdAndUpdate(
      params.id,
      {
        $set: {
          ...(title && { title }),
          ...(description && { description }),
          ...(targetValue !== undefined && { targetValue }),
          ...(currentValue !== undefined && { currentValue }),
          ...(status && {
            status,
            ...(status === 'completed' && { completedAt: new Date() }),
          }),
          ...(priority && { priority }),
          ...(color && { color }),
          ...(icon && { icon }),
        },
      },
      { new: true, runValidators: true }
    ).populate('subjectId', 'name');

    if (!updatedGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    return NextResponse.json(updatedGoal);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const deletedGoal = await Goal.findByIdAndDelete(params.id);

    if (!deletedGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Goal deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
