'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Trophy, Users, Calendar, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format, formatDistanceToNow } from 'date-fns';
import { vi as viLocale } from 'date-fns/locale';
import { vi } from '@/lib/i18n/vi';

export default function CompetitionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (subjectFilter !== 'all') params.append('subject', subjectFilter);
        if (statusFilter !== 'all') params.append('status', statusFilter);
        if (difficultyFilter !== 'all') params.append('difficulty', difficultyFilter);

        const [compRes, statsRes] = await Promise.all([
          fetch(`/api/competitions?${params.toString()}`),
          fetch('/api/competitions/stats'),
        ]);

        const compData = await compRes.json();
        const statsData = await statsRes.json();

        if (compData.success) setCompetitions(compData.data);
        if (statsData.success) setStats(statsData.data);
      } catch (error) {
        console.error('Failed to fetch competitions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, [searchQuery, subjectFilter, statusFilter, difficultyFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500/10 text-blue-500';
      case 'ongoing': return 'bg-green-500/10 text-green-500';
      case 'completed': return 'bg-gray-500/10 text-gray-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Sắp diễn ra';
      case 'ongoing': return 'Đang diễn ra';
      case 'completed': return 'Đã kết thúc';
      default: return status;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/10 text-green-500';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-500';
      case 'advanced': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Cơ bản';
      case 'intermediate': return 'Trung bình';
      case 'advanced': return 'Nâng cao';
      default: return difficulty;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Cuộc thi</h1>
        <p className="text-muted-foreground mt-2">Cạnh tranh, học hỏi và giành giải thưởng</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng số cuộc thi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalCompetitions || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Sắp diễn ra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">{stats?.upcomingCompetitions || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Đang diễn ra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{stats?.ongoingCompetitions || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng thí sinh</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalParticipants || 0}</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm cuộc thi..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả môn học" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả môn học</SelectItem>
                    <SelectItem value="Khoa học máy tính">Khoa học máy tính</SelectItem>
                    <SelectItem value="Toán học">Toán học</SelectItem>
                    <SelectItem value="Vật lý">Vật lý</SelectItem>
                    <SelectItem value="Hóa học">Hóa học</SelectItem>
                    <SelectItem value="Ngoại ngữ">Ngoại ngữ</SelectItem>
                    <SelectItem value="Kinh doanh">Kinh doanh</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Thiết kế">Thiết kế</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
                    <SelectItem value="ongoing">Đang diễn ra</SelectItem>
                    <SelectItem value="completed">Đã kết thúc</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả cấp độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả cấp độ</SelectItem>
                    <SelectItem value="beginner">Cơ bản</SelectItem>
                    <SelectItem value="intermediate">Trung bình</SelectItem>
                    <SelectItem value="advanced">Nâng cao</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Competitions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Không tìm thấy cuộc thi</h3>
                  <p className="text-muted-foreground">
                    Thử điều chỉnh bộ lọc tìm kiếm
                  </p>
                </CardContent>
              </Card>
            ) : (
              competitions.map((competition) => (
                <Link key={competition.id} href={`/competitions/${competition.id}`}>
                  <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full overflow-hidden">
                    <div className="relative h-40">
                      <Image
                        src={competition.banner}
                        alt={competition.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Badge className={getStatusColor(competition.status)}>
                          {getStatusLabel(competition.status)}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg line-clamp-2">{competition.title}</CardTitle>
                        <Trophy className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                      </div>
                      <CardDescription className="line-clamp-2 mt-2">
                        {competition.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{competition.subject}</Badge>
                        <Badge className={getDifficultyColor(competition.difficulty)}>
                          {getDifficultyLabel(competition.difficulty)}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Trophy className="h-4 w-4" />
                          <span className="font-medium text-foreground">{competition.prize}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(competition.startDate), 'dd/MM/yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{competition.participantCount} thí sinh</span>
                        </div>
                        {competition.status === 'upcoming' && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                              Đăng ký đóng {formatDistanceToNow(new Date(competition.registrationDeadline), { addSuffix: true, locale: viLocale })}
                            </span>
                          </div>
                        )}
                      </div>

                      <Button className="w-full" size="sm">
                        {competition.status === 'upcoming' ? 'Đăng ký ngay' :
                         competition.status === 'ongoing' ? 'Xem chi tiết' :
                         'Xem kết quả'}
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

