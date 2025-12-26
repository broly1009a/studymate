import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ForumComment from '@/models/ForumComment';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const { id } = await params;

    const comment = await ForumComment.findById(id).populate('authorId', 'username avatar');
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json(comment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const body = await req.json();
    const { content } = body;

    const { id } = await params;

    const updatedComment = await ForumComment.findByIdAndUpdate(
      id,
      { $set: { content } },
      { new: true, runValidators: true }
    ).populate('authorId', 'username avatar');

    if (!updatedComment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json(updatedComment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const { id } = await params;

    const deletedComment = await ForumComment.findByIdAndDelete(id);

    if (!deletedComment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
