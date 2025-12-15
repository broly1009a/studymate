import { Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { StudyGoal } from '@/types/dashboard';
import { format } from 'date-fns';
import { vi } from '@/lib/i18n/vi';

interface StudyGoalsProgressProps {
  goals: StudyGoal[];
}

export function StudyGoalsProgress({ goals }: StudyGoalsProgressProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {vi.dashboard.studyGoals}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Không có mục tiêu đang hoạt động. Đặt mục tiêu để theo dõi tiến độ!
          </p>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{goal.title}</h4>
                    <p className="text-xs text-muted-foreground">{goal.description}</p>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {goal.progress}%
                  </span>
                </div>
                <Progress value={goal.progress} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {goal.current} / {goal.target} {goal.unit}
                  </span>
                  <span>Hạn: {format(new Date(goal.deadline), 'dd/MM')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

