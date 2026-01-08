'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TinderEvents } from '@/components/dashboard/tinder-events';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Calendar, Trophy, Users, Heart, Clock, Target, MessageSquare, Flame, Timer, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { vi } from '@/lib/i18n/vi';
import { StudyStreakCard } from '@/components/dashboard/study-streak-card';
import { QuickStats } from '@/components/dashboard/quick-stats';
import { TodaySchedule } from '@/components/dashboard/today-schedule';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { StudyGoalsProgress } from '@/components/dashboard/study-goals-progress';
import type { DashboardData } from '@/types/dashboard';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function HomePage() {
  const { user, isLoading: authLoading } = useAuth();
  const userId = user?.id;
  
  const [events, setEvents] = useState<any[]>([]);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [goals, setGoals] = useState<any[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [quickStats, setQuickStats] = useState({
    todayStudyTime: 0,
    weeklyStudyTime: 0,
    questionsAnswered: 0,
    upcomingDeadlines: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadedItems, setLoadedItems] = useState({
    schedule: false,
    activities: false,
    events: false,
    streak: false,
    goals: false,
    stats: false,
  });

  // Check if all items are loaded
  useEffect(() => {
    const allLoaded = Object.values(loadedItems).every(loaded => loaded);
    if (allLoaded) {
      setLoading(false);
    }
  }, [loadedItems]);

  // Fetch today's schedule
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/dashboard-data/today-schedule?userId=${userId}`);
        const result = await response.json();
        if (result.success) {
          setTodaySchedule(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch schedule:', error);
      } finally {
        setLoadedItems(prev => ({ ...prev, schedule: true }));
      }
    };

    fetchSchedule();
  }, [userId]);

  // Fetch recent activities
  useEffect(() => {
    const fetchActivities = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/activities?userId=${userId}&limit=3`);
        const result = await response.json();
        setRecentActivities(result.data || []);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setLoadedItems(prev => ({ ...prev, activities: true }));
      }
    };

    fetchActivities();
  }, [userId]);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events?limit=6&sortBy=date&order=asc');
        const result = await response.json();
        if (result.success) {
          setEvents(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoadedItems(prev => ({ ...prev, events: true }));
      }
    };

    fetchEvents();
  }, []);

  // Fetch study streak
  useEffect(() => {
    const fetchStreak = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/study-streak?userId=${userId}`);
        const result = await response.json();
        if (result.success) {
          setStreak(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch streak:', error);
      } finally {
        setLoadedItems(prev => ({ ...prev, streak: true }));
      }
    };

    fetchStreak();
  }, [userId]);

  // Fetch goals
  useEffect(() => {
    const fetchGoals = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/goals?userId=${userId}&status=active&limit=2`);
        const result = await response.json();
        setGoals(result.data || []);
      } catch (error) {
        console.error('Failed to fetch goals:', error);
      } finally {
        setLoadedItems(prev => ({ ...prev, goals: true }));
      }
    };

    fetchGoals();
  }, [userId]);

  // Fetch quick stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/dashboard-data/stats?userId=${userId}`);
        const result = await response.json();
        if (result.success) {
          setQuickStats(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoadedItems(prev => ({ ...prev, stats: true }));
      }
    };

    fetchStats();
  }, [userId]);

  const stats = {
    totalEvents: events.length,
    studySessions: events.filter((e) => e.type === 'study-session').length,
    workshops: events.filter((e) => e.type === 'workshop').length,
    meetings: events.filter((e) => e.type === 'group-meeting').length,
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a7c1] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Welcome */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Chào mừng trở lại,{' '}
          <span className="text-[#6059f7]">{user.fullName || user.username}</span>! 👋
        </h1>
        <p className="text-muted-foreground">
          Khám phá sự kiện mới và theo dõi hoạt động học tập của bạn
        </p>
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN - Stats (Vertical) */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="h-8 w-8 animate-spin text-[#6059f7]" />
            </div>
          ) : (
            <>
              {/* Study Streak */}
              <div className="bg-white rounded-lg p-4 border shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-lg">🔥</span>
                  </div>
                  <div className="text-sm font-medium text-gray-700">Chuỗi ngày học</div>
                </div>
                <div className="text-3xl font-bold text-orange-500">{streak.current}</div>
                <p className="text-xs text-gray-500 mt-1">ngày liên tiếp</p>
              </div>

              {/* Today Study Time */}
              <div className="bg-white rounded-lg p-4 border shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-lg">⏱️</span>
                  </div>
                  <div className="text-sm font-medium text-gray-700">Thời gian học hôm nay</div>
                </div>
                <div className="text-3xl font-bold text-blue-500">{quickStats.todayStudyTime}</div>
                <p className="text-xs text-gray-500 mt-1">phút</p>
              </div>

              {/* Weekly Study Time */}
              <div className="bg-white rounded-lg p-4 border shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-lg">🕐</span>
                  </div>
                  <div className="text-sm font-medium text-gray-700">Thời gian học tuần này</div>
                </div>
                <div className="text-3xl font-bold text-green-500">{(quickStats.weeklyStudyTime / 60).toFixed(1)}</div>
                <p className="text-xs text-gray-500 mt-1">giờ</p>
              </div>

              {/* Questions Answered */}
              <div className="bg-white rounded-lg p-4 border shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-lg">✅</span>
                  </div>
                  <div className="text-sm font-medium text-gray-700">Câu hỏi đã trả lời</div>
                </div>
                <div className="text-3xl font-bold text-purple-500">{quickStats.questionsAnswered}</div>
                <p className="text-xs text-gray-500 mt-1">câu hỏi</p>
              </div>

              {/* Upcoming Deadlines */}
              <div className="bg-white rounded-lg p-4 border shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-lg">⚠️</span>
                  </div>
                  <div className="text-sm font-medium text-gray-700">Deadline sắp tới</div>
                </div>
                <div className="text-3xl font-bold text-red-500">{quickStats.upcomingDeadlines}</div>
                <p className="text-xs text-gray-500 mt-1">mục cần hoàn thành</p>
              </div>
            </>
          )}
        </div>

        {/* MIDDLE COLUMN - Events */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-[#6059f7] to-[#4f47d9] border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Hành động nhanh</CardTitle>
              <CardDescription className="text-white/90 text-base">
                Khám phá và kết nối với cộng đồng học tập
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/matches/suggestions">
                <Button
                  variant="outline"
                  className="w-full h-24 flex-col gap-2 bg-white hover:bg-gray-50 border-2 border-white/20 shadow-md hover:shadow-xl transition-all hover:scale-105"
                >
                  <Heart className="h-8 w-8 text-[#6059f7]" />
                  <span className="font-semibold text-base">Tìm bạn học</span>
                </Button>
              </Link>
              <Link href="/competitions">
                <Button
                  variant="outline"
                  className="w-full h-24 flex-col gap-2 bg-white hover:bg-gray-50 border-2 border-white/20 shadow-md hover:shadow-xl transition-all hover:scale-105"
                >
                  <Trophy className="h-8 w-8 text-orange-500" />
                  <span className="font-semibold text-base">Cuộc thi</span>
                </Button>
              </Link>
              <Link href="/calendar">
                <Button
                  variant="outline"
                  className="w-full h-24 flex-col gap-2 bg-white hover:bg-gray-50 border-2 border-white/20 shadow-md hover:shadow-xl transition-all hover:scale-105"
                >
                  <Calendar className="h-8 w-8 text-blue-500" />
                  <span className="font-semibold text-base">Lịch</span>
                </Button>
              </Link>
              <Link href="/groups">
                <Button
                  variant="outline"
                  className="w-full h-24 flex-col gap-2 bg-white hover:bg-gray-50 border-2 border-white/20 shadow-md hover:shadow-xl transition-all hover:scale-105"
                >
                  <Users className="h-8 w-8 text-purple-500" />
                  <span className="font-semibold text-base">Nhóm</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Main Event Cards - Tinder Style */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sự kiện mới</CardTitle>
              <CardDescription className="text-base">
                Vuốt sang phải để quan tâm, vuốt sang trái để bỏ qua
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <Loader2 className="h-8 w-8 animate-spin text-[#6059f7]" />
                </div>
              ) : events.length > 0 ? (
                <TinderEvents events={events} />
              ) : (
                <div className="flex items-center justify-center h-96 text-gray-500">
                  <p>Không có sự kiện nào. Kiểm tra lại sau!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN - Today's Schedule & Recent Activity */}
        <div className="lg:col-span-3 space-y-4">
          {/* Today's Schedule */}
          <TodaySchedule schedule={todaySchedule} />

          {/* Recent Activity */}
          <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </div>
  );
}

