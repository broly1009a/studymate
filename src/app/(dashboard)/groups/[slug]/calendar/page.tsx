'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Calendar as CalendarIcon, Loader2, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from '@/lib/i18n/vi';

export default function GroupCalendarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [group, setGroup] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);
        const groupRes = await fetch(`/api/groups/${slug}`);
        const groupData = await groupRes.json();

        if (groupData.success) {
          setGroup(groupData.data);

          const eventsRes = await fetch(`/api/groups/${slug}/events`);
          const eventsData = await eventsRes.json();

          if (eventsData.success) setEvents(eventsData.data);
        }
      } catch (error) {
        console.error('Failed to fetch calendar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-muted-foreground">Group not found</h2>
        <p className="text-muted-foreground mt-2">The group you're looking for doesn't exist.</p>
        <Link href="/groups">
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Groups
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/groups/${slug}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Group
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{group.name} - Calendar</h1>
            <p className="text-sm text-muted-foreground">
              Upcoming events and schedule
            </p>
          </div>
        </div>
        <Link href={`/groups/${slug}/events/new`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Calendar View */}
      <div className="grid gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No upcoming events</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to create an event for this group!
                  </p>
                  <Link href={`/groups/${slug}/events/new`}>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Event
                    </Button>
                  </Link>
                </div>
              ) : (
                events.map((event: any) => (
                  <div key={event._id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CalendarIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium mb-2">{event.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{event.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {format(new Date(event.date), 'PPP')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{event.time}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          {event.attendees?.length || 0} attending
                        </Badge>
                        <Link href={`/groups/${slug}/events/${event._id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}