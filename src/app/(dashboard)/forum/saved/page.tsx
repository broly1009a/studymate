'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bookmark, MessageSquare, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { vi } from '@/lib/i18n/vi';

export default function SavedQuestionsPage() {
  const savedQuestions = [
    {
      id: '1',
      title: 'How to implement binary search tree?',
      tags: ['algorithms', 'data-structures', 'trees'],
      votes: 12,
      answers: 5,
      savedAt: '2025-10-25T10:00:00',
    },
    {
      id: '2',
      title: 'Understanding recursion in programming',
      tags: ['programming', 'recursion', 'algorithms'],
      votes: 23,
      answers: 8,
      savedAt: '2025-10-24T14:30:00',
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Câu hỏi đã lưu</h1>
        <p className="text-muted-foreground mt-2">Câu hỏi bạn đã đánh dấu để xem sau</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saved Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedQuestions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Answers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {savedQuestions.reduce((sum, q) => sum + q.answers, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {savedQuestions.reduce((sum, q) => sum + q.votes, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {savedQuestions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Saved Questions</h3>
              <p className="text-muted-foreground mb-4">
                Bookmark questions to save them for later
              </p>
              <Link href="/forum">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                  Browse Questions
                </button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          savedQuestions.map((question) => (
            <Card key={question.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-2 text-center min-w-[80px]">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="font-medium">{question.votes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-500">
                      <MessageSquare className="h-4 w-4" />
                      <span className="font-medium">{question.answers}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <Link href={`/forum/${question.id}`}>
                      <h3 className="text-lg font-medium hover:text-primary cursor-pointer">
                        {question.title}
                      </h3>
                    </Link>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {question.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                      <Bookmark className="h-3 w-3" />
                      <span>
                        Saved {formatDistanceToNow(new Date(question.savedAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

