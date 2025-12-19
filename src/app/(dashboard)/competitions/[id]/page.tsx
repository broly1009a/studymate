'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Trophy, Users, Calendar, Clock, UserPlus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';
import { vi as viLocale } from 'date-fns/locale';
import { vi } from '@/lib/i18n/vi';

export default function CompetitionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [competition, setCompetition] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchCompetitionData = async () => {
      try {
        setLoading(true);
        const [compRes, teamsRes] = await Promise.all([
          fetch(`/api/competitions/${id}`),
          fetch(`/api/competitions/${id}/teams`),
        ]);

        const compData = await compRes.json();
        const teamsData = await teamsRes.json();

        if (compData.success) setCompetition(compData.data);
        if (teamsData.success) setTeams(teamsData.data);
      } catch (error) {
        console.error('Failed to fetch competition data:', error);
        toast.error('Failed to load competition');
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitionData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Không tìm thấy cuộc thi</h1>
          <p className="text-muted-foreground mb-4">Cuộc thi bạn đang tìm không tồn tại.</p>
          <Link href="/competitions">
            <Button>Quay lại cuộc thi</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleRegister = async () => {
    try {
      setRegistering(true);
      const response = await fetch(`/api/competitions/${id}/register`, {
        method: 'POST',
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Đăng ký thành công!');
      } else {
        toast.error(data.message || 'Failed to register');
      }
    } catch (error) {
      console.error('Failed to register:', error);
      toast.error('Failed to register');
    } finally {
      setRegistering(false);
    }
  };

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
      <Link href="/competitions">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại cuộc thi
        </Button>
      </Link>

      {/* Header */}
      <div className="relative h-64 rounded-lg overflow-hidden mb-6">
        {competition.banner ? (
          <Image
            src={competition.banner}
            alt={competition.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="text-center text-white">
              <Trophy className="h-16 w-16 mx-auto mb-4 opacity-80" />
              <h2 className="text-2xl font-bold">{competition.title}</h2>
              <p className="text-lg opacity-90">{competition.organizer}</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{competition.title}</h1>
              <p className="text-white/90">{competition.organizer}</p>
            </div>
            <Badge className={getStatusColor(competition.status)}>
              {getStatusLabel(competition.status)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="rules">Luật lệ</TabsTrigger>
              <TabsTrigger value="teams">Đội nhóm</TabsTrigger>
              <TabsTrigger value="leaderboard">Bảng xếp hạng</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Về cuộc thi này</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{competition.description}</p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <div className="text-sm text-muted-foreground">Môn học</div>
                      <div className="font-medium">{competition.subject}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Độ khó</div>
                      <Badge variant="outline">{getDifficultyLabel(competition.difficulty)}</Badge>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Kích thước đội</div>
                      <div className="font-medium">
                        {competition.teamSize.min === competition.teamSize.max
                          ? `${competition.teamSize.min} thành viên`
                          : `${competition.teamSize.min}-${competition.teamSize.max} thành viên`}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Giải thưởng</div>
                      <div className="font-medium text-yellow-500">{competition.prize}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thời gian</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Hạn đăng ký</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(competition.registrationDeadline), 'dd/MM/yyyy • HH:mm', { locale: viLocale })}
                      </div>
                    </div>
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Ngày bắt đầu</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(competition.startDate), 'dd/MM/yyyy • HH:mm', { locale: viLocale })}
                      </div>
                    </div>
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Ngày kết thúc</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(competition.endDate), 'dd/MM/yyyy • HH:mm', { locale: viLocale })}
                      </div>
                    </div>
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rules">
              <Card>
                <CardHeader>
                  <CardTitle>Luật lệ cuộc thi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-medium">Điều kiện tham gia</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Mở cho tất cả sinh viên và chuyên gia</li>
                      <li>Kích thước đội: {competition.teamSize.min}-{competition.teamSize.max} thành viên</li>
                      <li>Phải đăng ký trước hạn chót</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Hướng dẫn nộp bài</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Tất cả bài nộp phải là công trình gốc</li>
                      <li>Tuân theo định dạng và yêu cầu được chỉ định</li>
                      <li>Nộp trước ngày kết thúc cuộc thi</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teams">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Đội nhóm ({teams.length})</CardTitle>
                    <Link href={`/competitions/${competition._id}/teams/new`}>
                      <Button size="sm">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Tạo đội
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {teams.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Chưa có đội nào. Hãy là người đầu tiên tạo đội!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {teams.map((team) => (
                        <Link key={team._id} href={`/teams/${team._id}`}>
                          <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium">{team.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{team.description}</p>
                                <div className="flex items-center gap-4 mt-3 text-sm">
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    {team.memberCount}/{team.maxMembers} thành viên
                                  </div>
                                  {team.lookingForMembers && (
                                    <Badge variant="secondary">Đang tìm thành viên</Badge>
                                  )}
                                </div>
                              </div>
                              <Button size="sm">Tham gia đội</Button>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leaderboard">
              <Card>
                <CardHeader>
                  <CardTitle>Bảng xếp hạng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    {competition.status === 'upcoming'
                      ? 'Bảng xếp hạng sẽ có sẵn khi cuộc thi bắt đầu'
                      : 'Chưa có bài nộp nào'}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Registration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Đăng ký</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {competition.status === 'upcoming' && (
                <>
                  <div className="text-sm text-muted-foreground">
                    Đăng ký đóng {formatDistanceToNow(new Date(competition.registrationDeadline), { addSuffix: true, locale: viLocale })}
                  </div>
                  <Button onClick={handleRegister} className="w-full" disabled={registering}>
                    {registering && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Đăng ký ngay
                  </Button>
                </>
              )}
              {competition.status === 'ongoing' && (
                <div className="text-sm text-muted-foreground">
                  Cuộc thi đang diễn ra. Đã đóng đăng ký.
                </div>
              )}
              {competition.status === 'completed' && (
                <Link href={`/competitions/${competition._id}/results`}>
                  <Button className="w-full">Xem kết quả</Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Thí sinh</div>
                <div className="text-2xl font-bold">{competition.participantCount}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Đội nhóm</div>
                <div className="text-2xl font-bold">{competition.teamCount}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Giải thưởng</div>
                <div className="text-lg font-bold text-yellow-500">{competition.prize}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

