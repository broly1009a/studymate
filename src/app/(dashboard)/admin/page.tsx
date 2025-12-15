'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, Trophy, AlertCircle, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total Users', value: '12,458', change: '+12%', icon: Users, color: 'text-blue-500' },
    { label: 'Active Users', value: '8,234', change: '+8%', icon: Activity, color: 'text-green-500' },
    { label: 'Questions', value: '3,567', change: '+15%', icon: MessageSquare, color: 'text-purple-500' },
    { label: 'Competitions', value: '45', change: '+5%', icon: Trophy, color: 'text-yellow-500' },
  ];

  const reports = [
    { id: '1', type: 'Question', reason: 'Spam', reporter: 'user123', date: '2025-10-27' },
    { id: '2', type: 'Answer', reason: 'Inappropriate', reporter: 'user456', date: '2025-10-27' },
    { id: '3', type: 'Comment', reason: 'Harassment', reporter: 'user789', date: '2025-10-26' },
  ];

  const systemHealth = [
    { metric: 'API Response Time', value: '45ms', status: 'good' },
    { metric: 'Error Rate', value: '0.2%', status: 'good' },
    { metric: 'Server Load', value: '35%', status: 'good' },
    { metric: 'Database', value: 'Healthy', status: 'good' },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Platform management and monitoring</p>
        </div>
        <Badge variant="outline" className="text-green-500 border-green-500">
          System Healthy
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-sm text-green-500 mt-1">
                <TrendingUp className="h-4 w-4" />
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Reports</CardTitle>
              <Link href="/admin/moderation">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            <CardDescription>Content moderation queue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{report.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {report.reason} • by {report.reporter}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Review</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Real-time system metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemHealth.map((item) => (
                <div key={item.metric} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="font-medium">{item.metric}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.value}</span>
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/users">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 mb-3 text-blue-500" />
              <h3 className="font-semibold text-lg">User Management</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Manage users, roles, and permissions
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/moderation">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <AlertCircle className="h-8 w-8 mb-3 text-red-500" />
              <h3 className="font-semibold text-lg">Content Moderation</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Review reports and flagged content
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/settings">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <Activity className="h-8 w-8 mb-3 text-purple-500" />
              <h3 className="font-semibold text-lg">System Settings</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Configure platform settings
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

