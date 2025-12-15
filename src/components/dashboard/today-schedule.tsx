import { Calendar, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ScheduleItem } from '@/types/dashboard';
import { format } from 'date-fns';
import { vi } from '@/lib/i18n/vi';

interface TodayScheduleProps {
  schedule: ScheduleItem[];
}

const typeColors = {
  'study-session': 'bg-blue-100 text-blue-800',
  'group-meeting': 'bg-purple-100 text-purple-800',
  'competition': 'bg-orange-100 text-orange-800',
  'exam': 'bg-red-100 text-red-800',
};

export function TodaySchedule({ schedule }: TodayScheduleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {vi.dashboard.todaySchedule}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {schedule.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Không có hoạt động nào được lên lịch hôm nay
          </p>
        ) : (
          <div className="space-y-3">
            {schedule.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col items-center min-w-[60px]">
                  <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium">
                    {format(new Date(item.startTime), 'HH:mm')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(item.endTime), 'HH:mm')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">{item.title}</h4>
                    <Badge variant="secondary" className={typeColors[item.type]}>
                      {item.type.replace('-', ' ')}
                    </Badge>
                  </div>
                  {item.subject && (
                    <p className="text-xs text-muted-foreground">{item.subject}</p>
                  )}
                  {item.participants && item.participants.length > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {item.participants.length} người tham gia
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

