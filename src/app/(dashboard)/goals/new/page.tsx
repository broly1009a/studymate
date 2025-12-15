'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Target } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

interface Subject {
  id: string;
  name: string;
  icon: string;
}

export default function NewGoalPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'study_hours' as const,
    category: 'weekly' as const,
    targetValue: '',
    unit: 'hours',
    priority: 'medium' as const,
    subjectId: 'none',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    icon: '🎯',
    color: '#3b82f6',
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`/api/subjects?userId=${user?.id}`);
        if (response.ok) {
          const data = await response.json();
          setSubjects(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    if (user?.id) {
      fetchSubjects();
    }
  }, [user?.id]);

  const goalTypes = [
    { value: 'study_hours', label: 'Study Hours', unit: 'hours', icon: '⏰' },
    { value: 'sessions', label: 'Sessions Count', unit: 'sessions', icon: '📚' },
    { value: 'subject_mastery', label: 'Subject Mastery', unit: '%', icon: '🎓' },
    { value: 'streak', label: 'Study Streak', unit: 'days', icon: '🔥' },
    { value: 'custom', label: 'Custom Goal', unit: 'units', icon: '🎯' },
  ];

  const handleTypeChange = (type: string) => {
    const selectedType = goalTypes.find(t => t.value === type);
    setFormData({
      ...formData,
      type: type as any,
      unit: selectedType?.unit || 'units',
      icon: selectedType?.icon || '🎯',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.targetValue || !formData.endDate || !user?.id) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: formData.title,
          description: formData.description,
          type: formData.type,
          category: formData.category,
          targetValue: parseFloat(formData.targetValue),
          unit: formData.unit,
          priority: formData.priority,
          subjectId: formData.subjectId === 'none' ? null : formData.subjectId,
          startDate: formData.startDate,
          endDate: formData.endDate,
          icon: formData.icon,
          color: formData.color,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create goal');
      }

      toast.success('Goal created successfully!');
      setTimeout(() => {
        router.push('/goals');
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create goal');
      console.error('Error creating goal:', error);
    } finally {
      setIsSubmitting(false);
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

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Goal</h1>
        <p className="text-muted-foreground mt-2">Set a new study goal to track your progress</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Goal Details</CardTitle>
            <CardDescription>Define your goal and set targets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Goal Type */}
            <div className="space-y-2">
              <Label>Goal Type *</Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {goalTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                placeholder="e.g., Study 20 hours this week"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe your goal..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            {/* Target Value */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Target Value *</Label>
                <Input
                  type="number"
                  placeholder="e.g., 20"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Input
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g., hours"
                />
              </div>
            </div>

            {/* Category & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(v: any) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={formData.priority} onValueChange={(v: any) => setFormData({ ...formData, priority: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Subject (optional) */}
            <div className="space-y-2">
              <Label>Subject (Optional)</Label>
              <Select value={formData.subjectId} onValueChange={(v) => setFormData({ ...formData, subjectId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No subject</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.icon} {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date *</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Icon & Color */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Icon</Label>
                <Input
                  placeholder="e.g., 🎯"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-20"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                <Target className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Creating...' : 'Create Goal'}
              </Button>
              <Link href="/goals" className="flex-1">
                <Button type="button" variant="outline" className="w-full" disabled={isSubmitting}>
                  Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

