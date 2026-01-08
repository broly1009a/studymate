'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Users, Clock, Heart, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi as viLocale } from 'date-fns/locale';
import { useAuth } from '@/hooks/use-auth';
import { API_URL, AUTH_TOKEN_KEY } from '@/lib/constants';

interface InterestedEvent {
  _id: string;
  title: string;
  description: string;
  type: string;
  date: Date;
  time: string;
  location: string;
  image?: string;
  organizer: string;
  tags: string[];
  participants: string[];
  participantCount: number;
  maxParticipants?: number;
  interactionDate: Date;
}

export default function MyInterestedEventsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [interestedEvents, setInterestedEvents] = useState<InterestedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    const fetchInterestedEvents = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (!token) return;

        // Get user's interested interactions
        const interactionsRes = await fetch(
          `${API_URL}/activity-interactions?activityType=event&action=interested`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        const interactionsData = await interactionsRes.json();
        if (!interactionsData.success || !interactionsData.data?.length) {
          setInterestedEvents([]);
          return;
        }

        // Get event IDs
        const eventIds = interactionsData.data.map((i: any) => i.activityId);

        // Fetch actual events
        const eventsRes = await fetch(`${API_URL}/events?limit=100`);
        const eventsData = await eventsRes.json();

        if (eventsData.success) {
          // Filter and enrich events with interaction date
          const interested = eventsData.data
            .filter((event: any) => eventIds.includes(event._id))
            .map((event: any) => {
              const interaction = interactionsData.data.find(
                (i: any) => i.activityId === event._id
              );
              return {
                ...event,
                interactionDate: interaction?.createdAt,
              };
            });

          setInterestedEvents(interested);
        }
      } catch (error) {
        console.error('Failed to fetch interested events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterestedEvents();
  }, [user]);

  const upcomingEvents = interestedEvents.filter(
    (event) => new Date(event.date) >= new Date()
  );

  const pastEvents = interestedEvents.filter(
    (event) => new Date(event.date) < new Date()
  );

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'study-session': 'bg-blue-100 text-blue-800',
      'group-meeting': 'bg-purple-100 text-purple-800',
      'exam': 'bg-red-100 text-red-800',
      'workshop': 'bg-green-100 text-green-800',
      'seminar': 'bg-indigo-100 text-indigo-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'study-session': 'Phiên học',
      'group-meeting': 'Họp nhóm',
      'exam': 'Thi cử',
      'workshop': 'Workshop',
      'seminar': 'Hội thảo',
    };
    return labels[type] || type;
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#6059f7]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Please log in to view your interested events.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="h-8 w-8 text-pink-500 fill-pink-500" />
          <h1 className="text-3xl font-bold">Sự kiện quan tâm</h1>
        </div>
        <p className="text-muted-foreground">
          Các sự kiện bạn đã bày tỏ quan tâm từ trang khám phá
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng quan tâm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interestedEvents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sắp diễn ra
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{upcomingEvents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đã qua
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">{pastEvents.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sự kiện</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">
                Sắp diễn ra ({upcomingEvents.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Đã qua ({pastEvents.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    Bạn chưa quan tâm sự kiện nào sắp diễn ra
                  </p>
                  <Link href="/home">
                    <Button className="mt-4">Khám phá sự kiện</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <Card key={event._id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        {event.image && (
                          <div className="relative w-full md:w-48 h-48">
                            <Image
                              src={event.image}
                              alt={event.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <Badge className={getTypeColor(event.type)}>
                                {getTypeLabel(event.type)}
                              </Badge>
                              <h3 className="text-xl font-semibold mt-2">{event.title}</h3>
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-3 line-clamp-2">
                            {event.description}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{format(new Date(event.date), 'dd/MM/yyyy', { locale: viLocale })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {event.participantCount}
                                {event.maxParticipants && `/${event.maxParticipants}`} người
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button size="sm">
                              Tham gia
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </Button>
                            <span className="text-xs text-muted-foreground">
                              Quan tâm {format(new Date(event.interactionDate), 'dd/MM/yyyy', { locale: viLocale })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {pastEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Không có sự kiện đã qua</p>
                </div>
              ) : (
                <div className="space-y-4 opacity-60">
                  {pastEvents.map((event) => (
                    <Card key={event._id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        {event.image && (
                          <div className="relative w-full md:w-48 h-48 grayscale">
                            <Image
                              src={event.image}
                              alt={event.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 p-4">
                          <Badge className={getTypeColor(event.type)}>
                            {getTypeLabel(event.type)}
                          </Badge>
                          <h3 className="text-xl font-semibold mt-2">{event.title}</h3>
                          <p className="text-muted-foreground mb-3 line-clamp-2">
                            {event.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{format(new Date(event.date), 'dd/MM/yyyy', { locale: viLocale })}</span>
                            </div>
                            <Badge variant="secondary">Đã kết thúc</Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
