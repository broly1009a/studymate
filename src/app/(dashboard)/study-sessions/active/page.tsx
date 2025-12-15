'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Square, Coffee, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

interface Subject {
  id: string;
  name: string;
  icon: string;
}

export default function ActiveSessionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Session setup
  const [subjectId, setSubjectId] = useState('');
  const [topic, setTopic] = useState('');
  const [sessionStarted, setSessionStarted] = useState(false);

  // Timer state
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Pomodoro state
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [breakCount, setBreakCount] = useState(0);
  const [isBreak, setIsBreak] = useState(false);

  // Settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notes, setNotes] = useState('');
  const [focusScore, setFocusScore] = useState(85);
  const [isSaving, setIsSaving] = useState(false);

  // Load subjects
  useEffect(() => {
    if (!user?.id) return;

    const fetchSubjects = async () => {
      try {
        const response = await fetch(`/api/subjects?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setSubjects(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, [user?.id]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartSession = () => {
    if (!subjectId || !topic) {
      toast.error('Vui lòng chọn môn học và nhập chủ đề');
      return;
    }
    setSessionStarted(true);
    setIsRunning(true);
    toast.success('Đã bắt đầu phiên học!');
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? 'Session resumed' : 'Session paused');
  };

  const handleTakeBreak = () => {
    setIsPaused(true);
    setIsBreak(true);
    setBreakCount(breakCount + 1);
    toast.info('Break time! Take a rest.');
  };

  const handleEndBreak = () => {
    setIsPaused(false);
    setIsBreak(false);
    toast.success('Break ended. Back to studying!');
  };

  const handleCompletePomodoro = () => {
    setPomodoroCount(pomodoroCount + 1);
    toast.success('Pomodoro completed! 🍅');
  };

  const handleEndSession = async () => {
    if (seconds < 60) {
      toast.error('Session must be at least 1 minute long');
      return;
    }

    const duration = Math.floor(seconds / 60);
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/study-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          subjectId,
          subjectName: subjects.find(s => s.id === subjectId)?.name || 'Unknown',
          topic,
          duration,
          focusScore,
          pomodoroCount,
          breaks: breakCount,
          notes,
          startTime: new Date(Date.now() - seconds * 1000),
          endTime: new Date(),
          status: 'completed',
        }),
      });

      if (!response.ok) throw new Error('Failed to save session');

      toast.success(`Session completed! Duration: ${duration} minutes`);
      
      setTimeout(() => {
        router.push('/study-sessions');
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save session');
      console.error('Error saving session:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!sessionStarted) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Start Study Session</h1>
          <p className="text-muted-foreground mt-2">Set up your study session</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
            <CardDescription>Choose what you want to study</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Subject</Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.icon} {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Topic</Label>
              <Input
                placeholder="What will you study?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div>
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Add any notes or goals for this session..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            <Button onClick={handleStartSession} className="w-full" size="lg">
              <Play className="h-4 w-4 mr-2" />
              Start Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedSubject = subjects.find((s) => s.id === subjectId);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Active Session</h1>
        <p className="text-muted-foreground mt-2">{selectedSubject?.name} - {topic}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timer */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div
                  className="text-7xl font-bold mb-8"
                  style={{ color: isBreak ? '#f59e0b' : selectedSubject?.color }}
                >
                  {formatTime(seconds)}
                </div>
                {isBreak && (
                  <div className="text-xl text-yellow-500 mb-4 flex items-center justify-center gap-2">
                    <Coffee className="h-6 w-6" />
                    Break Time
                  </div>
                )}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={handlePauseResume}
                    size="lg"
                    variant={isPaused ? 'default' : 'outline'}
                  >
                    {isPaused ? <Play className="h-5 w-5 mr-2" /> : <Pause className="h-5 w-5 mr-2" />}
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                  {!isBreak ? (
                    <Button onClick={handleTakeBreak} size="lg" variant="outline">
                      <Coffee className="h-5 w-5 mr-2" />
                      Take Break
                    </Button>
                  ) : (
                    <Button onClick={handleEndBreak} size="lg" variant="default">
                      End Break
                    </Button>
                  )}
                  <Button onClick={handleEndSession} size="lg" variant="destructive" disabled={isSaving}>
                    <Square className="h-5 w-5 mr-2" />
                    {isSaving ? 'Saving...' : 'End Session'}
                  </Button>
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
              <Textarea
                placeholder="Take notes during your session..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
              />
            </CardContent>
          </Card>
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
                <div className="text-sm text-muted-foreground">Duration</div>
                <div className="text-2xl font-bold">{Math.floor(seconds / 60)} min</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Pomodoros</div>
                <div className="text-2xl font-bold">{pomodoroCount}</div>
                <Button
                  onClick={handleCompletePomodoro}
                  size="sm"
                  variant="outline"
                  className="mt-2 w-full"
                >
                  Complete Pomodoro
                </Button>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Breaks Taken</div>
                <div className="text-2xl font-bold">{breakCount}</div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                variant="outline"
                className="w-full"
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="h-4 w-4 mr-2" />
                    Sound On
                  </>
                ) : (
                  <>
                    <VolumeX className="h-4 w-4 mr-2" />
                    Sound Off
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

