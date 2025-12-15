import { Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StudyStreak } from '@/types/dashboard';
import { vi } from '@/lib/i18n/vi';

interface StudyStreakCardProps {
  streak: StudyStreak;
}

export function StudyStreakCard({ streak }: StudyStreakCardProps) {
  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{vi.dashboard.studyStreak}</CardTitle>
        <Flame className="h-4 w-4 text-orange-600" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold text-orange-600">{streak.current}</div>
          <div className="text-sm text-muted-foreground">ngày</div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Chuỗi dài nhất: {streak.longest} ngày
        </p>
      </CardContent>
    </Card>
  );
}

