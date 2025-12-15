'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, TrendingUp, Target, Coffee, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { vi } from '@/lib/i18n/vi';
import { useAuth } from '@/hooks/use-auth';

interface Session {
  _id: string;
  topic: string;
  subjectName: string;
  subjectId: string;
  duration: number;
  focusScore: number;
  pomodoroCount: number;
  breaks: number;
  notes: string;
  startTime: string;
  endTime: string;
  status: string;
}

export default function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!user?.id || !id) return;

    const fetchSession = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/study-records/${id}?userId=${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch session');
        const data = await response.json();
        setSession(data.data || data);
      } catch (error: any) {
        toast.error('Failed to load session');
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [user?.id, id]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Session Not Found</h1>
          <p className="text-muted-foreground mb-4">The session you're looking for doesn't exist.</p>
          <Link href="/study-sessions">
            <Button>Back to Sessions</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/study-records/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      });

      if (!response.ok) throw new Error('Failed to delete session');

      toast.success('Session deleted successfully');
      setTimeout(() => {
        router.push('/study-sessions');
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete session');
      console.error('Error deleting session:', error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <Link href="/study-sessions">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sessions
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{session.topic}</h1>
            <p className="text-muted-foreground mt-2">{session.subjectName}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete} disabled={isDeleting}>
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Session Info */}
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl bg-blue-100">
                  📚
                </div>
                <div>
                  <div className="font-semibold text-lg">{session.subjectName}</div>
                  <div className="text-sm text-muted-foreground">{session.topic}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Date</div>
                    <div className="font-medium">{format(new Date(session.startTime), 'MMM d, yyyy')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Time</div>
                    <div className="font-medium">
                      {format(new Date(session.startTime), 'h:mm a')} - {format(new Date(session.endTime!), 'h:mm a')}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Session Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {session.notes ? (
                <p className="text-sm whitespace-pre-wrap">{session.notes}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">No notes for this session</p>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          {session.tags && session.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {session.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Session Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  Duration
                </div>
                <div className="text-2xl font-bold">{session.duration} min</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <TrendingUp className="h-4 w-4" />
                  Focus Score
                </div>
                <div className="text-2xl font-bold">{session.focusScore}%</div>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${session.focusScore}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Target className="h-4 w-4" />
                  Pomodoros
                </div>
                <div className="text-2xl font-bold">{session.pomodoroCount}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Coffee className="h-4 w-4" />
                  Breaks
                </div>
                <div className="text-2xl font-bold">{session.breaks}</div>
              </div>
            </CardContent>
          </Card>

          {/* Subject Info */}
          {subject && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Subject Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Total Hours</div>
                  <div className="font-semibold">{subject.totalHours}h</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Sessions</div>
                  <div className="font-semibold">{subject.sessionsCount}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Avg Session</div>
                  <div className="font-semibold">{subject.averageSessionLength} min</div>
                </div>
                <Link href={`/subjects/${subject.id}`}>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View Subject Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/study-sessions/active">
                <Button variant="outline" size="sm" className="w-full">
                  Start Similar Session
                </Button>
              </Link>
              <Link href="/study-sessions/history">
                <Button variant="outline" size="sm" className="w-full">
                  View History
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

