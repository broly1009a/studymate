'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Users, Search, Trophy, UserPlus, Crown, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';

export default function CompetitionTeamsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [competition, setCompetition] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchTeamsData = async () => {
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
        console.error('Failed to fetch teams:', error);
        toast.error('Failed to load teams');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'recruiting' && team.lookingForMembers) ||
                         (filterStatus === 'active' && team.status === 'active');
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalTeams: teams.length,
    activeTeams: teams.filter(t => t.status === 'active').length,
    recruitingTeams: teams.filter(t => t.lookingForMembers).length,
    totalParticipants: teams.reduce((sum, t) => sum + (t.members?.length || 0), 0),
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href={`/competitions/${id}`}>
            <Button variant="ghost" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {vi.common.back}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Danh sách đội thi</h1>
          <p className="text-muted-foreground">{competition?.title || 'Cuộc thi'}</p>
        </div>
        <Link href={`/competitions/${id}/teams/new`}>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Tạo đội mới
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng số đội
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeams}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đội đang thi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeTeams}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đang tuyển thành viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.recruitingTeams}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng thành viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalParticipants}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm đội hoặc trường..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả ({stats.totalTeams})</SelectItem>
                <SelectItem value="active">Đang thi ({stats.activeTeams})</SelectItem>
                <SelectItem value="recruiting">Tuyển thành viên ({stats.recruitingTeams})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Teams List */}
      {filteredTeams.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Không tìm thấy đội</h3>
            <p className="text-muted-foreground">
              Thử thay đổi bộ lọc hoặc tìm kiếm
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTeams.map((team) => (
            <Card key={team._id || team.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    {/* Rank Badge */}
                    <div className="flex flex-col items-center">
                      {team.rank && team.rank <= 3 ? (
                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center
                          ${team.rank === 1 ? 'bg-yellow-100 text-yellow-700' : ''}
                          ${team.rank === 2 ? 'bg-gray-100 text-gray-700' : ''}
                          ${team.rank === 3 ? 'bg-orange-100 text-orange-700' : ''}
                        `}>
                          <Trophy className="h-6 w-6" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-lg font-bold">#{team.rank || '-'}</span>
                        </div>
                      )}
                    </div>

                    {/* Team Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold">{team.name}</h3>
                        {team.lookingForMembers && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                            Đang tuyển
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{team.university || 'Chưa cập nhật'}</p>

                      {/* Members */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex -space-x-2">
                          {team.members?.map((member: any) => (
                            <Avatar key={member.userId || member._id} className="border-2 border-background">
                              <AvatarImage src={member.userAvatar || member.avatar} alt={member.userName || member.name} />
                              <AvatarFallback>{(member.userName || member.name || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {team.members?.length || 0} thành viên
                        </span>
                      </div>

                      {/* Member Names */}
                      <div className="flex flex-wrap gap-2">
                        {team.members?.map((member: any) => (
                          <div key={member.userId || member._id} className="flex items-center gap-1 text-sm">
                            <span>{member.userName || member.name || 'Unknown'}</span>
                            {member.role === 'leader' && (
                              <Crown className="h-3 w-3 text-yellow-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{team.score || 0}</div>
                    <div className="text-sm text-muted-foreground">điểm</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t">
                  <Link href={`/teams/${team._id}`}>
                    <Button variant="outline" size="sm">
                      Xem chi tiết
                    </Button>
                  </Link>
                  {team.lookingForMembers && (
                    <Button size="sm" onClick={() => toast.info('Tính năng đang phát triển')}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Tham gia đội
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

