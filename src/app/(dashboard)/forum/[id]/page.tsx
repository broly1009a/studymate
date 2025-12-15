'use client';

import { use, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { getQuestionById, getAnswers, getComments } from '@/lib/mock-data/forum';
import { ArrowLeft, ThumbsUp, ThumbsDown, MessageSquare, Eye, CheckCircle2, Send } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { vi as viLocale } from 'date-fns/locale';
import { toast } from 'sonner';

export default function QuestionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const question = getQuestionById(id);
  const answers = question ? getAnswers(question.id) : [];
  const [answerContent, setAnswerContent] = useState('');

  if (!question) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Không tìm thấy câu hỏi</h1>
          <p className="text-muted-foreground mb-4">Câu hỏi bạn đang tìm không tồn tại.</p>
          <Link href="/forum">
            <Button>Quay lại diễn đàn</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmitAnswer = () => {
    if (!answerContent.trim()) {
      toast.error('Vui lòng viết câu trả lời');
      return;
    }
    toast.success('Đã đăng câu trả lời thành công!');
    setAnswerContent('');
  };

  const handleVote = (type: 'up' | 'down', targetType: 'question' | 'answer', targetId: string) => {
    toast.success(`Đã bình chọn ${type === 'up' ? 'tích cực' : 'tiêu cực'}`);
  };

  const handleAcceptAnswer = (answerId: string) => {
    toast.success('Đã chấp nhận câu trả lời!');
  };

  return (
    <div className="w-full">
      <Link href="/forum">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại diễn đàn
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Question */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote('up', 'question', question.id)}
                  >
                    <ThumbsUp className="h-5 w-5" />
                  </Button>
                  <span className="text-xl font-bold">{question.votes}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote('down', 'question', question.id)}
                  >
                    <ThumbsDown className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-2xl">{question.title}</CardTitle>
                    {question.hasAcceptedAnswer && (
                      <Badge className="bg-green-500/10 text-green-500">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Đã trả lời
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <span>Đã hỏi {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true, locale: viLocale })}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {question.views} lượt xem
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base whitespace-pre-wrap">{question.content}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{question.subject}</Badge>
                {question.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-4 border-t">
                <Image
                  src={question.authorAvatar}
                  alt={question.authorName}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <div className="font-medium">{question.authorName}</div>
                  <div className="text-sm text-muted-foreground">{question.authorReputation} uy tín</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Answers */}
          <Card>
            <CardHeader>
              <CardTitle>{answers.length} Câu trả lời</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {answers.map((answer) => (
                <div key={answer.id} className="border-b last:border-0 pb-6 last:pb-0">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote('up', 'answer', answer.id)}
                      >
                        <ThumbsUp className="h-5 w-5" />
                      </Button>
                      <span className="text-xl font-bold">{answer.votes}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote('down', 'answer', answer.id)}
                      >
                        <ThumbsDown className="h-5 w-5" />
                      </Button>
                      {answer.isAccepted && (
                        <CheckCircle2 className="h-6 w-6 text-green-500 mt-2" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-base whitespace-pre-wrap mb-4">{answer.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Image
                            src={answer.authorAvatar}
                            alt={answer.authorName}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <div>
                            <div className="font-medium text-sm">{answer.authorName}</div>
                            <div className="text-xs text-muted-foreground">
                              {answer.authorReputation} uy tín •{' '}
                              {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true, locale: viLocale })}
                            </div>
                          </div>
                        </div>
                        {!answer.isAccepted && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAcceptAnswer(answer.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Chấp nhận
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Answer Form */}
          <Card>
            <CardHeader>
              <CardTitle>Câu trả lời của bạn</CardTitle>
              <CardDescription>Giúp đỡ cộng đồng bằng cách chia sẻ kiến thức của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Viết câu trả lời của bạn ở đây..."
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                rows={8}
              />
              <Button onClick={handleSubmitAnswer}>
                <Send className="h-4 w-4 mr-2" />
                Đăng câu trả lời
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Question Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thống kê câu hỏi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Đã hỏi</div>
                <div className="font-medium">
                  {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true, locale: viLocale })}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Đã xem</div>
                <div className="font-medium">{question.views} lần</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Câu trả lời</div>
                <div className="font-medium">{question.answersCount}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Bình chọn</div>
                <div className="font-medium">{question.votes}</div>
              </div>
            </CardContent>
          </Card>

          {/* Related Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Câu hỏi liên quan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/forum/2" className="block text-sm hover:text-primary">
                Sự khác biệt giữa bộ nhớ stack và heap là gì?
              </Link>
              <Link href="/forum/4" className="block text-sm hover:text-primary">
                Giải thích Định luật III Newton với ví dụ thực tế
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

