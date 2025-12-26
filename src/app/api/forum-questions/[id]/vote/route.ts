import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Question from '@/models/Question';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const body = await req.json();
    const { userId, voteType } = body;

    if (!userId || !voteType) {
      return NextResponse.json({ error: 'userId and voteType are required' }, { status: 400 });
    }

    const { id } = await params;
    const question = await Question.findById(id);
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const userIndex = question.votedBy.findIndex((id) => id.toString() === userId);

    if (voteType === 'upvote') {
      if (userIndex !== -1) {
        return NextResponse.json({ error: 'User already voted' }, { status: 409 });
      }
      question.votes += 1;
      question.votedBy.push(userId);
    } else if (voteType === 'downvote') {
      if (userIndex === -1) {
        return NextResponse.json({ error: 'User has not voted' }, { status: 409 });
      }
      question.votes -= 1;
      question.votedBy.splice(userIndex, 1);
    }

    const updatedQuestion = await question.save();

    return NextResponse.json(updatedQuestion);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
