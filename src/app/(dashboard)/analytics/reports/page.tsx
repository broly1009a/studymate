'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

function DownloadButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <Button onClick={onClick}>
      {children}
    </Button>
  );
}

function OutlineButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <Button variant="outline" onClick={onClick}>
      {children}
    </Button>
  );
}

export default function PerformanceReportsPage() {
  const reports = [
    {
      id: '1',
      title: 'October 2025 Performance Report',
      period: 'Oct 1 - Oct 27, 2025',
      metrics: {
        totalHours: 127.5,
        goalsCompleted: 8,
        averageScore: 85,
        improvement: '+12%',
      },
      status: 'available',
    },
    {
      id: '2',
      title: 'September 2025 Performance Report',
      period: 'Sep 1 - Sep 30, 2025',
      metrics: {
        totalHours: 114,
        goalsCompleted: 7,
        averageScore: 82,
        improvement: '+8%',
      },
      status: 'available',
    },
  ];

  const handleDownload = (reportId: string) => {
    toast.success('Report downloaded successfully!');
  };

  const handleExportAll = () => {
    toast.success('All reports exported successfully!');
  };

  const handleViewDetails = (reportId: string) => {
    toast.info('Viewing report details...');
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Performance Reports</h1>
          <p className="text-muted-foreground mt-2">Track your progress over time</p>
        </div>
        <DownloadButton onClick={handleExportAll}>
          <Download className="h-4 w-4 mr-2" />
          Export All
        </DownloadButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127.5 hrs</div>
            <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+12%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Goals Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8/12</div>
            <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>67%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+3%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Consistency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22/27</div>
            <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>81%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{report.title}</CardTitle>
                  <CardDescription className="mt-2">{report.period}</CardDescription>
                </div>
                <Badge variant="secondary">{report.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Study Hours</div>
                  <div className="text-xl font-bold mt-1">{report.metrics.totalHours}</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Goals</div>
                  <div className="text-xl font-bold mt-1">{report.metrics.goalsCompleted}</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Avg. Score</div>
                  <div className="text-xl font-bold mt-1">{report.metrics.averageScore}%</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Improvement</div>
                  <div className="text-xl font-bold text-green-500 mt-1">{report.metrics.improvement}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <OutlineButton onClick={() => handleDownload(report.id)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </OutlineButton>
                <OutlineButton onClick={() => handleViewDetails(report.id)}>
                  <FileText className="h-4 w-4 mr-2" />
                  View Details
                </OutlineButton>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

