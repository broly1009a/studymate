'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MessageSquare, ThumbsUp, CheckCircle, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from '@/lib/i18n/vi';
import { toast } from 'sonner';
import { API_URL } from '@/lib/constants';
interface Answer {
  _id: string;
  id?: string;
  questionId: string;
  questionTitle: string;
  content: string;
  votes: number;
  isAccepted: boolean;
  createdAt: string;
  questionAuthor?: string;
}

interface AnswerStats {
  total: number;
  accepted: number;
  totalVotes: number;
}

export default function MyAnswersPage() {
  const [filter, setFilter] = useState<string>('all');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [stats, setStats] = useState<AnswerStats>({
    total: 0,
    accepted: 0,
    totalVotes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/forum-answers/my-answers`);
        if (!response.ok) {
          throw new Error('Failed to fetch answers');
        }
        const data = await response.json();
        setAnswers(data.data || []);
        
        // Calculate stats
        const total = data.data?.length || 0;
        const accepted = data.data?.filter((a: any) => a.isAccepted).length || 0;
        const totalVotes = data.data?.reduce((sum: number, a: any) => sum + (a.votes || 0), 0) || 0;
        
        setStats({
          total,
          accepted,
          totalVotes,
        });
      } catch (error: any) {
        toast.error('Không thể tải câu trả lời');
        console.error('Error fetching answers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, []);

  const filteredAnswers = answers.filter(answer => {
    if (filter === 'accepted') return answer.isAccepted;
    if (filter === 'not-accepted') return !answer.isAccepted;
    return true;
  });

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
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50 animate-spin" />
            <h3 className="text-lg font-semibold mb-2">Đang tải câu trả lời...</h3>
          </CardContent>
        </Card>
      ) : filteredAnswers.length === 0 ? (
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
            <Card key={answer.id || answer._id} className="hover:shadow-md transition-shadow">
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
                      <span>Câu hỏi của {answer.questionAuthor || 'Unknown'}</span>
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

