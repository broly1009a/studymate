'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Target,
  UserPlus,
  UserMinus,
  Play,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

interface StudySessionDetailProps {
  sessionId: string;
}

interface Participant {
  _id: string;
  fullName: string;
  avatar?: string;
}

interface Session {
  _id: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  subject: string;
  topic: string;
  goal?: string;
  startTime: string;
  endTime: string;
  duration: number;
  location?: string;
  online: boolean;
  meetLink?: string;
  maxParticipants: number;
  participants: Participant[];
  participants_count: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  notes?: string;
  resources: string[];
}

export default function StudySessionDetail({ sessionId }: StudySessionDetailProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSession();
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/study-sessions/${sessionId}`);
      const data = await response.json();

      if (data.success) {
        setSession(data.data);
      } else {
        toast.error('Failed to load session');
      }
    } catch (error) {
      console.error('Error fetching session:', error);
      toast.error('Failed to load session');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!user?.id) {
      toast.error('Please login to join');
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`/api/study-sessions/${sessionId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.fullName,
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Successfully joined the session! 🎉');
        fetchSession(); // Refresh
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error joining session:', error);
      toast.error('Failed to join session');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!user?.id) return;

    try {
      setActionLoading(true);
      const response = await fetch(`/api/study-sessions/${sessionId}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Left the session');
        fetchSession(); // Refresh
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error leaving session:', error);
      toast.error('Failed to leave session');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStart = async () => {
    if (!user?.id) return;

    try {
      setActionLoading(true);
      const response = await fetch(`/api/study-sessions/${sessionId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Session started! 🚀');
        fetchSession(); // Refresh
        
        // Redirect to meet link if available
        if (session?.meetLink) {
          window.open(session.meetLink, '_blank');
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error starting session:', error);
      toast.error('Failed to start session');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!user?.id) return;

    try {
      setActionLoading(true);
      const response = await fetch(`/api/study-sessions/${sessionId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      const data = await response.json();

      if (data.success) {
        const rewards = data.data.rewards;
        toast.success(
          `Session completed! 🎉\n` +
          `Participants: +${rewards.participants} points\n` +
          `Creator bonus: +${rewards.creator} points`
        );
        fetchSession(); // Refresh
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error completing session:', error);
      toast.error('Failed to complete session');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-96">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Session not found</p>
        </CardContent>
      </Card>
    );
  }

  const isCreator = user?.id === session.creatorId;
  const isParticipant = session.participants.some((p) => p._id === user?.id);
  const isFull = session.participants_count >= session.maxParticipants;
  const canJoin = !isParticipant && !isFull && session.status === 'scheduled';

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">{session.title}</CardTitle>
                <Badge variant={
                  session.status === 'ongoing' ? 'default' :
                  session.status === 'completed' ? 'secondary' :
                  session.status === 'cancelled' ? 'destructive' :
                  'outline'
                }>
                  {session.status}
                </Badge>
              </div>
              <CardDescription>{session.description}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Creator Info */}
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={session.creatorAvatar} />
              <AvatarFallback>{session.creatorName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Organized by</p>
              <p className="text-sm text-muted-foreground">{session.creatorName}</p>
            </div>
          </div>

          <Separator />

          {/* Session Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Subject</p>
                <p className="text-sm text-muted-foreground">{session.subject} - {session.topic}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Date & Time</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(session.startTime), 'PPp')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">{session.duration} minutes</p>
              </div>
            </div>

            {session.online ? (
              <div className="flex items-center gap-3">
                <Video className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Online Meeting</p>
                  {session.meetLink && (
                    <a 
                      href={session.meetLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Join Link
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{session.location || 'TBD'}</p>
                </div>
              </div>
            )}
          </div>

          {session.goal && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Goal</p>
                <p className="text-sm text-muted-foreground">{session.goal}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Participants */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <h3 className="font-semibold">
                  Participants ({session.participants_count}/{session.maxParticipants})
                </h3>
              </div>
              {isFull && <Badge variant="secondary">Full</Badge>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {session.participants.map((participant) => (
                <div key={participant._id} className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={participant.avatar} />
                    <AvatarFallback>{participant.fullName[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm truncate">{participant.fullName}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {canJoin && (
              <Button 
                onClick={handleJoin} 
                disabled={actionLoading}
                className="flex-1"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Join Session
              </Button>
            )}

            {isParticipant && !isCreator && session.status === 'scheduled' && (
              <Button 
                onClick={handleLeave} 
                disabled={actionLoading}
                variant="outline"
                className="flex-1"
              >
                <UserMinus className="h-4 w-4 mr-2" />
                Leave Session
              </Button>
            )}

            {isCreator && session.status === 'scheduled' && (
              <Button 
                onClick={handleStart} 
                disabled={actionLoading}
                className="flex-1"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Session
              </Button>
            )}

            {isCreator && session.status === 'ongoing' && (
              <Button 
                onClick={handleComplete} 
                disabled={actionLoading}
                className="flex-1"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Complete Session
              </Button>
            )}

            {session.status === 'ongoing' && session.meetLink && (
              <Button 
                onClick={() => window.open(session.meetLink, '_blank')}
                variant="default"
                className="flex-1"
              >
                <Video className="h-4 w-4 mr-2" />
                Join Meeting
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      {session.resources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {session.resources.map((resource, index) => (
                <li key={index}>
                  <a 
                    href={resource} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {resource}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
