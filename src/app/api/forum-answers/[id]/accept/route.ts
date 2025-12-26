import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Answer from '@/models/Answer';
import Question from '@/models/Question';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const { id } = await params;

    const answer = await Answer.findById(id);
    if (!answer) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 });
    }

    if (answer.isAccepted) {
      return NextResponse.json({ error: 'Answer already accepted' }, { status: 409 });
    }

    // Unaccept other answers for same question
    await Answer.updateMany(
      { questionId: answer.questionId, isAccepted: true },
      { $set: { isAccepted: false } }
    );

    // Accept this answer
    const acceptedAnswer = await Answer.findByIdAndUpdate(
      id,
      { $set: { isAccepted: true } },
      { new: true }
    ).populate('authorId', 'username avatar reputation');

    // Update question
    await Question.findByIdAndUpdate(
      answer.questionId,
      { $set: { hasAcceptedAnswer: true, status: 'answered' } }
    );

    return NextResponse.json(acceptedAnswer);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
