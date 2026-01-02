'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Filter,
  Award,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

interface ReputationEntry {
  _id: string;
  points: number;
  reason: string;
  type: 'earned' | 'lost';
  date: string;
}

interface ReputationStats {
  earned: number;
  earnedCount: number;
  lost: number;
  lostCount: number;
  net: number;
}

export default function ReputationHistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<ReputationEntry[]>([]);
  const [stats, setStats] = useState<ReputationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'all' | 'earned' | 'lost'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | '7days' | '30days' | '90days'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user?.id) return;
    fetchHistory();
  }, [user?.id, typeFilter, timeFilter, page]);

  const fetchHistory = async () => {
    try {
      setLoading(true);

      let url = `/api/reputation?userId=${user?.id}&page=${page}&limit=20`;
      
      if (typeFilter !== 'all') {
        url += `&type=${typeFilter}`;
      }

      if (timeFilter !== 'all') {
        const now = new Date();
        const days = timeFilter === '7days' ? 7 : timeFilter === '30days' ? 30 : 90;
        const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        url += `&startDate=${startDate.toISOString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setHistory(data.data.history);
        setStats(data.data.stats);
        setTotalPages(data.data.pagination.pages);
      } else {
        toast.error('Failed to load history');
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: 'earned' | 'lost') => {
    return type === 'earned' ? (
      <ArrowUpCircle className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getTypeColor = (type: 'earned' | 'lost') => {
    return type === 'earned' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reputation History</h1>
          <p className="text-muted-foreground">Track your points and achievements</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+{stats.earned}</div>
              <p className="text-xs text-muted-foreground">{stats.earnedCount} activities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Lost</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">-{stats.lost}</div>
              <p className="text-xs text-muted-foreground">{stats.lostCount} penalties</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Net Change</CardTitle>
              <Award className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.net >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {stats.net >= 0 ? '+' : ''}{stats.net}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.net >= 0 ? 'Great progress!' : 'Keep improving!'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Type</label>
              <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="earned">Earned Only</SelectItem>
                  <SelectItem value="lost">Lost Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Time Period</label>
              <Select value={timeFilter} onValueChange={(value: any) => setTimeFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>Your complete reputation history</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No activity yet</p>
              <p className="text-sm text-muted-foreground">
                Start studying to earn reputation points!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((entry) => (
                <div
                  key={entry._id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getTypeIcon(entry.type)}
                    <div className="flex-1">
                      <p className="font-medium">{entry.reason}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(entry.date), 'PPp')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant={entry.type === 'earned' ? 'default' : 'destructive'}
                    className="ml-4"
                  >
                    <span className={`text-lg font-bold ${getTypeColor(entry.type)}`}>
                      {entry.type === 'earned' ? '+' : '-'}{entry.points}
                    </span>
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
