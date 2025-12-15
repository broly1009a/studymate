'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSessions, getSubjects, getWeeklySessionData, getSubjectDistribution } from '@/lib/mock-data/sessions';
import { Calendar, Clock, TrendingUp, Award } from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import Link from 'next/link';
import { vi } from '@/lib/i18n/vi';

export default function SessionHistoryPage() {
  const sessions = getSessions();
  const subjects = getSubjects();
  const weeklyData = getWeeklySessionData();
  const subjectDistribution = getSubjectDistribution();

  const thisWeekSessions = sessions.filter((session) => {
    const sessionDate = new Date(session.startTime);
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    return sessionDate >= weekStart && sessionDate <= weekEnd;
  });

  const totalHoursThisWeek = thisWeekSessions.reduce((sum, s) => sum + s.duration, 0) / 60;
  const avgFocusThisWeek = thisWeekSessions.length > 0
    ? thisWeekSessions.reduce((sum, s) => sum + (s.focusScore || 0), 0) / thisWeekSessions.length
    : 0;

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Session History</h1>
        <p className="text-muted-foreground mt-2">View your study session analytics and history</p>
      </div>

      {/* This Week Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisWeekSessions.length}</div>
            <p className="text-xs text-muted-foreground">sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Total Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHoursThisWeek.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Avg Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgFocusThisWeek.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Award className="h-4 w-4" />
              Best Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Mon</div>
            <p className="text-xs text-muted-foreground">4.5 hours</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Study hours per day this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyData.map((day) => (
                  <div key={day.day} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{day.day}</span>
                      <span className="text-muted-foreground">{day.hours.toFixed(1)}h</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(day.hours / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>Your latest study sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.slice(0, 10).map((session) => {
                  const subject = subjects.find((s) => s.id === session.subjectId);
                  return (
                    <Link
                      key={session.id}
                      href={`/study-sessions/${session.id}`}
                      className="block"
                    >
                      <div className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                          style={{ backgroundColor: subject?.color + '20' }}
                        >
                          {subject?.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{session.topic}</div>
                          <div className="text-sm text-muted-foreground">
                            {session.duration} min • {session.focusScore}% focus
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(session.startTime), 'MMM d')}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Distribution */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subject Distribution</CardTitle>
              <CardDescription>Total hours by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectDistribution.map((item) => {
                  const total = subjectDistribution.reduce((sum, s) => sum + (s.hours || 0), 0);
                  const percentage = ((item.hours || 0) / total) * 100;
                  return (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-muted-foreground">{(item.hours || 0).toFixed(1)}h</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Study Streak */}
          <Card>
            <CardHeader>
              <CardTitle>Study Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">7</div>
                <p className="text-sm text-muted-foreground">days in a row</p>
                <div className="mt-4 text-xs text-muted-foreground">
                  Keep it up! 🔥
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Goal */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">67.5 / 100 hours</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: '67.5%' }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">32.5 hours to go</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

