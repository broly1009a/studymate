'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getGoals, getGoalStats } from '@/lib/mock-data/goals';
import { TrendingUp, TrendingDown, Target, Calendar, Award } from 'lucide-react';
import Link from 'next/link';
import { differenceInDays } from 'date-fns';

export default function GoalProgressPage() {
  const goals = getGoals({ status: 'active' });
  const stats = getGoalStats();

  const onTrackGoals = goals.filter(g => {
    const progress = (g.currentValue / g.targetValue) * 100;
    const daysLeft = differenceInDays(new Date(g.endDate), new Date());
    const totalDays = differenceInDays(new Date(g.endDate), new Date(g.startDate));
    const timeProgress = ((totalDays - daysLeft) / totalDays) * 100;
    return progress >= timeProgress;
  });

  const behindGoals = goals.filter(g => {
    const progress = (g.currentValue / g.targetValue) * 100;
    const daysLeft = differenceInDays(new Date(g.endDate), new Date());
    const totalDays = differenceInDays(new Date(g.endDate), new Date(g.startDate));
    const timeProgress = ((totalDays - daysLeft) / totalDays) * 100;
    return progress < timeProgress;
  });

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Goal Progress Tracking</h1>
        <p className="text-muted-foreground mt-2">Monitor your progress across all active goals</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">On Track</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{onTrackGoals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Behind Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{behindGoals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageProgress.toFixed(0)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* On Track Goals */}
      {onTrackGoals.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <h2 className="text-xl font-bold">On Track ({onTrackGoals.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {onTrackGoals.map((goal) => {
              const progress = (goal.currentValue / goal.targetValue) * 100;
              const daysLeft = differenceInDays(new Date(goal.endDate), new Date());
              
              return (
                <Link key={goal.id} href={`/goals/${goal.id}`}>
                  <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{goal.icon}</div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate">{goal.title}</CardTitle>
                          <CardDescription className="text-xs">
                            {goal.currentValue} / {goal.targetValue} {goal.unit}
                          </CardDescription>
                        </div>
                        <Badge className="bg-green-500/10 text-green-500">
                          {progress.toFixed(0)}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(progress, 100)}%`,
                            backgroundColor: goal.color,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {daysLeft} days left
                        </span>
                        <span className="capitalize">{goal.category}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Behind Schedule Goals */}
      {behindGoals.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="h-5 w-5 text-red-500" />
            <h2 className="text-xl font-bold">Behind Schedule ({behindGoals.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {behindGoals.map((goal) => {
              const progress = (goal.currentValue / goal.targetValue) * 100;
              const daysLeft = differenceInDays(new Date(goal.endDate), new Date());
              const dailyTarget = daysLeft > 0 
                ? ((goal.targetValue - goal.currentValue) / daysLeft).toFixed(1)
                : '0';
              
              return (
                <Link key={goal.id} href={`/goals/${goal.id}`}>
                  <Card className="hover:bg-accent/50 transition-colors cursor-pointer border-red-500/20">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{goal.icon}</div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate">{goal.title}</CardTitle>
                          <CardDescription className="text-xs">
                            {goal.currentValue} / {goal.targetValue} {goal.unit}
                          </CardDescription>
                        </div>
                        <Badge className="bg-red-500/10 text-red-500">
                          {progress.toFixed(0)}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(progress, 100)}%`,
                            backgroundColor: goal.color,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {daysLeft} days left
                        </span>
                        <span className="text-red-500 font-medium">
                          Need {dailyTarget} {goal.unit}/day
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Active Goals</h3>
            <p className="text-muted-foreground mb-4">
              Create your first goal to start tracking your progress
            </p>
            <Link href="/goals/new">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                Create Goal
              </button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Tips Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-5 w-5" />
            Progress Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Goals marked as "On Track" are progressing faster than or equal to the time elapsed</li>
            <li>• "Behind Schedule" goals need increased daily effort to meet the deadline</li>
            <li>• Check the daily target to see how much you need to do each day</li>
            <li>• Consider adjusting deadlines or targets if goals become unrealistic</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

