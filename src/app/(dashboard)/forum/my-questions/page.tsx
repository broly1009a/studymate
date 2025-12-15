'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getQuestions } from '@/lib/mock-data/forum';
import { Plus, MessageSquare, Eye, TrendingUp, CheckCircle2, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';

export default function MyQuestionsPage() {
  const [filter, setFilter] = useState<'all' | 'open' | 'answered'>('all');

  // In a real app, this would filter by current user
  const questions = getQuestions({
    status: filter === 'all' ? undefined : filter as any,
  }).slice(0, 3);

  const handleDelete = (questionId: string) => {
    toast.success('Đã xóa câu hỏi');
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Câu hỏi của tôi</h1>
          <p className="text-muted-foreground mt-2">Quản lý câu hỏi và theo dõi câu trả lời</p>
        </div>
        <Link href="/forum/ask">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {vi.forum.askQuestion}
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{questions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Answered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {questions.filter(q => q.status === 'answered').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {questions.reduce((sum, q) => sum + q.views, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'open' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('open')}
        >
          Open
        </Button>
        <Button
          variant={filter === 'answered' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('answered')}
        >
          Answered
        </Button>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Questions Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start asking questions to get help from the community
              </p>
              <Link href="/forum/ask">
                <Button>Ask Your First Question</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          questions.map((question) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <Link href={`/forum/${question.id}`}>
                        <CardTitle className="text-lg hover:text-primary cursor-pointer">
                          {question.title}
                        </CardTitle>
                      </Link>
                      {question.hasAcceptedAnswer && (
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    <CardDescription className="mt-2 line-clamp-2">
                      {question.content}
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                      <span>{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{question.subject}</Badge>
                    {question.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {question.votes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {question.answersCount}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {question.views}
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

