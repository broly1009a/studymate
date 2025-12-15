import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Answer from '@/models/Answer';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const body = await req.json();
    const { userId, voteType } = body;

    if (!userId || !voteType) {
      return NextResponse.json({ error: 'userId and voteType are required' }, { status: 400 });
    }

    const answer = await Answer.findById(params.id);
    if (!answer) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 });
    }

    const userIndex = answer.votedBy.findIndex((id) => id.toString() === userId);

    if (voteType === 'upvote') {
      if (userIndex !== -1) {
        return NextResponse.json({ error: 'User already voted' }, { status: 409 });
      }
      answer.votes += 1;
      answer.votedBy.push(userId);
    } else if (voteType === 'downvote') {
      if (userIndex === -1) {
        return NextResponse.json({ error: 'User has not voted' }, { status: 409 });
      }
      answer.votes -= 1;
      answer.votedBy.splice(userIndex, 1);
    }

    const updatedAnswer = await answer.save();

    return NextResponse.json(updatedAnswer);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
