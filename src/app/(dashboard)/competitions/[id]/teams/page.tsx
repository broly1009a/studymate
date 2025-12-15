'use client';

import { use, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Users, Search, Trophy, UserPlus, Crown } from 'lucide-react';
import Link from 'next/link';
import { vi } from '@/lib/i18n/vi';

// Mock teams data
const mockTeams = [
  {
    id: '1',
    name: 'Code Warriors',
    members: [
      { id: '1', name: 'Alex Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', role: 'leader' },
      { id: '2', name: 'Sarah Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', role: 'member' },
      { id: '3', name: 'Mike Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', role: 'member' },
    ],
    score: 2850,
    rank: 1,
    university: 'MIT',
    status: 'active' as const,
  },
  {
    id: '2',
    name: 'Algorithm Masters',
    members: [
      { id: '4', name: 'Emma Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', role: 'leader' },
      { id: '5', name: 'James Brown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', role: 'member' },
      { id: '6', name: 'Lisa Wang', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa', role: 'member' },
    ],
    score: 2720,
    rank: 2,
    university: 'Stanford',
    status: 'active' as const,
  },
  {
    id: '3',
    name: 'Binary Beasts',
    members: [
      { id: '7', name: 'David Kim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', role: 'leader' },
      { id: '8', name: 'Sophie Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie', role: 'member' },
    ],
    score: 2650,
    rank: 3,
    university: 'Berkeley',
    status: 'active' as const,
  },
  {
    id: '4',
    name: 'Debug Dragons',
    members: [
      { id: '9', name: 'Tom Anderson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom', role: 'leader' },
      { id: '10', name: 'Anna Martinez', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna', role: 'member' },
      { id: '11', name: 'Chris Taylor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris', role: 'member' },
    ],
    score: 2580,
    rank: 4,
    university: 'Harvard',
    status: 'active' as const,
  },
  {
    id: '5',
    name: 'Syntax Squad',
    members: [
      { id: '12', name: 'Rachel Green', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel', role: 'leader' },
    ],
    score: 2420,
    rank: 5,
    university: 'Princeton',
    status: 'recruiting' as const,
  },
];

export default function CompetitionTeamsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredTeams = mockTeams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         team.university.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || team.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalTeams: mockTeams.length,
    activeTeams: mockTeams.filter(t => t.status === 'active').length,
    recruitingTeams: mockTeams.filter(t => t.status === 'recruiting').length,
    totalParticipants: mockTeams.reduce((sum, t) => sum + t.members.length, 0),
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
          <p className="text-muted-foreground">ACM ICPC Programming Contest 2025</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Tạo đội mới
        </Button>
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
            <Card key={team.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    {/* Rank Badge */}
                    <div className="flex flex-col items-center">
                      {team.rank <= 3 ? (
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
                          <span className="text-lg font-bold">#{team.rank}</span>
                        </div>
                      )}
                    </div>

                    {/* Team Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold">{team.name}</h3>
                        {team.status === 'recruiting' && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                            Đang tuyển
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{team.university}</p>

                      {/* Members */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex -space-x-2">
                          {team.members.map((member) => (
                            <Avatar key={member.id} className="border-2 border-background">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {team.members.length} thành viên
                        </span>
                      </div>

                      {/* Member Names */}
                      <div className="flex flex-wrap gap-2">
                        {team.members.map((member) => (
                          <div key={member.id} className="flex items-center gap-1 text-sm">
                            <span>{member.name}</span>
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
                    <div className="text-2xl font-bold text-primary">{team.score}</div>
                    <div className="text-sm text-muted-foreground">điểm</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    Xem chi tiết
                  </Button>
                  {team.status === 'recruiting' && (
                    <Button size="sm">
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

