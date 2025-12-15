'use client';

import { use } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSubjectById, getSessions } from '@/lib/mock-data/sessions';
import { ArrowLeft, Edit, Trash2, Clock, TrendingUp, Target, Calendar, Play } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function SubjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const subject = getSubjectById(id);
  const sessions = getSessions({ subjectId: id });

  if (!subject) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Subject Not Found</h1>
          <p className="text-muted-foreground mb-4">The subject you're looking for doesn't exist.</p>
          <Link href="/subjects">
            <Button>Back to Subjects</Button>
          </Link>
        </div>
      </div>
    );
  }

  const progress = ((subject.totalHours || 0) / (subject.goalHours || 1)) * 100;
  const hoursRemaining = Math.max(0, (subject.goalHours || 0) - (subject.totalHours || 0));

  const handleDelete = () => {
    toast.success('Subject deleted successfully');
    setTimeout(() => {
      router.push('/subjects');
    }, 1000);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <Link href="/subjects">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Subjects
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center text-4xl"
              style={{ backgroundColor: subject.color + '20' }}
            >
              {subject.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{subject.name}</h1>
              <p className="text-muted-foreground mt-1">{subject.sessionsCount} sessions • {subject.totalHours}h total</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/study-sessions/active">
              <Button>
                <Play className="h-4 w-4 mr-2" />
                Start Session
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Study Progress</CardTitle>
              <CardDescription>Track your progress towards your goal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Goal Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {subject.totalHours}h / {subject.goalHours}h ({progress.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: subject.color,
                    }}
                  />
                </div>
                {hoursRemaining > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {hoursRemaining.toFixed(1)} hours remaining to reach your goal
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div>
                  <div className="text-sm text-muted-foreground">Total Hours</div>
                  <div className="text-2xl font-bold">{subject.totalHours}h</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Sessions</div>
                  <div className="text-2xl font-bold">{subject.sessionsCount}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Avg Session</div>
                  <div className="text-2xl font-bold">{subject.averageSessionLength}m</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>Your latest study sessions for this subject</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No sessions yet</p>
                    <Link href="/study-sessions/active">
                      <Button className="mt-4">Start Your First Session</Button>
                    </Link>
                  </div>
                ) : (
                  sessions.map((session) => (
                    <Link
                      key={session.id}
                      href={`/study-sessions/${session.id}`}
                      className="block"
                    >
                      <div className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{session.topic}</div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {session.duration} min
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {session.focusScore}%
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {session.pomodoroCount} 🍅
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(session.startTime), 'MMM d')}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Topics</CardTitle>
            </CardHeader>
            <CardContent>
              {subject.topics && subject.topics.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {subject.topics.map((topic) => (
                    <Badge
                      key={topic}
                      variant="secondary"
                      style={{
                        backgroundColor: subject.color + '20',
                        color: subject.color,
                      }}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No topics added yet</p>
              )}
            </CardContent>
          </Card>

          {/* Study Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Study Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Last Studied</div>
                <div className="font-medium">
                  {subject.lastStudied ? format(new Date(subject.lastStudied), 'MMM d, yyyy') : 'Never'}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Study Frequency</div>
                <div className="font-medium">
                  {((subject.sessionsCount || 0) / 30).toFixed(1)} sessions/week
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Pomodoros</div>
                <div className="font-medium">
                  {sessions.reduce((sum, s) => sum + (s.pomodoroCount || 0), 0)} 🍅
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/study-sessions/active">
                <Button className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Start Session
                </Button>
              </Link>
              <Link href={`/study-sessions?subject=${subject.id}`}>
                <Button variant="outline" className="w-full">
                  View All Sessions
                </Button>
              </Link>
              <Link href="/goals/new">
                <Button variant="outline" className="w-full">
                  Set New Goal
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

