'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Target, TrendingUp, AlertCircle } from 'lucide-react';

export default function InsightsPage() {
  const insights = [
    {
      id: '1',
      type: 'success',
      icon: TrendingUp,
      title: 'Strong Progress in Computer Science',
      description: 'You\'ve increased your study time by 25% this month. Your consistency in algorithms is paying off!',
      action: 'Keep it up',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      id: '2',
      type: 'recommendation',
      icon: Lightbulb,
      title: 'Optimize Your Study Schedule',
      description: 'Based on your patterns, you\'re most productive between 2-4 PM. Consider scheduling difficult topics during this time.',
      action: 'View patterns',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      id: '3',
      type: 'goal',
      icon: Target,
      title: 'Goal Achievement Opportunity',
      description: 'You\'re 80% towards your monthly goal. Just 2 more study sessions to reach it!',
      action: 'View goals',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      id: '4',
      type: 'warning',
      icon: AlertCircle,
      title: 'Mathematics Needs Attention',
      description: 'Your study time in Mathematics has decreased by 15%. Consider dedicating more time to maintain balance.',
      action: 'Create plan',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
  ];

  const recommendations = [
    'Take a 5-minute break every 25 minutes for better retention',
    'Review your notes within 24 hours of studying for better memory',
    'Join a study group for subjects you find challenging',
    'Set specific, measurable goals for each study session',
  ];

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Insights & Recommendations</h1>
        <p className="text-muted-foreground mt-2">Personalized suggestions to improve your learning</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {insights.map((insight) => (
          <Card key={insight.id} className={insight.bgColor}>
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${insight.bgColor}`}>
                  <insight.icon className={`h-5 w-5 ${insight.color}`} />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{insight.title}</CardTitle>
                  <CardDescription className="mt-2">{insight.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <button className={`text-sm font-medium ${insight.color} hover:underline`}>
                {insight.action} →
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Study Tips & Best Practices
          </CardTitle>
          <CardDescription>Evidence-based recommendations for effective learning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <Badge variant="outline" className="mt-0.5">{index + 1}</Badge>
                <p className="text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Weekly Focus Areas</CardTitle>
          <CardDescription>Suggested topics to prioritize this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">High Priority</h4>
              <div className="space-y-2">
                <Badge variant="destructive">Mathematics - Calculus</Badge>
                <Badge variant="destructive">Physics - Mechanics</Badge>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Medium Priority</h4>
              <div className="space-y-2">
                <Badge variant="secondary">Algorithms - Sorting</Badge>
                <Badge variant="secondary">Chemistry - Organic</Badge>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Maintenance</h4>
              <div className="space-y-2">
                <Badge variant="outline">Data Structures</Badge>
                <Badge variant="outline">Linear Algebra</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

