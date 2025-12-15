import { Clock, TrendingUp, MessageSquare, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { QuickStats as QuickStatsType } from '@/types/dashboard';

interface QuickStatsProps {
  stats: QuickStatsType;
}

export function QuickStats({ stats }: QuickStatsProps) {
  const statCards = [
    {
      title: 'Thời gian học hôm nay',
      value: `${stats.todayStudyTime}p`,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Thời gian học tuần này',
      value: `${Math.floor(stats.weeklyStudyTime / 60)}g ${stats.weeklyStudyTime % 60}p`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Câu hỏi đã trả lời',
      value: stats.questionsAnswered,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Deadline sắp tới',
      value: stats.upcomingDeadlines,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

