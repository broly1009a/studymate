'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Clock, Target, BookOpen, Users } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Analytics & Insights</h1>
        <p className="text-muted-foreground mt-2">Track your learning progress and performance</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127.5 hrs</div>
            <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Goals Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8/12</div>
            <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>67% completion rate</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Study Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 days</div>
            <div className="flex items-center gap-1 text-xs text-blue-500 mt-1">
              <Target className="h-3 w-3" />
              <span>Personal best!</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3 hrs</div>
            <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
              <TrendingDown className="h-3 w-3" />
              <span>-5% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
          <CardDescription>Study hours per day this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const hours = [3.5, 2.8, 4.2, 3.1, 2.5, 5.0, 4.5][index];
              const percentage = (hours / 5) * 100;
              return (
                <div key={day} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{day}</span>
                    <span className="text-muted-foreground">{hours} hrs</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Distribution</CardTitle>
            <CardDescription>Time spent per subject this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { subject: 'Computer Science', hours: 45, color: 'bg-blue-500' },
                { subject: 'Mathematics', hours: 32, color: 'bg-green-500' },
                { subject: 'Physics', hours: 28, color: 'bg-purple-500' },
                { subject: 'Chemistry', hours: 22, color: 'bg-yellow-500' },
              ].map((item) => {
                const percentage = (item.hours / 127.5) * 100;
                return (
                  <div key={item.subject} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="font-medium">{item.subject}</span>
                      </div>
                      <span className="text-muted-foreground">{item.hours} hrs ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Your learning statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-medium">Focus Time</div>
                  <div className="text-sm text-muted-foreground">Average session duration</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">2.3 hrs</div>
                <Badge variant="outline" className="text-xs">Good</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">Goal Achievement</div>
                  <div className="text-sm text-muted-foreground">Completed vs total goals</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">67%</div>
                <Badge variant="outline" className="text-xs">Excellent</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="font-medium">Study Consistency</div>
                  <div className="text-sm text-muted-foreground">Days studied this month</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">22/27</div>
                <Badge variant="outline" className="text-xs">Great</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="font-medium">Collaboration</div>
                  <div className="text-sm text-muted-foreground">Study partner sessions</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">12</div>
                <Badge variant="outline" className="text-xs">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

