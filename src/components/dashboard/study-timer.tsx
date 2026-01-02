'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Play, 
  Pause, 
  Square, 
  Coffee, 
  Target, 
  Timer, 
  TrendingUp,
  CheckCircle2,
  Flame
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

interface StudyTimerProps {
  subjectId: string;
  subjectName: string;
  topic: string;
  onComplete?: () => void;
}

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds
const BREAK_DURATION = 5 * 60; // 5 minutes in seconds

export default function StudyTimer({ 
  subjectId, 
  subjectName, 
  topic,
  onComplete 
}: StudyTimerProps) {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'ongoing' | 'paused' | 'break'>('idle');
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [breaks, setBreaks] = useState(0);
  const [focusScore, setFocusScore] = useState(80);
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');
  const [isBreak, setIsBreak] = useState(false);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (status === 'ongoing' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Pomodoro complete
            handlePomodoroComplete();
            return POMODORO_DURATION;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [status, timeLeft]);

  // Start study session
  const handleStart = async () => {
    try {
      const response = await fetch('/api/study-records/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          subjectId,
          topic,
          estimatedDuration: 60
        })
      });

      const data = await response.json();

      if (data.success) {
        setSessionId(data.data._id);
        setStatus('ongoing');
        setTimeLeft(POMODORO_DURATION);
        toast.success('Study session started! Focus time! 🎯');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error starting session:', error);
      toast.error('Failed to start session');
    }
  };

  // Pause session
  const handlePause = async () => {
    if (!sessionId) return;

    try {
      const response = await fetch(`/api/study-records/${sessionId}/pause`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id })
      });

      const data = await response.json();

      if (data.success) {
        setStatus('paused');
        setBreaks(data.data.breaks);
        toast.info('Session paused. Take a breath! ☕');
      }
    } catch (error) {
      console.error('Error pausing session:', error);
      toast.error('Failed to pause session');
    }
  };

  // Resume session
  const handleResume = async () => {
    if (!sessionId) return;

    try {
      const response = await fetch(`/api/study-records/${sessionId}/resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id })
      });

      const data = await response.json();

      if (data.success) {
        setStatus('ongoing');
        toast.success('Session resumed! Let\'s focus! 💪');
      }
    } catch (error) {
      console.error('Error resuming session:', error);
      toast.error('Failed to resume session');
    }
  };

  // Complete pomodoro
  const handlePomodoroComplete = async () => {
    if (!sessionId) return;

    try {
      const response = await fetch(`/api/study-records/${sessionId}/pomodoro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          focusRating: focusScore
        })
      });

      const data = await response.json();

      if (data.success) {
        setPomodoroCount(data.data.pomodoroCount);
        setStatus('paused');
        
        if (data.milestone) {
          toast.success(data.milestone.message + ` +${data.milestone.points} points! 🎉`);
        } else {
          toast.success('Pomodoro completed! Take a 5-min break ☕');
        }

        // Auto-start break
        setIsBreak(true);
        setTimeLeft(BREAK_DURATION);
      }
    } catch (error) {
      console.error('Error completing pomodoro:', error);
    }
  };

  // Complete session
  const handleComplete = async () => {
    if (!sessionId) return;

    try {
      const response = await fetch(`/api/study-records/${sessionId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          notes,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          finalFocusScore: focusScore
        })
      });

      const data = await response.json();

      if (data.success) {
        const { record, streak, reputation } = data.data;
        
        toast.success(
          `Session completed! +${reputation.points} points 🎉\n` +
          `Streak: ${streak.current} days 🔥`
        );

        // Reset state
        setStatus('idle');
        setSessionId(null);
        setTimeLeft(POMODORO_DURATION);
        setNotes('');
        setTags('');
        
        onComplete?.();
      }
    } catch (error) {
      console.error('Error completing session:', error);
      toast.error('Failed to complete session');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((POMODORO_DURATION - timeLeft) / POMODORO_DURATION) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Study Timer - {subjectName}
          </span>
          <Badge variant={status === 'ongoing' ? 'default' : 'secondary'}>
            {status === 'ongoing' ? 'Active' : status === 'paused' ? 'Paused' : 'Ready'}
          </Badge>
        </CardTitle>
        <CardDescription>{topic}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center space-y-4">
          <div className="text-6xl font-bold tracking-tight">
            {formatTime(timeLeft)}
          </div>
          <Progress value={progress} className="h-2" />
          
          {isBreak && (
            <div className="flex items-center justify-center gap-2 text-orange-600">
              <Coffee className="h-4 w-4" />
              <span className="text-sm font-medium">Break Time</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold">
              <Target className="h-5 w-5 text-blue-600" />
              {pomodoroCount}
            </div>
            <div className="text-xs text-muted-foreground">Pomodoros</div>
          </div>
          
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold">
              <Coffee className="h-5 w-5 text-orange-600" />
              {breaks}
            </div>
            <div className="text-xs text-muted-foreground">Breaks</div>
          </div>
          
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold">
              <TrendingUp className="h-5 w-5 text-green-600" />
              {focusScore}
            </div>
            <div className="text-xs text-muted-foreground">Focus Score</div>
          </div>
        </div>

        {/* Focus Score Slider */}
        {status !== 'idle' && (
          <div className="space-y-2">
            <Label>How focused are you? ({focusScore}%)</Label>
            <input
              type="range"
              min="0"
              max="100"
              value={focusScore}
              onChange={(e) => setFocusScore(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          {status === 'idle' && (
            <Button onClick={handleStart} className="flex-1" size="lg">
              <Play className="h-4 w-4 mr-2" />
              Start Session
            </Button>
          )}

          {status === 'ongoing' && (
            <>
              <Button onClick={handlePause} variant="outline" className="flex-1">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button onClick={handleComplete} variant="default" className="flex-1">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Complete
              </Button>
            </>
          )}

          {status === 'paused' && (
            <>
              <Button onClick={handleResume} className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
              <Button onClick={handleComplete} variant="outline" className="flex-1">
                <Square className="h-4 w-4 mr-2" />
                End Session
              </Button>
            </>
          )}
        </div>

        {/* Notes & Tags (shown when session active) */}
        {status !== 'idle' && (
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="notes">Session Notes</Label>
              <Textarea
                id="notes"
                placeholder="What did you learn today?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="e.g., difficult, exam-prep, review"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
