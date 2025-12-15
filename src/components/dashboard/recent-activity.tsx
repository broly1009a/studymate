import { MessageSquare, Users, Trophy, UserPlus, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Activity } from '@/types/dashboard';
import { formatDistanceToNow } from 'date-fns';
import { vi } from '@/lib/i18n/vi';

interface RecentActivityProps {
  activities: Activity[];
}

const activityIcons = {
  question: MessageSquare,
  answer: CheckCircle,
  group: Users,
  match: UserPlus,
  competition: Trophy,
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{vi.dashboard.recentActivities}</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {vi.dashboard.noActivities}
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activityIcons[activity.type];
              return (
                <div key={activity.id} className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

