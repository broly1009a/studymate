import { CalendarDays, MapPin, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Event } from '@/types/dashboard';
import { format } from 'date-fns';
import { vi } from '@/lib/i18n/vi';

interface UpcomingEventsProps {
  events: Event[];
}

const typeColors = {
  'study-session': 'bg-blue-100 text-blue-800',
  'group-meeting': 'bg-purple-100 text-purple-800',
  'competition': 'bg-orange-100 text-orange-800',
  'exam': 'bg-red-100 text-red-800',
  'deadline': 'bg-yellow-100 text-yellow-800',
};

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          {vi.dashboard.upcomingEvents}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {vi.dashboard.noEvents}
          </p>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col items-center min-w-[50px] pt-1">
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(event.date), 'MMM')}
                  </span>
                  <span className="text-xl font-bold">
                    {format(new Date(event.date), 'dd')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">{event.title}</h4>
                    <Badge variant="secondary" className={typeColors[event.type]}>
                      {event.type.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      {event.time}
                    </p>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {event.location}
                        </span>
                      </div>
                    )}
                    {event.participants && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {event.participants} người tham gia
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

