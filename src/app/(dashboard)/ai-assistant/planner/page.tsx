'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Calendar, Clock, Target } from 'lucide-react';
import { toast } from 'sonner';

export default function AIStudyPlannerPage() {
  const [formData, setFormData] = useState({
    subject: '',
    goal: '',
    timeAvailable: '',
    difficulty: 'intermediate',
  });

  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

  const handleGenerate = () => {
    if (!formData.subject || !formData.goal || !formData.timeAvailable) {
      toast.error('Please fill in all fields');
      return;
    }

    // Simulate AI generation
    setGeneratedPlan({
      subject: formData.subject,
      goal: formData.goal,
      duration: formData.timeAvailable,
      schedule: [
        { day: 'Monday', topic: 'Introduction & Fundamentals', duration: '2 hours' },
        { day: 'Tuesday', topic: 'Core Concepts', duration: '2 hours' },
        { day: 'Wednesday', topic: 'Practice Problems', duration: '2 hours' },
        { day: 'Thursday', topic: 'Advanced Topics', duration: '2 hours' },
        { day: 'Friday', topic: 'Review & Assessment', duration: '2 hours' },
      ],
      resources: [
        'Recommended textbook: Chapter 1-5',
        'Online course: Introduction to ' + formData.subject,
        'Practice problems: 50 exercises',
      ],
    });

    toast.success('Study plan generated!');
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-yellow-500" />
          AI Study Planner
        </h1>
        <p className="text-muted-foreground mt-2">Generate personalized study plans with AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Plan Details</CardTitle>
            <CardDescription>Tell us what you want to learn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Subject *</Label>
              <Input
                placeholder="e.g., Data Structures"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Learning Goal *</Label>
              <Input
                placeholder="e.g., Master binary trees"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Time Available *</Label>
              <Select
                value={formData.timeAvailable}
                onValueChange={(value) => setFormData({ ...formData, timeAvailable: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-week">1 Week</SelectItem>
                  <SelectItem value="2-weeks">2 Weeks</SelectItem>
                  <SelectItem value="1-month">1 Month</SelectItem>
                  <SelectItem value="3-months">3 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Difficulty Level</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleGenerate} className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Plan
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {!generatedPlan ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Plan Generated Yet</h3>
                <p className="text-muted-foreground">
                  Fill in the details and click "Generate Plan" to create your personalized study plan
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{generatedPlan.subject} Study Plan</CardTitle>
                      <CardDescription className="mt-2">
                        Goal: {generatedPlan.goal}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{generatedPlan.duration}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="text-sm text-muted-foreground">Duration</div>
                        <div className="font-medium">{generatedPlan.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                      <Clock className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="text-sm text-muted-foreground">Daily Time</div>
                        <div className="font-medium">2 hours</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                      <Target className="h-5 w-5 text-purple-500" />
                      <div>
                        <div className="text-sm text-muted-foreground">Sessions</div>
                        <div className="font-medium">{generatedPlan.schedule.length}</div>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-medium mb-3">Study Schedule</h3>
                  <div className="space-y-2">
                    {generatedPlan.schedule.map((session: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{session.day}</div>
                          <div className="text-sm text-muted-foreground">{session.topic}</div>
                        </div>
                        <Badge variant="outline">{session.duration}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {generatedPlan.resources.map((resource: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-0.5">{index + 1}</Badge>
                        <span className="text-sm">{resource}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

