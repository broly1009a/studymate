import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Answer from '@/models/Answer';
import Question from '@/models/Question';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get('questionId');
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!questionId) {
      return NextResponse.json({ error: 'questionId is required' }, { status: 400 });
    }

    const answers = await Answer.find({ questionId })
      .populate('authorId', 'username avatar reputation')
      .sort({ isAccepted: -1, votes: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Answer.countDocuments({ questionId });

    return NextResponse.json({
      data: answers,
      total,
      skip,
      limit,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { questionId, content, authorId } = body;

    if (!questionId || !content || !authorId) {
      return NextResponse.json(
        { error: 'questionId, content, and authorId are required' },
        { status: 400 }
      );
    }

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const newAnswer = new Answer({
      questionId,
      content,
      authorId,
    });

    const savedAnswer = await newAnswer.save();

    // Update question answersCount and status
    await Question.findByIdAndUpdate(
      questionId,
      {
        $inc: { answersCount: 1 },
        ...(question.status === 'open' && { status: 'answered' }),
      }
    );

    const populatedAnswer = await savedAnswer.populate('authorId', 'username avatar reputation');

    return NextResponse.json(populatedAnswer, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
