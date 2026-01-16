'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, MapPin, Loader2 } from 'lucide-react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { CreateEventDialog } from '@/components/calendar/create-event-dialog';
import { EventDetailDialog } from '@/components/calendar/event-detail-dialog';
import { EditEventDialog } from '@/components/calendar/edit-event-dialog';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { AUTH_TOKEN_KEY } from '@/lib/constants';
import type { Event } from '@/types/event';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events?limit=100');
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load events',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const selectedDayEvents = events.filter(event => 
    isSameDay(new Date(event.date), selectedDate)
  );

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'study-session': return 'bg-blue-500/10 text-blue-500';
      case 'exam': return 'bg-red-500/10 text-red-500';
      case 'workshop': return 'bg-yellow-500/10 text-yellow-500';
      case 'group-meeting': return 'bg-green-500/10 text-green-500';
      case 'seminar': return 'bg-purple-500/10 text-purple-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getEventTypeLabel = (type: string) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEditOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground mt-2">Manage your study schedule</p>
        </div>
        <CreateEventDialog 
          onEventCreated={fetchEvents} 
          token={typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) || undefined : undefined} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePreviousMonth}>Previous</Button>
                <Button variant="outline" size="sm" onClick={handleNextMonth}>Next</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
              {daysInMonth.map((day) => {
                const hasEvents = events.some(event => isSameDay(new Date(event.date), day));
                const isSelected = isSameDay(day, selectedDate);
                const isTodayDate = isToday(day);
                
                return (
                  <button
                    key={day.toString()}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      aspect-square p-2 rounded-lg text-sm transition-colors relative
                      ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}
                      ${isTodayDate && !isSelected ? 'border-2 border-primary' : ''}
                    `}
                  >
                    {format(day, 'd')}
                    {hasEvents && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Events for Selected Day */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {format(selectedDate, 'MMMM d, yyyy')}
            </CardTitle>
            <CardDescription>
              {selectedDayEvents.length} event{selectedDayEvents.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDayEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No events scheduled</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDayEvents.map((event) => (
                  <div 
                    key={event._id} 
                    className="p-3 border rounded-lg space-y-2 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge className={getEventTypeColor(event.type)}>
                        {getEventTypeLabel(event.type)}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Your scheduled events for the next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.slice(0, 5).map((event) => (
              <div 
                key={event._id} 
                className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleEventClick(event)}
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{format(new Date(event.date), 'd')}</div>
                    <div className="text-xs text-muted-foreground">{format(new Date(event.date), 'MMM')}</div>
                  </div>
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                </div>
                <Badge className={getEventTypeColor(event.type)}>
                  {getEventTypeLabel(event.type)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Detail Dialog */}
      <EventDetailDialog
        event={selectedEvent}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onEventUpdated={fetchEvents}
        onEdit={handleEditEvent}
        currentUserId={user?.id}
      />

      {/* Edit Event Dialog */}
      <EditEventDialog
        event={selectedEvent}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onEventUpdated={fetchEvents}
        token={typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) || undefined : undefined}
      />
    </div>
  );
}

