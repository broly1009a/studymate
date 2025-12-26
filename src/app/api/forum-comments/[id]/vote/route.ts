import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ForumComment from '@/models/ForumComment';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const body = await req.json();
    const { userId, voteType } = body;

    if (!userId || !voteType) {
      return NextResponse.json({ error: 'userId and voteType are required' }, { status: 400 });
    }

    const { id } = await params;
    const comment = await ForumComment.findById(id);
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    const userIndex = comment.votedBy.findIndex((id) => id.toString() === userId);

    if (voteType === 'upvote') {
      if (userIndex !== -1) {
        return NextResponse.json({ error: 'User already voted' }, { status: 409 });
      }
      comment.votes += 1;
      comment.votedBy.push(userId);
    } else if (voteType === 'downvote') {
      if (userIndex === -1) {
        return NextResponse.json({ error: 'User has not voted' }, { status: 409 });
      }
      comment.votes -= 1;
      comment.votedBy.splice(userIndex, 1);
    }

    const updatedComment = await comment.save();

    return NextResponse.json(updatedComment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
