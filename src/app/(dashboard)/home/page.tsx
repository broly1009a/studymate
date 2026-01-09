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

  // Mock schedule data
  const mockSchedule = [
    {
      id: 1,
      day: 3, // Thursday (Thứ 5)
      time: '07:00 - 10:00',
      timeStart: '7:00',
      title: 'Phiên học môn Marketing 12 dành cho người mới',
      participants: 36,
      color: 'yellow',
      type: 'Học tập'
    },
    {
      id: 2,
      day: 3,
      time: '10:30 - 12:30',
      timeStart: '10:30',
      title: 'Phiên học môn Marketing 12 dành cho người mới',
      participants: 36,
      color: 'yellow',
      type: 'Học tập'
    },
    {
      id: 3,
      day: 3,
      time: '12:30 - 13:30',
      timeStart: '12:30',
      title: 'Phiên học môn Marketing 12 dành',
      participants: 28,
      color: 'red',
      type: 'Thi đấu'
    },
    {
      id: 4,
      day: 1, // Tuesday (Thứ 3)
      time: '09:00 - 11:00',
      timeStart: '9:00',
      title: 'Toán cao cấp - Đại số tuyến tính',
      participants: 42,
      color: 'blue',
      type: 'Học tập'
    },
    {
      id: 5,
      day: 4, // Friday (Thứ 6)
      time: '14:00 - 16:00',
      timeStart: '14:00',
      title: 'Workshop lập trình Python',
      participants: 55,
      color: 'purple',
      type: 'Workshop'
    },
    {
      id: 6,
      day: 6, // Sunday (Chủ nhật)
      time: '08:00 - 12:00',
      timeStart: '8:00',
      title: 'Cuộc thi ACM ICPC 2025',
      participants: 120,
      color: 'orange',
      type: 'Cuộc thi'
    }
  ];

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getCurrentDate = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getCurrentDayOfWeek = () => {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const now = new Date();
    return days[now.getDay()];
  };

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
          let eventsToShow = result.data;
          
          // Filter out already viewed/interacted events if user is logged in
          if (userId) {
            try {
              const token = localStorage.getItem('token');
              if (token) {
                const interactionsRes = await fetch(
                  `/api/activity-interactions?activityType=event`,
                  {
                    headers: { 'Authorization': `Bearer ${token}` },
                  }
                );
                const interactionsData = await interactionsRes.json();
                
                if (interactionsData.success && interactionsData.data?.length) {
                  const viewedEventIds = interactionsData.data.map((i: any) => i.activityId);
                  eventsToShow = eventsToShow.filter(
                    (event: any) => !viewedEventIds.includes(event._id)
                  );
                }
              }
            } catch (error) {
              console.error('Failed to filter viewed events:', error);
              // Continue with all events if filtering fails
            }
          }
          
          setEvents(eventsToShow);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoadedItems(prev => ({ ...prev, events: true }));
      }
    };

    fetchEvents();
  }, [userId]);

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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-50 via-white to-purple-50 py-16 px-4 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 text-purple-300 opacity-30">
          <div className="w-32 h-32 border-2 border-dashed border-purple-300 rounded-lg"></div>
        </div>
        <div className="absolute bottom-10 left-10 text-purple-300 opacity-30">
          <div className="w-24 h-24 border-2 border-dashed border-purple-300 rounded-lg"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-gray-800">Bạn Học Chuẩn Gu</span>
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-[#6059f7] border-l-4 border-[#6059f7] pl-4">Học Gì Cũng Dễ</span>{' '}
            <span className="text-gray-800">Cùng STUDYMATE</span>
            <span className="text-yellow-400 ml-2">✨</span>
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Kết nối bạn học phù hợp, tạo nhóm học tập, chia sẻ tài liệu
            <br />
            và cùng nhau chinh phục các cuộc thi
          </p>
          <Link href="/matches/suggestions">
            <Button size="lg" className="bg-[#6059f7] hover:bg-[#4f47d9] text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
              Tìm bạn học ngay
              <Heart className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-gradient-to-r from-[#6059f7] to-[#7c3aed] py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-1">30+</div>
              <div className="text-sm md:text-base opacity-90">Nhãn sư chuyên nghiệp</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-1">60.000+</div>
              <div className="text-sm md:text-base opacity-90">Lượt truy cập mỗi tháng</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-1">3+</div>
              <div className="text-sm md:text-base opacity-90">Năm hoạt động</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-1">70+</div>
              <div className="text-sm md:text-base opacity-90">Đối tác chiến lược</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Events Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Sự Kiện Mới</h2>
            <Link href="/events">
              <Button variant="ghost" className="text-[#6059f7] hover:text-[#4f47d9]">
                Xem chi tiết
                <span className="ml-2">→</span>
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="h-8 w-8 animate-spin text-[#6059f7]" />
            </div>
          ) : events.length > 0 ? (
            <div className="relative">
              {/* Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {events.slice(0, 3).map((event) => (
                  <Card key={event._id} className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer border-2 border-transparent hover:border-[#6059f7]">
                    {/* Event Image/Gradient */}
                    <div className="h-48 bg-gradient-to-br from-purple-500 via-blue-500 to-purple-600 relative overflow-hidden">
                      {/* Date Badge */}
                      <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-2 shadow-md">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-[#6059f7]" />
                          <span className="font-semibold">
                            {new Date(event.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      {/* Decorative pattern */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full blur-xl"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white rounded-full blur-xl"></div>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                          Lập trình
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          Thuật toán
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Thi đấu
                        </span>
                      </div>

                      {/* Event Title */}
                      <h3 className="font-bold text-xl mb-2 text-gray-800 line-clamp-2 group-hover:text-[#6059f7] transition-colors">
                        {event.title}
                      </h3>

                      {/* Event Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {event.description || 'Cuộc thi lập trình quốc tế dành cho sinh viên. Đăng ký ngay để thể hiện kỹ năng của bạn!'}
                      </p>

                      {/* Participants */}
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Users className="h-4 w-4" />
                        <span>36 người tham gia</span>
                      </div>

                      {/* CTA Button */}
                      <Link href={`/events/${event._id}`}>
                        <Button className="w-full bg-[#6059f7] hover:bg-[#4f47d9] text-white rounded-lg group-hover:shadow-lg transition-all">
                          Tham gia ngay
                          <span className="ml-2">→</span>
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Carousel Navigation */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-gray-800 text-white border-gray-800 hover:bg-gray-700 hover:border-gray-700"
                >
                  <span className="text-xl">←</span>
                </Button>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-800"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-gray-800 text-white border-gray-800 hover:bg-gray-700 hover:border-gray-700"
                >
                  <span className="text-xl">→</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-500 bg-gray-50 rounded-lg">
              <p>Không có sự kiện nào. Kiểm tra lại sau!</p>
            </div>
          )}
        </div>

        {/* Calendar Section */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Lịch Hôm Nay</h2>
              <p className="text-gray-500 mt-1 font-medium">{getCurrentDayOfWeek()}, {getCurrentDate()}</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="bg-gray-800 text-white px-5 py-3 rounded-lg font-bold shadow-md text-lg">
                <Clock className="inline h-4 w-4 mr-2" />
                {getCurrentTime()}
              </div>
              <Link href="/calendar">
                <Button variant="ghost" className="text-[#6059f7] hover:text-[#4f47d9] hover:bg-purple-50 font-semibold">
                  Xem chi tiết
                  <span className="ml-2">→</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Calendar Widget */}
          <Card className="overflow-hidden shadow-xl border-2 hover:shadow-2xl transition-shadow">
            <CardContent className="p-0">
              {/* Week Days Header */}
              <div className="grid grid-cols-7 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2">
                {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].map((day, index) => (
                  <div key={day} className="text-center py-5 border-r last:border-r-0 hover:bg-white transition-colors">
                    <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">{day}</div>
                    <div className={`text-2xl font-bold transition-all ${
                      index === 3 
                        ? 'text-white bg-[#6059f7] rounded-xl mx-auto w-14 h-14 flex items-center justify-center shadow-lg transform scale-110' 
                        : 'text-gray-700 hover:text-[#6059f7] cursor-pointer'
                    }`}>
                      {21 + index}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Schedule */}
              <div className="p-6 bg-white">
                <div className="relative">
                  {/* Time slots container with grid layout */}
                  <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-0">
                    {/* Time labels column */}
                    <div className="border-r border-gray-200">
                      {/* Header spacer */}
                      <div className="h-20 border-b border-gray-200"></div>
                      
                      {/* Time slots */}
                      {['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map((time) => (
                        <div key={time} className="h-16 border-b border-gray-200 flex items-start justify-end pr-3 pt-1">
                          <span className="text-xs font-semibold text-gray-500">{time}</span>
                        </div>
                      ))}
                    </div>

                    {/* Day columns */}
                    {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
                      <div key={dayIndex} className="border-r last:border-r-0 border-gray-200">
                        {/* Day header with number */}
                        <div className="h-20 border-b border-gray-200 flex items-center justify-center bg-gray-50/50">
                          <div className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg ${
                            dayIndex === 3
                              ? 'bg-[#6059f7] text-white shadow-md'
                              : 'text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer'
                          }`}>
                            {21 + dayIndex}
                          </div>
                        </div>
                        
                        {/* Time grid cells */}
                        <div className="relative">
                          {/* Grid lines for each hour */}
                          {Array.from({ length: 10 }).map((_, index) => (
                            <div key={index} className="h-16 border-b border-gray-100"></div>
                          ))}
                          
                          {/* Events positioned absolutely */}
                          <div className="absolute top-0 left-0 right-0">
                            {mockSchedule
                              .filter((s) => s.day === dayIndex)
                              .map((schedule) => {
                                // Calculate position based on time
                                const startHour = parseInt(schedule.timeStart.split(':')[0]);
                                const startMinute = parseInt(schedule.timeStart.split(':')[1] || '0');
                                const topPosition = (startHour - 7) * 64 + (startMinute / 60) * 64; // 64px per hour
                                
                                // Calculate duration
                                const [start, end] = schedule.time.split(' - ');
                                const [startH, startM] = start.split(':').map(Number);
                                const [endH, endM] = end.split(':').map(Number);
                                const durationMinutes = (endH * 60 + endM) - (startH * 60 + startM);
                                const height = (durationMinutes / 60) * 64;
                                
                                return (
                                  <div
                                    key={schedule.id}
                                    className="absolute left-1 right-1 group cursor-pointer"
                                    style={{
                                      top: `${topPosition}px`,
                                      height: `${height}px`,
                                    }}
                                  >
                                    <div className={`
                                      h-full rounded-lg p-2 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:z-10
                                      ${schedule.color === 'yellow' ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-l-3 border-yellow-500' : ''}
                                      ${schedule.color === 'red' ? 'bg-gradient-to-br from-red-100 to-red-200 border-l-3 border-red-500' : ''}
                                      ${schedule.color === 'blue' ? 'bg-gradient-to-br from-blue-100 to-blue-200 border-l-3 border-blue-500' : ''}
                                      ${schedule.color === 'purple' ? 'bg-gradient-to-br from-purple-100 to-purple-200 border-l-3 border-purple-500' : ''}
                                      ${schedule.color === 'orange' ? 'bg-gradient-to-br from-orange-100 to-orange-200 border-l-3 border-orange-500' : ''}
                                      border-l-4 overflow-hidden
                                    `}>
                                      {/* Time Badge */}
                                      <div className="bg-gray-800 text-white px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1 mb-1">
                                        <Clock className="h-2.5 w-2.5" />
                                        {schedule.time}
                                      </div>

                                      {/* Event Title */}
                                      <h3 className="font-bold text-xs mb-1 text-gray-800 line-clamp-2 group-hover:text-[#6059f7] transition-colors leading-tight">
                                        {schedule.title}
                                      </h3>

                                      {/* Event Type & Participants */}
                                      <div className="flex flex-col gap-1">
                                        <span className={`
                                          px-1.5 py-0.5 rounded-full text-[10px] font-semibold inline-block w-fit
                                          ${schedule.color === 'yellow' ? 'bg-yellow-300 text-yellow-900' : ''}
                                          ${schedule.color === 'red' ? 'bg-red-300 text-red-900' : ''}
                                          ${schedule.color === 'blue' ? 'bg-blue-300 text-blue-900' : ''}
                                          ${schedule.color === 'purple' ? 'bg-purple-300 text-purple-900' : ''}
                                          ${schedule.color === 'orange' ? 'bg-orange-300 text-orange-900' : ''}
                                        `}>
                                          {schedule.type}
                                        </span>
                                        
                                        {height > 80 && (
                                          <div className="flex items-center gap-1 text-[10px] text-gray-600 bg-white/70 px-1.5 py-0.5 rounded-full w-fit">
                                            <Users className="h-2.5 w-2.5" />
                                            <span className="font-semibold">{schedule.participants}</span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Hover overlay */}
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-6 flex-wrap text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-200 border-l-2 border-yellow-500 rounded"></div>
                        <span className="text-gray-600">Học tập</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-200 border-l-2 border-red-500 rounded"></div>
                        <span className="text-gray-600">Thi đấu</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-200 border-l-2 border-blue-500 rounded"></div>
                        <span className="text-gray-600">Cao cấp</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-200 border-l-2 border-purple-500 rounded"></div>
                        <span className="text-gray-600">Workshop</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-200 border-l-2 border-orange-500 rounded"></div>
                        <span className="text-gray-600">Cuộc thi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar Navigation */}
              <div className="flex items-center justify-center gap-6 py-6 bg-gray-50 border-t">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-gray-800 text-white border-gray-800 hover:bg-gray-700 hover:border-gray-700 shadow-md hover:shadow-lg transition-all w-12 h-12"
                >
                  <span className="text-xl">←</span>
                </Button>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold text-gray-600">Tuần 47 • 2025</div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-gray-800 text-white border-gray-800 hover:bg-gray-700 hover:border-gray-700 shadow-md hover:shadow-lg transition-all w-12 h-12"
                >
                  <span className="text-xl">→</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chatbot Icon */}
      {/* <div className="fixed bottom-8 right-8 z-50">
        <Link href="/chat">
          <Button
            size="lg"
            className="rounded-full w-16 h-16 bg-[#6059f7] hover:bg-[#4f47d9] shadow-2xl hover:shadow-3xl transition-all p-0"
          >
            <MessageSquare className="h-8 w-8 text-white" />
          </Button>
        </Link>
      </div> */}
    </div>
  );
}

