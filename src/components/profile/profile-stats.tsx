'use client';

import { UserStatistics } from '@/types/profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Flame, HelpCircle, MessageCircle, Users, Trophy, Target, Award } from 'lucide-react';

interface ProfileStatsProps {
  statistics: UserStatistics;
}

export function ProfileStats({ statistics }: ProfileStatsProps) {
  const stats = [
    {
      label: 'Giờ học',
      value: statistics.totalStudyHours.toLocaleString(),
      icon: Clock,
      color: 'text-blue-500',
    },
    {
      label: 'Chuỗi ngày hiện tại',
      value: `${statistics.studyStreak} ngày`,
      icon: Flame,
      color: 'text-orange-500',
    },
    {
      label: 'Chuỗi ngày dài nhất',
      value: `${statistics.longestStreak} ngày`,
      icon: Trophy,
      color: 'text-yellow-500',
    },
    {
      label: 'Câu hỏi đã trả lời',
      value: statistics.questionsAnswered.toLocaleString(),
      icon: MessageCircle,
      color: 'text-green-500',
    },
    {
      label: 'Câu hỏi đã hỏi',
      value: statistics.questionsAsked.toLocaleString(),
      icon: HelpCircle,
      color: 'text-purple-500',
    },
    {
      label: 'Nhóm học',
      value: statistics.groupsJoined.toLocaleString(),
      icon: Users,
      color: 'text-pink-500',
    },
    {
      label: 'Bạn học',
      value: statistics.partnersConnected.toLocaleString(),
      icon: Users,
      color: 'text-indigo-500',
    },
    {
      label: 'Cuộc thi',
      value: statistics.competitionsParticipated.toLocaleString(),
      icon: Award,
      color: 'text-red-500',
    },
    {
      label: 'Mục tiêu hoàn thành',
      value: statistics.goalsCompleted.toLocaleString(),
      icon: Target,
      color: 'text-teal-500',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                <Icon className={`h-6 w-6 mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

