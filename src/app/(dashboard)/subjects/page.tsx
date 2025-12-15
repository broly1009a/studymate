'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getSubjects } from '@/lib/mock-data/sessions';
import { Plus, BookOpen, Clock, TrendingUp, Target } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SubjectsPage() {
  const subjects = getSubjects();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', icon: '', color: '#3b82f6' });

  const handleAddSubject = () => {
    if (!newSubject.name) {
      toast.error('Please enter a subject name');
      return;
    }
    toast.success('Subject added successfully!');
    setIsDialogOpen(false);
    setNewSubject({ name: '', icon: '', color: '#3b82f6' });
  };

  const totalHours = subjects.reduce((sum, s) => sum + (s.totalHours || 0), 0);
  const totalSessions = subjects.reduce((sum, s) => sum + (s.sessionsCount || 0), 0);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Subjects</h1>
          <p className="text-muted-foreground mt-2">Manage your study subjects</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
              <DialogDescription>Create a new subject to track your study sessions</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Subject Name</Label>
                <Input
                  placeholder="e.g., Mathematics"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Icon (emoji)</Label>
                <Input
                  placeholder="e.g., 📐"
                  value={newSubject.icon}
                  onChange={(e) => setNewSubject({ ...newSubject, icon: e.target.value })}
                />
              </div>
              <div>
                <Label>Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={newSubject.color}
                    onChange={(e) => setNewSubject({ ...newSubject, color: e.target.value })}
                    className="w-20"
                  />
                  <Input
                    value={newSubject.color}
                    onChange={(e) => setNewSubject({ ...newSubject, color: e.target.value })}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
              <Button onClick={handleAddSubject} className="w-full">
                Add Subject
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}h</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => {
          const progress = ((subject.totalHours || 0) / (subject.goalHours || 1)) * 100;
          return (
            <Link key={subject.id} href={`/subjects/${subject.id}`}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: subject.color + '20' }}
                    >
                      {subject.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{subject.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {subject.sessionsCount} sessions
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {subject.totalHours}h / {subject.goalHours}h
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(progress, 100)}%`,
                          backgroundColor: subject.color,
                        }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Avg Session</div>
                        <div className="font-medium">{subject.averageSessionLength} min</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Goal</div>
                        <div className="font-medium">{subject.goalHours}h</div>
                      </div>
                    </div>
                  </div>

                  {/* Topics */}
                  {subject.topics && subject.topics.length > 0 && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">Topics</div>
                      <div className="flex flex-wrap gap-1">
                        {subject.topics.slice(0, 3).map((topic) => (
                          <span
                            key={topic}
                            className="text-xs px-2 py-1 rounded-md"
                            style={{
                              backgroundColor: subject.color + '20',
                              color: subject.color,
                            }}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

