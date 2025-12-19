import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Question from '@/models/Question';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Get all questions and aggregate tags
    const questions = await Question.find({}, 'tags');

    // Count tag occurrences
    const tagCounts: { [key: string]: number } = {};

    questions.forEach(question => {
      if (question.tags && Array.isArray(question.tags)) {
        question.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    // Convert to array and sort by count
    const popularTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Top 20 popular tags

    return NextResponse.json({
      data: popularTags,
      total: popularTags.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}