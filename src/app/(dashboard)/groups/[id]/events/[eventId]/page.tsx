'use client';

import { use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getGroupById } from '@/lib/mock-data/groups';
import { ArrowLeft, Calendar, MapPin, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';

export default function EventDetailPage({ params }: { params: Promise<{ id: string; eventId: string }> }) {
  const { id, eventId } = use(params);
  const group = getGroupById(id);
  
  // Mock event data
  const event = {
    id: eventId,
    title: 'Weekly Study Session',
    description: 'Join us for our weekly study session covering advanced algorithms and data structures.',
    type: 'study_session',
    startTime: '2025-11-01T14:00:00',
    endTime: '2025-11-01T16:00:00',
    location: 'Library Room 301',
    attendees: 12,
    maxAttendees: 20,
  };

  if (!group) {
    return <div className="w-full">Group not found</div>;
  }

  const handleRSVP = () => {
    toast.success('RSVP confirmed!');
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
            <Button onClick={handleRSVP} className="flex-1">
              RSVP to Event
            </Button>
            <Button variant="outline">Share</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

