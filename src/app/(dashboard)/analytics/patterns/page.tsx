'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, TrendingUp } from 'lucide-react';

export default function StudyPatternsPage() {
  const patterns = {
    peakHours: ['14:00-16:00', '19:00-21:00'],
    mostProductiveDays: ['Tuesday', 'Thursday', 'Saturday'],
    averageSessionLength: '2.3 hours',
    preferredSubjects: ['Computer Science', 'Mathematics'],
    studyStreak: 15,
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Study Patterns</h1>
        <p className="text-muted-foreground mt-2">Understand your learning habits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Peak Study Hours
            </CardTitle>
            <CardDescription>When you're most productive</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patterns.peakHours.map((hour) => (
                <div key={hour} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{hour}</span>
                  <Badge variant="secondary">High Activity</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Most Productive Days
            </CardTitle>
            <CardDescription>Your best study days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patterns.mostProductiveDays.map((day) => (
                <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{day}</span>
                  <Badge variant="secondary">Peak Day</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session Length Analysis</CardTitle>
            <CardDescription>Average study session duration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <div className="text-4xl font-bold text-primary">{patterns.averageSessionLength}</div>
              <p className="text-muted-foreground mt-2">Average session length</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">+15% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subject Preferences</CardTitle>
            <CardDescription>Your most studied subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patterns.preferredSubjects.map((subject, index) => (
                <div key={subject} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{subject}</span>
                    <span className="text-muted-foreground">{index === 0 ? '45%' : '32%'}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: index === 0 ? '45%' : '32%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="font-medium text-blue-500 mb-1">💡 Optimal Study Time</h4>
              <p className="text-sm text-muted-foreground">
                You're most productive between 2-4 PM. Consider scheduling important study sessions during this time.
              </p>
            </div>
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h4 className="font-medium text-green-500 mb-1">🎯 Consistency Streak</h4>
              <p className="text-sm text-muted-foreground">
                You've maintained a {patterns.studyStreak}-day study streak! Keep it up to build strong habits.
              </p>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <h4 className="font-medium text-yellow-500 mb-1">⚡ Session Length</h4>
              <p className="text-sm text-muted-foreground">
                Your average session length is ideal. Consider taking short breaks every 25-30 minutes for better retention.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

