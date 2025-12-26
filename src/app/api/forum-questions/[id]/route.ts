import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Question from '@/models/Question';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid question ID' }, { status: 400 });
    }

    const question = await Question.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('authorId', 'username avatar reputation');

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid question ID' }, { status: 400 });
    }

    const body = await req.json();
    const { title, content, tags, status } = body;

    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(title && { title }),
          ...(content && { content }),
          ...(tags && { tags }),
          ...(status && { status }),
        },
      },
      { new: true, runValidators: true }
    ).populate('authorId', 'username avatar reputation');

    if (!updatedQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(updatedQuestion);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid question ID' }, { status: 400 });
    }

    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Question deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
