'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';

export default function EventDetailPage({ params }: { params: Promise<{ id: string; eventId: string }> }) {
  const { id, eventId } = use(params);
  const [group, setGroup] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const [groupRes, eventRes] = await Promise.all([
          fetch(`/api/groups/${id}`),
          fetch(`/api/groups/${id}/events/${eventId}`),
        ]);

        const groupData = await groupRes.json();
        const eventData = await eventRes.json();

        if (groupData.success) setGroup(groupData.data);
        if (eventData.success) setEvent(eventData.data);
      } catch (error) {
        console.error('Failed to fetch event data:', error);
        toast.error('Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id, eventId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!group || !event) {
    return <div className="w-full">Event not found</div>;
  }

  const handleRSVP = async () => {
    try {
      setRsvpLoading(true);
      const response = await fetch(`/api/groups/${id}/events/${eventId}/rsvp`, {
        method: 'POST',
      });

      const data = await response.json();
      if (data.success) {
        toast.success('RSVP confirmed!');
        // Refresh event data
        const eventRes = await fetch(`/api/groups/${id}/events/${eventId}`);
        const eventData = await eventRes.json();
        if (eventData.success) setEvent(eventData.data);
      } else {
        toast.error(data.message || 'Failed to RSVP');
      }
    } catch (error) {
      console.error('Failed to RSVP:', error);
      toast.error('Failed to RSVP');
    } finally {
      setRsvpLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Link href={`/groups/${id}/calendar`}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Calendar
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{event.title}</CardTitle>
              <p className="text-muted-foreground mt-2">{group.name}</p>
            </div>
            <Badge variant="outline">{event.type.replace('_', ' ')}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Date</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(event.startTime), 'EEEE, MMMM d, yyyy')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Time</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Location</div>
                <div className="text-sm text-muted-foreground">{event.location}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Attendees</div>
                <div className="text-sm text-muted-foreground">
                  {event.attendees}/{event.maxAttendees} people attending
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">{event.description}</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleRSVP} className="flex-1" disabled={rsvpLoading}>
              {rsvpLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              RSVP to Event
            </Button>
            <Button variant="outline">Share</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

