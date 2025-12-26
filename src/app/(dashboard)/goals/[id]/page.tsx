'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Play, Pause, CheckCircle2, Calendar, TrendingUp, Target } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';

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
  type?: string;
  subjectName?: string;
}

export default function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!user?.id || !id) return;

    const fetchGoal = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/goals/${id}?userId=${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch goal');
        const data = await response.json();
        setGoal(data);
      } catch (error: any) {
        toast.error('Failed to load goal');
        console.error('Error fetching goal:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [user?.id, id]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading goal...</p>
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Goal Not Found</h1>
          <p className="text-muted-foreground mb-4">The goal you're looking for doesn't exist.</p>
          <Link href="/goals">
            <Button>Back to Goals</Button>
          </Link>
        </div>
      </div>
    );
  }

  const progress = (goal.currentValue / goal.targetValue) * 100;
  const daysLeft = differenceInDays(new Date(goal.endDate), new Date());
  const totalDays = differenceInDays(new Date(goal.endDate), new Date(goal.startDate));
  const daysElapsed = totalDays - daysLeft;
  const timeProgress = (daysElapsed / totalDays) * 100;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      });

      if (!response.ok) throw new Error('Failed to delete goal');

      toast.success('Goal deleted successfully');
      setTimeout(() => {
        router.push('/goals');
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete goal');
      console.error('Error deleting goal:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async () => {
    setIsUpdating(true);
    try {
      const newStatus = goal.status === 'active' ? 'paused' : 'active';
      const response = await fetch(`/api/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          status: newStatus,
        }),
      });

      if (!response.ok) throw new Error('Failed to update goal');

      const updatedGoal = await response.json();
      setGoal(updatedGoal);
      
      if (newStatus === 'active') {
        toast.success('Goal resumed');
      } else {
        toast.success('Goal paused');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update goal');
      console.error('Error updating goal:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleComplete = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          status: 'completed',
          completedAt: new Date(),
        }),
      });

      if (!response.ok) throw new Error('Failed to complete goal');

      toast.success('Goal marked as completed!');
      setTimeout(() => {
        router.push('/goals');
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete goal');
      console.error('Error completing goal:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-500';
      case 'active': return 'bg-blue-500/10 text-blue-500';
      case 'paused': return 'bg-yellow-500/10 text-yellow-500';
      case 'failed': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="w-full">
      <Link href="/goals">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Goals
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{goal.icon}</div>
                  <div>
                    <CardTitle className="text-2xl">{goal.title}</CardTitle>
                    <CardDescription className="mt-2">{goal.description}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(goal.status)}>
                  {goal.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {goal.status === 'active' && (
                  <>
                    <Button onClick={handleToggleStatus} variant="outline" disabled={isUpdating}>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause Goal
                    </Button>
                    {progress >= 100 && (
                      <Button onClick={handleComplete} disabled={isUpdating}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                  </>
                )}
                {goal.status === 'paused' && (
                  <Button onClick={handleToggleStatus} disabled={isUpdating}>
                    <Play className="h-4 w-4 mr-2" />
                    Resume Goal
                  </Button>
                )}
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" onClick={handleDelete} disabled={isDeleting}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
              <CardDescription>Track your progress towards your goal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Value Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Goal Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {goal.currentValue} / {goal.targetValue} {goal.unit}
                  </span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: goal.color,
                    }}
                  />
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {progress.toFixed(1)}% complete
                </div>
              </div>

              {/* Time Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Time Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {daysElapsed} / {totalDays} days
                  </span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-400 rounded-full transition-all"
                    style={{ width: `${Math.min(timeProgress, 100)}%` }}
                  />
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {daysLeft > 0 ? `${daysLeft} days remaining` : 'Deadline passed'}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                  <div className="text-2xl font-bold">
                    {Math.max(0, goal.targetValue - goal.currentValue)}
                  </div>
                  <div className="text-xs text-muted-foreground">{goal.unit}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Daily Target</div>
                  <div className="text-2xl font-bold">
                    {daysLeft > 0 
                      ? ((goal.targetValue - goal.currentValue) / daysLeft).toFixed(1)
                      : '0'}
                  </div>
                  <div className="text-xs text-muted-foreground">{goal.unit}/day</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Pace</div>
                  <div className="text-2xl font-bold">
                    {progress > timeProgress ? (
                      <span className="text-green-500">Ahead</span>
                    ) : progress < timeProgress ? (
                      <span className="text-red-500">Behind</span>
                    ) : (
                      <span className="text-blue-500">On Track</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Goal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Goal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {goal.type && (
                <div>
                  <div className="text-sm text-muted-foreground">Type</div>
                  <div className="font-medium capitalize">{goal.type.replace('_', ' ')}</div>
                </div>
              )}
              <div>
                <div className="text-sm text-muted-foreground">Category</div>
                <div className="font-medium capitalize">{goal.category}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Priority</div>
                <Badge className={
                  goal.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                  goal.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                  'bg-green-500/10 text-green-500'
                }>
                  {goal.priority}
                </Badge>
              </div>
              {goal.subjectName && (
                <div>
                  <div className="text-sm text-muted-foreground">Subject</div>
                  <div className="font-medium">{goal.subjectName}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Start Date</div>
                <div className="font-medium">{format(new Date(goal.startDate), 'MMM d, yyyy')}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">End Date</div>
                <div className="font-medium">{format(new Date(goal.endDate), 'MMM d, yyyy')}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Duration</div>
                <div className="font-medium">{totalDays} days</div>
              </div>
              {goal.completedAt && (
                <div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                  <div className="font-medium">{format(new Date(goal.completedAt), 'MMM d, yyyy')}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

