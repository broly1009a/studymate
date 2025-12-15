'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Plus, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const currentMonth = new Date();
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const events = [
    {
      id: '1',
      title: 'Algorithm Study Session',
      date: new Date(),
      time: '14:00',
      duration: '2 hours',
      type: 'study',
      location: 'Online',
    },
    {
      id: '2',
      title: 'Math Competition',
      date: addDays(new Date(), 2),
      time: '10:00',
      duration: '3 hours',
      type: 'competition',
      location: 'Main Hall',
    },
    {
      id: '3',
      title: 'Group Study - Physics',
      date: addDays(new Date(), 5),
      time: '16:00',
      duration: '1.5 hours',
      type: 'group',
      location: 'Library',
    },
  ];

  const selectedDayEvents = events.filter(event => 
    isSameDay(event.date, selectedDate)
  );

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'study': return 'bg-blue-500/10 text-blue-500';
      case 'competition': return 'bg-yellow-500/10 text-yellow-500';
      case 'group': return 'bg-green-500/10 text-green-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground mt-2">Manage your study schedule</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
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
                const hasEvents = events.some(event => isSameDay(event.date, day));
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
                  <div key={event.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{event.time} • {event.duration}</span>
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
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{format(event.date, 'd')}</div>
                    <div className="text-xs text-muted-foreground">{format(event.date, 'MMM')}</div>
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
                  {event.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

