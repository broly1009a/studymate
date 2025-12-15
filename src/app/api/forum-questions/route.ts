import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Question from '@/models/Question';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    const status = searchParams.get('status');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query: any = {};
    if (subject) query.subject = subject;
    if (status) query.status = status;
    if (tag) query.tags = { $in: [tag] };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const questions = await Question.find(query)
      .populate('authorId', 'username avatar reputation')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Question.countDocuments(query);

    return NextResponse.json({
      data: questions,
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
    const { title, content, authorId, subject, tags } = body;

    if (!title || !content || !authorId || !subject) {
      return NextResponse.json(
        { error: 'title, content, authorId, and subject are required' },
        { status: 400 }
      );
    }

    const newQuestion = new Question({
      title,
      content,
      authorId,
      subject,
      tags: tags || [],
    });

    const savedQuestion = await newQuestion.save();
    const populatedQuestion = await savedQuestion.populate('authorId', 'username avatar reputation');

    return NextResponse.json(populatedQuestion, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
