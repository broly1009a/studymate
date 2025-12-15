'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MessageSquare, ThumbsUp, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from '@/lib/i18n/vi';

// Mock answers data
const mockAnswers = [
  {
    id: '1',
    questionId: '1',
    questionTitle: 'How to solve quadratic equations using the quadratic formula?',
    content: 'The quadratic formula is x = (-b ± √(b²-4ac)) / 2a. Here\'s a step-by-step guide...',
    votes: 12,
    isAccepted: true,
    createdAt: '2025-10-26T14:20:00',
    questionAuthor: 'Alex Chen',
  },
  {
    id: '2',
    questionId: '2',
    questionTitle: 'What is the difference between stack and heap memory?',
    content: 'Stack memory is used for static memory allocation and heap for dynamic memory allocation...',
    votes: 8,
    isAccepted: false,
    createdAt: '2025-10-25T09:30:00',
    questionAuthor: 'Sarah Johnson',
  },
  {
    id: '3',
    questionId: '5',
    questionTitle: 'Best practices for React hooks?',
    content: 'Here are the key best practices: 1. Only call hooks at the top level...',
    votes: 15,
    isAccepted: true,
    createdAt: '2025-10-24T16:45:00',
    questionAuthor: 'Mike Wilson',
  },
  {
    id: '4',
    questionId: '8',
    questionTitle: 'How to optimize SQL queries?',
    content: 'SQL query optimization involves several techniques: indexing, query rewriting...',
    votes: 6,
    isAccepted: false,
    createdAt: '2025-10-23T11:20:00',
    questionAuthor: 'Emma Davis',
  },
];

export default function MyAnswersPage() {
  const [filter, setFilter] = useState<string>('all');

  const filteredAnswers = mockAnswers.filter(answer => {
    if (filter === 'accepted') return answer.isAccepted;
    if (filter === 'not-accepted') return !answer.isAccepted;
    return true;
  });

  const stats = {
    total: mockAnswers.length,
    accepted: mockAnswers.filter(a => a.isAccepted).length,
    totalVotes: mockAnswers.reduce((sum, a) => sum + a.votes, 0),
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/forum">
            <Button variant="ghost" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {vi.common.back}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Câu trả lời của tôi</h1>
          <p className="text-muted-foreground">Quản lý các câu trả lời bạn đã đóng góp</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng câu trả lời
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Được chấp nhận
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng votes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalVotes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Lọc:</span>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả ({stats.total})</SelectItem>
                <SelectItem value="accepted">Được chấp nhận ({stats.accepted})</SelectItem>
                <SelectItem value="not-accepted">Chưa chấp nhận ({stats.total - stats.accepted})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Answers List */}
      {filteredAnswers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Chưa có câu trả lời</h3>
            <p className="text-muted-foreground mb-4">
              Bạn chưa trả lời câu hỏi nào. Hãy bắt đầu chia sẻ kiến thức!
            </p>
            <Link href="/forum">
              <Button>Xem câu hỏi</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAnswers.map((answer) => (
            <Card key={answer.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Votes */}
                  <div className="flex flex-col items-center gap-1 min-w-[60px]">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-lg font-bold">{answer.votes}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">votes</span>
                    {answer.isAccepted && (
                      <Badge className="bg-green-500 mt-2">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Accepted
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/forum/${answer.questionId}`}>
                      <h3 className="text-lg font-semibold hover:text-primary mb-2">
                        {answer.questionTitle}
                      </h3>
                    </Link>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {answer.content}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Trả lời {format(new Date(answer.createdAt), 'dd/MM/yyyy HH:mm')}</span>
                      </div>
                      <span>•</span>
                      <span>Câu hỏi của {answer.questionAuthor}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <Link href={`/forum/${answer.questionId}`}>
                        <Button variant="outline" size="sm">
                          Xem câu hỏi
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

