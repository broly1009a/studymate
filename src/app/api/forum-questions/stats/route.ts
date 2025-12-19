import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Question from '@/models/Question';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const totalQuestions = await Question.countDocuments();
    const openQuestions = await Question.countDocuments({ status: 'open' });
    const answeredQuestions = await Question.countDocuments({ answersCount: { $gt: 0 } });
    const closedQuestions = await Question.countDocuments({ status: 'closed' });

    // Get total views
    const questions = await Question.find({}, 'views');
    const totalViews = questions.reduce((sum, q) => sum + (q.views || 0), 0);

    // Get unique subjects
    const subjects = await Question.distinct('subject');

    return NextResponse.json({
      data: {
        totalQuestions,
        openQuestions,
        answeredQuestions,
        totalViews,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}