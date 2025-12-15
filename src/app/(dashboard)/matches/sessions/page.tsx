'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Star, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';

interface StudySession {
  _id: string;
  id?: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  subject: string;
  scheduledAt: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  rating?: number;
  review?: string;
}

export default function PartnerSessionsPage() {
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed'>('all');
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const params = filter !== 'all' ? `?status=${filter}` : '';
        const response = await fetch(`/api/study-sessions${params}`);
        if (!response.ok) {
          throw new Error('Failed to fetch sessions');
        }
        const data = await response.json();
        setSessions(data.data || []);
      } catch (error: any) {
        toast.error('Không thể tải phiên học');
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [filter]);

  const handleCancelSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/study-sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) throw new Error('Failed to cancel');
      toast.success('Đã hủy phiên học');
      setSessions(sessions.map(s => s._id === sessionId ? { ...s, status: 'cancelled' } : s));
    } catch (error: any) {
      toast.error('Không thể hủy phiên học');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/10 text-blue-500';
      case 'completed': return 'bg-green-500/10 text-green-500';
      case 'cancelled': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Partner Sessions</h1>
        <p className="text-muted-foreground mt-2">Manage your study sessions with partners</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {sessions.filter(s => s.status === 'scheduled').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {sessions.filter(s => s.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'scheduled' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('scheduled')}
        >
          Scheduled
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('completed')}
        >
          Completed
        </Button>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50 animate-spin" />
              <h3 className="text-lg font-semibold mb-2">Đang tải phiên học...</h3>
            </CardContent>
          </Card>
        ) : sessions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Sessions</h3>
              <p className="text-muted-foreground mb-4">
                {filter === 'scheduled' 
                  ? "You don't have any scheduled sessions"
                  : filter === 'completed'
                  ? "You haven't completed any sessions yet"
                  : "No sessions to display"}
              </p>
              <Link href="/matches">
                <Button>Find Study Partners</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          sessions.map((session) => (
            <Card key={session._id || session.id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Link href={`/matches/${session.partnerId}`}>
                    <Image
                      src={session.partnerAvatar}
                      alt={session.partnerName}
                      width={64}
                      height={64}
                      className="rounded-full hover:opacity-80 transition-opacity"
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/matches/${session.partnerId}`}>
                          <CardTitle className="text-lg hover:underline">
                            {session.partnerName}
                          </CardTitle>
                        </Link>
                        <CardDescription className="mt-1">
                          {session.subject}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(session.scheduledAt), 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(new Date(session.scheduledAt), 'h:mm a')} • {session.duration} min
                      </div>
                    </div>

                    {session.status === 'completed' && session.rating && (
                      <div className="mt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < session.rating!
                                    ? 'fill-yellow-500 text-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{session.rating}/5</span>
                        </div>
                        {session.review && (
                          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                            "{session.review}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              {session.status === 'scheduled' && (
                <CardContent>
                  <div className="flex gap-2">
                    <Link href="/study-sessions/active" className="flex-1">
                      <Button className="w-full">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Start Session
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleCancelSession(session._id || session.id)}
                      variant="outline"
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

