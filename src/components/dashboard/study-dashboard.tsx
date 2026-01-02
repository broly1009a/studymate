'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Flame, 
  TrendingUp, 
  Award, 
  Clock, 
  Target,
  Calendar,
  Trophy,
  Star
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

interface DashboardStats {
  streak: {
    current: number;
    longest: number;
    lastStudyDate: string | null;
    isAtRisk: boolean;
    status: 'active' | 'at_risk' | 'broken';
  };
  reputation: {
    total: number;
    rank: {
      current: string;
      next: string;
      progress: number;
      pointsToNext: number;
    };
    recentActivity: {
      earned: number;
      lost: number;
      net: number;
    };
    leaderboardPosition: number;
  };
  studyStats: {
    totalSessions: number;
    totalHours: number;
    averageFocusScore: number;
    totalPomodoros: number;
    thisWeek: {
      sessions: number;
      hours: number;
    };
  };
}

export default function StudyDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetchDashboardStats();
  }, [user?.id]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch all stats in parallel
      const [streakRes, reputationRes, studyStatsRes] = await Promise.all([
        fetch(`/api/study-streak?userId=${user?.id}`),
        fetch(`/api/reputation/stats?userId=${user?.id}`),
        fetch(`/api/study-records/stats?userId=${user?.id}`)
      ]);

      const [streakData, reputationData, studyStatsData] = await Promise.all([
        streakRes.json(),
        reputationRes.json(),
        studyStatsRes.json()
      ]);

      if (streakData.success && reputationData.success && studyStatsData.success) {
        setStats({
          streak: streakData.data,
          reputation: reputationData.data,
          studyStats: studyStatsData.data
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-24 bg-muted"></CardHeader>
            <CardContent className="h-32 bg-muted/50"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return <div>No stats available</div>;
  }

  const getStreakColor = () => {
    if (stats.streak.status === 'active') return 'text-orange-600';
    if (stats.streak.status === 'at_risk') return 'text-yellow-600';
    return 'text-gray-400';
  };

  const getRankColor = (rank: string) => {
    const colors: Record<string, string> = {
      Legend: 'text-purple-600',
      Master: 'text-red-600',
      Expert: 'text-blue-600',
      Advanced: 'text-green-600',
      Intermediate: 'text-yellow-600',
      Beginner: 'text-gray-600',
      Novice: 'text-gray-400'
    };
    return colors[rank] || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Study Streak */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Flame className={`h-5 w-5 ${getStreakColor()}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.streak.current} days</div>
            <p className="text-xs text-muted-foreground mt-1">
              Best: {stats.streak.longest} days
            </p>
            {stats.streak.isAtRisk && (
              <Badge variant="destructive" className="mt-2">
                At Risk! Study today
              </Badge>
            )}
            {stats.streak.status === 'active' && (
              <Badge variant="default" className="mt-2">
                🔥 On Fire!
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Reputation */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reputation</CardTitle>
            <Award className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.reputation.total}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getRankColor(stats.reputation.rank.current)}>
                {stats.reputation.rank.current}
              </Badge>
              <span className="text-xs text-muted-foreground">
                #{stats.reputation.leaderboardPosition}
              </span>
            </div>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">To {stats.reputation.rank.next}</span>
                <span className="font-medium">{stats.reputation.rank.pointsToNext} pts</span>
              </div>
              <Progress value={stats.reputation.rank.progress * 100} className="h-1" />
            </div>
          </CardContent>
        </Card>

        {/* Total Study Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
            <Clock className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(stats.studyStats.totalHours)}h
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.studyStats.totalSessions} sessions completed
            </p>
            <div className="mt-2 text-xs">
              <span className="text-green-600 font-medium">
                +{Math.round(stats.studyStats.thisWeek.hours)}h
              </span>
              <span className="text-muted-foreground"> this week</span>
            </div>
          </CardContent>
        </Card>

        {/* Focus Score */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Focus Score</CardTitle>
            <Target className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(stats.studyStats.averageFocusScore)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.studyStats.totalPomodoros} pomodoros completed
            </p>
            <Progress 
              value={stats.studyStats.averageFocusScore} 
              className="h-1 mt-3" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Achievements */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Reputation Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity (30 days)
            </CardTitle>
            <CardDescription>Your reputation changes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  Points Earned
                </p>
                <p className="text-xs text-muted-foreground">
                  {stats.reputation.recentActivity.earned > 0 ? 
                    `${stats.reputation.recentActivity.earned} from various activities` : 
                    'No points earned yet'}
                </p>
              </div>
              <div className="text-2xl font-bold text-green-600">
                +{stats.reputation.recentActivity.earned}
              </div>
            </div>

            {stats.reputation.recentActivity.lost > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">
                    Points Lost
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Penalties and deductions
                  </p>
                </div>
                <div className="text-2xl font-bold text-red-600">
                  -{stats.reputation.recentActivity.lost}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  Net Change
                </p>
                <p className="text-xs text-muted-foreground">
                  Overall progress
                </p>
              </div>
              <div className={`text-2xl font-bold ${
                stats.reputation.recentActivity.net >= 0 ? 'text-blue-600' : 'text-red-600'
              }`}>
                {stats.reputation.recentActivity.net >= 0 ? '+' : ''}
                {stats.reputation.recentActivity.net}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Milestones & Goals
            </CardTitle>
            <CardDescription>Your achievements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Streak Milestone */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Next Streak Milestone</span>
                <Badge variant="outline">
                  {stats.streak.current < 3 ? '3 days' :
                   stats.streak.current < 7 ? '7 days' :
                   stats.streak.current < 14 ? '14 days' :
                   stats.streak.current < 30 ? '30 days' :
                   stats.streak.current < 60 ? '60 days' :
                   '90 days'}
                </Badge>
              </div>
              <Progress 
                value={
                  stats.streak.current < 3 ? (stats.streak.current / 3) * 100 :
                  stats.streak.current < 7 ? (stats.streak.current / 7) * 100 :
                  stats.streak.current < 14 ? (stats.streak.current / 14) * 100 :
                  stats.streak.current < 30 ? (stats.streak.current / 30) * 100 :
                  stats.streak.current < 60 ? (stats.streak.current / 60) * 100 :
                  (stats.streak.current / 90) * 100
                }
                className="h-2"
              />
            </div>

            {/* Study Time Goal */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Weekly Study Goal</span>
                <Badge variant="outline">10 hours</Badge>
              </div>
              <Progress 
                value={(stats.studyStats.thisWeek.hours / 10) * 100} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {Math.round(stats.studyStats.thisWeek.hours)}/10 hours completed
              </p>
            </div>

            {/* Session Goal */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Weekly Sessions</span>
                <Badge variant="outline">7 sessions</Badge>
              </div>
              <Progress 
                value={(stats.studyStats.thisWeek.sessions / 7) * 100} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {stats.studyStats.thisWeek.sessions}/7 sessions completed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
