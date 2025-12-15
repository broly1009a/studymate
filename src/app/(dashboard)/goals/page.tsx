'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Target, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from '@/lib/i18n/vi';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

interface Goal {
  _id: string;
  title: string;
  description: string;
  icon: string;
  status: string;
  priority: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  color: string;
  endDate: string;
  startDate: string;
  completedAt?: string;
  category: string;
  subjectName?: string;
}

interface Stats {
  total: number;
  active: number;
  completed: number;
  averageProgress: number;
}

export default function GoalsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, completed: 0, averageProgress: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const queryStatus = filter === 'all' ? '' : `&status=${filter}`;
        const response = await fetch(`/api/goals?userId=${user.id}${queryStatus}`);
        if (!response.ok) throw new Error('Failed to fetch goals');
        const data = await response.json();
        setGoals(data.data || []);
      } catch (error: any) {
        toast.error('Failed to load goals');
        console.error('Error fetching goals:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/goals/stats?userId=${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (error: any) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchGoals();
    fetchStats();
  }, [user?.id, filter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-500';
      case 'active': return 'bg-blue-500/10 text-blue-500';
      case 'paused': return 'bg-yellow-500/10 text-yellow-500';
      case 'failed': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-500';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500';
      case 'low': return 'bg-green-500/10 text-green-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Goals</h1>
          <p className="text-muted-foreground mt-2">Track your study goals and progress</p>
        </div>
        <Link href="/goals/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
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

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All Goals
        </Button>
        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('active')}
        >
          Active
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('completed')}
        >
          Completed
        </Button>
      </div>

      {/* Goals List */}
      <div className="grid grid-cols-1 gap-4">
        {goals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No goals found</h3>
              <p className="text-muted-foreground mb-4">
                {filter === 'all' 
                  ? "You haven't created any goals yet"
                  : `No ${filter} goals found`}
              </p>
              <Link href="/goals/new">
                <Button>Create Your First Goal</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          goals.map((goal) => {
            const progress = (goal.currentValue / goal.targetValue) * 100;
            const daysLeft = Math.ceil((new Date(goal.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <Link key={goal._id} href={`/goals/${goal._id}`}>
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="text-3xl">{goal.icon}</div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate">{goal.title}</CardTitle>
                          <CardDescription className="mt-1">{goal.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Badge className={getStatusColor(goal.status)}>
                          {goal.status}
                        </Badge>
                        <Badge className={getPriorityColor(goal.priority)}>
                          {goal.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-medium">Progress</span>
                        <span className="text-muted-foreground">
                          {goal.currentValue} / {goal.targetValue} {goal.unit}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(progress, 100)}%`,
                            backgroundColor: goal.color || '#3b82f6',
                          }}
                        />
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {progress.toFixed(0)}% complete
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {goal.status === 'completed' ? (
                          <span>Completed {format(new Date(goal.completedAt!), 'MMM d')}</span>
                        ) : daysLeft > 0 ? (
                          <span>{daysLeft} days left</span>
                        ) : (
                          <span className="text-red-500">Overdue</span>
                        )}
                      </div>
                      {goal.subjectName && (
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          <span>{goal.subjectName}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span className="capitalize">{goal.category}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

