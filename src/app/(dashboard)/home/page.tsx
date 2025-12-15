'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TinderEvents } from '@/components/dashboard/tinder-events';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Calendar, Trophy, Users, Heart, Clock, Target, MessageSquare, Flame, Timer, CheckCircle, AlertCircle } from 'lucide-react';
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

// Mock events data
const mockEvents = [
  {
    id: '1',
    title: 'Cuộc thi Lập trình ACM ICPC 2025',
    description: 'Cuộc thi lập trình quốc tế dành cho sinh viên. Đăng ký ngay để thể hiện kỹ năng của bạn!',
    type: 'competition' as const,
    date: '2025-11-15T00:00:00',
    time: '09:00 - 17:00',
    location: 'Đại học Bách Khoa Hà Nội',
    participants: 156,
    maxParticipants: 200,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    organizer: 'ACM ICPC Vietnam',
    tags: ['Lập trình', 'Thuật toán', 'Thi đấu'],
  },
  {
    id: '2',
    title: 'Phiên học nhóm: Toán Cao Cấp',
    description: 'Cùng nhau ôn tập và giải bài tập Toán Cao Cấp chương 3 và 4.',
    type: 'study-session' as const,
    date: '2025-10-30T00:00:00',
    time: '14:00 - 16:00',
    location: 'Thư viện Trung tâm',
    participants: 8,
    maxParticipants: 12,
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800',
    organizer: 'Nhóm Toán K65',
    tags: ['Toán học', 'Học nhóm', 'Ôn tập'],
  },
  {
    id: '3',
    title: 'Hackathon AI & Machine Learning',
    description: 'Tham gia xây dựng giải pháp AI trong 24 giờ. Giải thưởng hấp dẫn!',
    type: 'competition' as const,
    date: '2025-11-20T00:00:00',
    time: '08:00 (20/11) - 08:00 (21/11)',
    location: 'Innovation Hub',
    participants: 89,
    maxParticipants: 100,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    organizer: 'Tech Community',
    tags: ['AI', 'Machine Learning', 'Hackathon'],
  },
  {
    id: '4',
    title: 'Họp nhóm: Dự án Phần mềm Quản lý',
    description: 'Thảo luận tiến độ và phân công công việc tuần tới cho dự án môn Công nghệ Phần mềm.',
    type: 'group-meeting' as const,
    date: '2025-10-29T00:00:00',
    time: '19:00 - 20:30',
    location: 'Online - Google Meet',
    participants: 5,
    maxParticipants: 5,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    organizer: 'Nhóm 5 - SE Project',
    tags: ['Dự án', 'Phần mềm', 'Họp nhóm'],
  },
  {
    id: '5',
    title: 'Thi giữa kỳ: Cấu trúc Dữ liệu',
    description: 'Kiểm tra giữa kỳ môn Cấu trúc Dữ liệu và Giải thuật. Ôn tập kỹ!',
    type: 'exam' as const,
    date: '2025-11-05T00:00:00',
    time: '13:00 - 15:00',
    location: 'Phòng C101',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
    organizer: 'Khoa CNTT',
    tags: ['Thi cử', 'Cấu trúc dữ liệu', 'Giữa kỳ'],
  },
  {
    id: '6',
    title: 'Workshop: Kỹ năng Thuyết trình',
    description: 'Học cách thuyết trình hiệu quả và tự tin trước đám đông.',
    type: 'study-session' as const,
    date: '2025-11-08T00:00:00',
    time: '15:00 - 17:00',
    location: 'Hội trường A',
    participants: 45,
    maxParticipants: 50,
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
    organizer: 'CLB Kỹ năng mềm',
    tags: ['Kỹ năng', 'Thuyết trình', 'Workshop'],
  },
];

// Mock dashboard data
const mockDashboardData: DashboardData = {
  welcomeMessage: 'Chào mừng trở lại',
  studyStreak: {
    current: 7,
    longest: 15,
    lastStudyDate: new Date().toISOString(),
  },
  todaySchedule: [
    {
      id: '1',
      title: 'Phiên học Toán',
      type: 'study-session',
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
      endTime: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
      subject: 'Giải tích',
      participants: ['Nguyễn Văn A'],
    },
    {
      id: '2',
      title: 'Họp nhóm Vật lý',
      type: 'group-meeting',
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
      endTime: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
      subject: 'Cơ học lượng tử',
      participants: ['Alice', 'Bob', 'Charlie'],
    },
  ],
  quickStats: {
    todayStudyTime: 45,
    weeklyStudyTime: 320,
    questionsAnswered: 12,
    upcomingDeadlines: 3,
  },
  recentActivities: [
    {
      id: '1',
      type: 'answer',
      title: 'Đã trả lời câu hỏi',
      description: 'Bạn đã trả lời "Cách giải phương trình bậc hai?"',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: '2',
      type: 'match',
      title: 'Bạn học mới',
      description: 'Bạn đã kết nối với Sarah cho môn Khoa học Máy tính',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: '3',
      type: 'group',
      title: 'Tham gia nhóm học',
      description: 'Bạn đã tham gia "Nhóm học Toán nâng cao"',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
  ],
  studyGoals: [
    {
      id: '1',
      title: 'Hoàn thành 50 giờ học tháng này',
      description: 'Theo dõi thời gian học hàng tháng',
      target: 50,
      current: 32,
      unit: 'giờ',
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
      progress: 64,
    },
    {
      id: '2',
      title: 'Trả lời 30 câu hỏi',
      description: 'Giúp đỡ người khác bằng cách trả lời câu hỏi',
      target: 30,
      current: 18,
      unit: 'câu hỏi',
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(),
      progress: 60,
    },
  ],
  aiRecommendations: [],
  upcomingEvents: [],
};

export default function HomePage() {
  const stats = {
    totalEvents: mockEvents.length,
    competitions: mockEvents.filter(e => e.type === 'competition').length,
    studySessions: mockEvents.filter(e => e.type === 'study-session').length,
    meetings: mockEvents.filter(e => e.type === 'group-meeting').length,
  };

  return (
    <div className="space-y-6">
      {/* Header with Welcome */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {mockDashboardData.welcomeMessage},{' '}
          <span className="text-[#6059f7]">Duy Anh</span>! 👋
        </h1>
        <p className="text-muted-foreground">
          Khám phá sự kiện mới và theo dõi hoạt động học tập của bạn
        </p>
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN - Stats (Vertical) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Study Streak */}
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-lg">🔥</span>
              </div>
              <div className="text-sm font-medium text-gray-700">Chuỗi ngày học</div>
            </div>
            <div className="text-3xl font-bold text-orange-500">7</div>
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
            <div className="text-3xl font-bold text-blue-500">45</div>
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
            <div className="text-3xl font-bold text-green-500">5.3</div>
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
            <div className="text-3xl font-bold text-purple-500">12</div>
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
            <div className="text-3xl font-bold text-red-500">3</div>
            <p className="text-xs text-gray-500 mt-1">mục cần hoàn thành</p>
          </div>
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
              <TinderEvents events={mockEvents} />
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN - Today's Schedule & Recent Activity */}
        <div className="lg:col-span-3 space-y-4">
          {/* Today's Schedule */}
          <TodaySchedule schedule={mockDashboardData.todaySchedule} />

          {/* Recent Activity */}
          <RecentActivity activities={mockDashboardData.recentActivities} />
        </div>
      </div>
    </div>
  );
}

