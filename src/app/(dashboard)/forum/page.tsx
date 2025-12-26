'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, MessageSquare, Eye, TrendingUp, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { vi as viLocale } from 'date-fns/locale';
import { vi } from '@/lib/i18n/vi';
import { toast } from 'sonner';
import { API_URL } from '@/lib/constants';
interface Question {
  _id: string;
  id?: string;
  title: string;
  content: string;
  subject: string;
  tags: string[];
  votes: number;
  answersCount: number;
  views: number;
  hasAcceptedAnswer: boolean;
  createdAt: string;
  authorId?: any;
  authorName?: string;
  authorAvatar?: string;
  authorReputation?: number;
}

interface ForumStats {
  totalQuestions: number;
  openQuestions: number;
  answeredQuestions: number;
  totalViews: number;
}

interface PopularTag {
  tag: string;
  count: number;
}

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState<ForumStats>({
    totalQuestions: 0,
    openQuestions: 0,
    answeredQuestions: 0,
    totalViews: 0,
  });
  const [popularTags, setPopularTags] = useState<PopularTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (subjectFilter !== 'all') {
          params.append('subject', subjectFilter);
        }
        if (statusFilter !== 'all') {
          params.append('status', statusFilter);
        }
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        params.append('limit', '50');

        const [questionsRes, statsRes, tagsRes] = await Promise.all([
          fetch(`${API_URL}/forum-questions?${params}`),
          fetch(`${API_URL}/forum-questions/stats`),
          fetch(`${API_URL}/forum-questions/popular-tags`),
        ]);

        if (questionsRes.ok) {
          const questionsData = await questionsRes.json();
          const formattedQuestions = questionsData.data.map((q: any) => ({
            ...q,
            id: q._id,
            authorName: q.authorId?.username || 'Anonymous',
            authorAvatar: q.authorId?.avatar || '/default-avatar.png',
            authorReputation: q.authorId?.reputation || 0,
            answersCount: q.answers?.length || 0,
            views: q.views || 0,
            votes: q.upvotes || 0,
            hasAcceptedAnswer: q.acceptedAnswerId ? true : false,
          }));
          setQuestions(formattedQuestions);
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.data);
        }

        if (tagsRes.ok) {
          const tagsData = await tagsRes.json();
          setPopularTags(tagsData.data || []);
        }
      } catch (error: any) {
        toast.error('Không thể tải dữ liệu diễn đàn');
        console.error('Error fetching forum data:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, subjectFilter, statusFilter]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{vi.forum.title}</h1>
          <p className="text-muted-foreground mt-2">{vi.forum.subtitle}</p>
        </div>
        <Link href="/forum/ask">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            {vi.forum.askQuestion}
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng câu hỏi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuestions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang mở</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.openQuestions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã trả lời</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.answeredQuestions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng lượt xem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm câu hỏi..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger suppressHydrationWarning>
                    <SelectValue placeholder="Tất cả môn học" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả môn học</SelectItem>
                    <SelectItem value="Toán học">Toán học</SelectItem>
                    <SelectItem value="Khoa học máy tính">Khoa học máy tính</SelectItem>
                    <SelectItem value="Vật lý">Vật lý</SelectItem>
                    <SelectItem value="Hóa học">Hóa học</SelectItem>
                    <SelectItem value="Sinh học">Sinh học</SelectItem>
                    <SelectItem value="Ngoại ngữ">Ngoại ngữ</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Thiết kế">Thiết kế</SelectItem>
                    <SelectItem value="Kinh doanh">Kinh doanh</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger suppressHydrationWarning>
                    <SelectValue placeholder="Tất cả trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="open">Đang mở</SelectItem>
                    <SelectItem value="answered">Đã trả lời</SelectItem>
                    <SelectItem value="closed">Đã đóng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Questions List */}
          <div className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Loader2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50 animate-spin" />
                  <h3 className="text-lg font-semibold mb-2">Đang tải câu hỏi...</h3>
                </CardContent>
              </Card>
            ) : questions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Không tìm thấy câu hỏi</h3>
                  <p className="text-muted-foreground mb-4">
                    Thử điều chỉnh bộ lọc tìm kiếm hoặc hãy là người đầu tiên đặt câu hỏi!
                  </p>
                  <Link href="/forum/ask">
                    <Button>Đặt câu hỏi</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              questions.map((question) => (
                <Link key={question.id || question._id} href={`/forum/${question.id || question._id}`}>
                  <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Image
                          src={question.authorAvatar || '/default-avatar.png'}
                          alt={question.authorName || 'Anonymous'}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-lg hover:text-primary">
                              {question.title}
                            </CardTitle>
                            {question.hasAcceptedAnswer && (
                              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                          <CardDescription className="mt-2 line-clamp-2">
                            {question.content}
                          </CardDescription>
                          <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                            <span className="font-medium">{question.authorName || 'Anonymous'}</span>
                            <span>•</span>
                            <span>{question.authorReputation || 0} uy tín</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true, locale: viLocale })}</span>
                          </div>
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
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Popular Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thẻ phổ biến</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(({ tag, count }) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    {tag} ({count})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mẹo đặt câu hỏi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p>Hãy cụ thể và rõ ràng trong câu hỏi của bạn</p>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p>Bao gồm ngữ cảnh liên quan và những gì bạn đã thử</p>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p>Sử dụng thẻ phù hợp để tăng khả năng hiển thị</p>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p>Chấp nhận câu trả lời hữu ích để giúp người khác</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

