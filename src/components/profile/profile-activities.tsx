'use client';

import { Activity } from '@/types/profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MessageCircle, HelpCircle, Users, UserPlus, Target, Award, Trophy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ProfileActivitiesProps {
  activities: Activity[];
}

const activityIcons = {
  study_session: Clock,
  question_answered: MessageCircle,
  question_asked: HelpCircle,
  group_joined: Users,
  partner_connected: UserPlus,
  goal_completed: Target,
  badge_earned: Award,
  competition_joined: Trophy,
};

const activityColors = {
  study_session: 'text-blue-500 bg-blue-500/10',
  question_answered: 'text-green-500 bg-green-500/10',
  question_asked: 'text-purple-500 bg-purple-500/10',
  group_joined: 'text-pink-500 bg-pink-500/10',
  partner_connected: 'text-indigo-500 bg-indigo-500/10',
  goal_completed: 'text-teal-500 bg-teal-500/10',
  badge_earned: 'text-yellow-500 bg-yellow-500/10',
  competition_joined: 'text-red-500 bg-red-500/10',
};

export function ProfileActivities({ activities }: ProfileActivitiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hoạt động gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-muted-foreground text-sm">Chưa có hoạt động nào</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activityIcons[activity.type] || Clock;
              const colorClass = activityColors[activity.type] || 'text-gray-500 bg-gray-500/10';

              return (
                <div key={activity.id} className="flex gap-3">
                  <div className={`p-2 rounded-lg ${colorClass} h-fit`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{activity.title}</div>
                    <div className="text-sm text-muted-foreground">{activity.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </div>
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

