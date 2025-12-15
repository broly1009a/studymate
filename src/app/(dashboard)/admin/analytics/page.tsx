'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Users, MessageSquare, BookOpen, Download } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AdminAnalyticsPage() {
  const handleExport = () => {
    toast.success('Report exported successfully!');
  };

  const metrics = [
    { label: 'User Growth', value: '+12.5%', icon: Users, color: 'text-blue-500' },
    { label: 'Engagement Rate', value: '68%', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Questions Posted', value: '+15%', icon: MessageSquare, color: 'text-purple-500' },
    { label: 'Study Sessions', value: '+8%', icon: BookOpen, color: 'text-yellow-500' },
  ];

  const popularFeatures = [
    { name: 'Q&A Forum', usage: '85%', trend: '+5%' },
    { name: 'Study Sessions', usage: '72%', trend: '+8%' },
    { name: 'Study Groups', usage: '68%', trend: '+12%' },
    { name: 'Competitions', usage: '45%', trend: '+3%' },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="mb-2">← Back to Admin</Button>
          </Link>
          <h1 className="text-3xl font-bold">Platform Analytics</h1>
          <p className="text-muted-foreground mt-2">Platform metrics and insights</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="7days">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Popular Features</CardTitle>
            <CardDescription>Feature usage statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularFeatures.map((feature) => (
                <div key={feature.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{feature.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-500">{feature.trend}</span>
                      <span className="text-sm text-muted-foreground">{feature.usage}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-accent rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: feature.usage }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>System performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Avg. Response Time</div>
                  <div className="text-sm text-muted-foreground">API endpoints</div>
                </div>
                <div className="text-lg font-bold">45ms</div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Error Rate</div>
                  <div className="text-sm text-muted-foreground">Last 24 hours</div>
                </div>
                <div className="text-lg font-bold">0.2%</div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Uptime</div>
                  <div className="text-sm text-muted-foreground">Last 30 days</div>
                </div>
                <div className="text-lg font-bold">99.9%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

