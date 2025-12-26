import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Answer from '@/models/Answer';
import Question from '@/models/Question';

export async function GET(req: NextRequest,{ params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const { id } = await params;

    const answer = await Answer.findById(id).populate('authorId', 'username avatar reputation');
    if (!answer) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 });
    }

    return NextResponse.json(answer);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await req.json();
    const { content } = body;

    const updatedAnswer = await Answer.findByIdAndUpdate(
      id,
      { $set: { content } },
      { new: true, runValidators: true }
    ).populate('authorId', 'username avatar reputation');

    if (!updatedAnswer) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 });
    }

    return NextResponse.json(updatedAnswer);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const { id } = await params;

    const answer = await Answer.findById(id);
    if (!answer) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 });
    }

    const deletedAnswer = await Answer.findByIdAndDelete(id);

    // Update question answersCount
    await Question.findByIdAndUpdate(
      answer.questionId,
      { $inc: { answersCount: -1 } }
    );

    return NextResponse.json({ message: 'Answer deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
