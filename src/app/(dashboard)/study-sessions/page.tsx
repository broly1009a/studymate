'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Play, Clock, TrendingUp, Target, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from '@/lib/i18n/vi';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Session {
  _id: string;
  topic: string;
  subjectName: string;
  subjectId: string;
  duration: number;
  focusScore: number;
  pomodoroCount: number;
  startTime: string;
}

interface SessionStats {
  totalSessions: number;
  totalHours: number;
  averageFocusScore: number;
  totalPomodoros: number;
}

export default function StudySessionsPage() {
  const { user } = useAuth();
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<SessionStats>({
    totalSessions: 0,
    totalHours: 0,
    averageFocusScore: 0,
    totalPomodoros: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch subjects
        const subjectsRes = await fetch(`/api/subjects?userId=${user.id}`);
        if (subjectsRes.ok) {
          const subjectsData = await subjectsRes.json();
          setSubjects(subjectsData.data || []);
        }

        // Fetch sessions
        const subjectQuery = subjectFilter !== 'all' ? `&subjectId=${subjectFilter}` : '';
        const sessionsRes = await fetch(`/api/study-records?userId=${user.id}${subjectQuery}`);
        if (sessionsRes.ok) {
          const sessionsData = await sessionsRes.json();
          setSessions(sessionsData.data || []);
        }

        // Fetch stats
        const statsRes = await fetch(`/api/study-records/stats?userId=${user.id}`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (error: any) {
        toast.error('Failed to load sessions');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id, subjectFilter]);

  const filteredSessions = sessions.filter((session) =>
    (session.topic || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (session.subjectName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Study Sessions</h1>
          <p className="text-muted-foreground mt-2">Track and manage your study sessions</p>
        </div>
        <Link href="/study-sessions/active">
          <Button size="lg">
            <Play className="h-4 w-4 mr-2" />
            Start Session
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}h</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Focus Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageFocusScore}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pomodoros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPomodoros}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.icon} {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
          <CardDescription>Your study session history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sessions found</p>
              </div>
            ) : (
              filteredSessions.map((session) => {
                const subject = subjects.find((s) => s.id === session.subjectId);
                return (
                  <Link
                    key={session._id}
                    href={`/study-sessions/${session._id}`}
                    className="block"
                  >
                    <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: subject?.color + '20' }}
                      >
                        {subject?.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{session.topic}</h3>
                          <Badge variant="outline" className="text-xs">
                            {session.subjectName}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.duration} min
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {session.focusScore}% focus
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {session.pomodoroCount} pomodoros
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div>{format(new Date(session.startTime), 'MMM d, yyyy')}</div>
                        <div>{format(new Date(session.startTime), 'h:mm a')}</div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Link href="/study-sessions/history">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">Session History</CardTitle>
              <CardDescription>View detailed history and analytics</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/subjects">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">Manage Subjects</CardTitle>
              <CardDescription>Add or edit your study subjects</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/goals">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">Study Goals</CardTitle>
              <CardDescription>Set and track your study goals</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}

