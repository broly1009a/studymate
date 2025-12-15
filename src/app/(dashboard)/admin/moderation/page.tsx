'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, AlertTriangle, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AdminModerationPage() {
  const reports = [
    {
      id: '1',
      contentType: 'Question',
      contentId: 'q123',
      title: 'How to solve this algorithm problem?',
      reportedBy: 'user456',
      reason: 'Spam',
      status: 'pending',
      date: '2025-10-27',
    },
    {
      id: '2',
      contentType: 'Answer',
      contentId: 'a456',
      title: 'Answer to: What is binary search?',
      reportedBy: 'user789',
      reason: 'Inappropriate content',
      status: 'pending',
      date: '2025-10-27',
    },
    {
      id: '3',
      contentType: 'Comment',
      contentId: 'c789',
      title: 'Comment on: Study tips',
      reportedBy: 'user123',
      reason: 'Harassment',
      status: 'reviewed',
      date: '2025-10-26',
    },
  ];

  const handleApprove = (reportId: string) => {
    toast.success('Content approved');
  };

  const handleRemove = (reportId: string) => {
    toast.success('Content removed');
  };

  const handleWarn = (reportId: string) => {
    toast.success('User warned');
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="mb-2">← Back to Admin</Button>
        </Link>
        <h1 className="text-3xl font-bold">Content Moderation</h1>
        <p className="text-muted-foreground mt-2">Review reports and flagged content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter((r) => r.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Reviewed Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-3 mt-4">
              {reports
                .filter((r) => r.status === 'pending')
                .map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{report.contentType}</Badge>
                          <Badge variant="destructive">{report.reason}</Badge>
                        </div>
                        <h3 className="font-medium">{report.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Reported by {report.reportedBy} • {report.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(report.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemove(report.id)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWarn(report.id)}
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Warn User
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Content
                      </Button>
                    </div>
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="reviewed" className="space-y-3 mt-4">
              {reports
                .filter((r) => r.status === 'reviewed')
                .map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg opacity-60">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{report.contentType}</Badge>
                      <Badge>{report.status}</Badge>
                    </div>
                    <h3 className="font-medium">{report.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Reported by {report.reportedBy} • {report.date}
                    </p>
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="all" className="space-y-3 mt-4">
              {reports.map((report) => (
                <div key={report.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{report.contentType}</Badge>
                    <Badge variant={report.status === 'pending' ? 'destructive' : 'default'}>
                      {report.status}
                    </Badge>
                  </div>
                  <h3 className="font-medium">{report.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Reported by {report.reportedBy} • {report.date}
                  </p>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

