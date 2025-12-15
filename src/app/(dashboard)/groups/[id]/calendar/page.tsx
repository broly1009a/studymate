'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from '@/lib/i18n/vi';

export default function GroupCalendarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [group, setGroup] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);
        const [groupRes, eventsRes] = await Promise.all([
          fetch(`/api/groups/${id}`),
          fetch(`/api/groups/${id}/events`),
        ]);

        const groupData = await groupRes.json();
        const eventsData = await eventsRes.json();

        if (groupData.success) setGroup(groupData.data);
        if (eventsData.success) setEvents(eventsData.data);
      } catch (error) {
        console.error('Failed to fetch calendar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!group) {
    return <div className="w-full">Không tìm thấy nhóm</div>;
  }

  return (
    <div className="w-full">
      <Link href={`/groups/${id}`}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Group
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Group Calendar</CardTitle>
            <Link href={`/groups/${id}/events/new`}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming events</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <Link key={event.id} href={`/groups/${id}/events/${event.id}`}>
                  <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{format(new Date(event.startTime), 'MMM d, h:mm a')}</span>
                          <span>•</span>
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <Badge variant="outline">{event.type.replace('_', ' ')}</Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

