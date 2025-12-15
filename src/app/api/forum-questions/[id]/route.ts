import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Question from '@/models/Question';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const question = await Question.findByIdAndUpdate(
      params.id,
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const body = await req.json();
    const { title, content, tags, status } = body;

    const updatedQuestion = await Question.findByIdAndUpdate(
      params.id,
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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const deletedQuestion = await Question.findByIdAndDelete(params.id);

    if (!deletedQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Question deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
