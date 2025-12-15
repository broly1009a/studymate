'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Medal, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';

export default function LeaderboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [competition, setCompetition] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const [compRes, leaderRes] = await Promise.all([
          fetch(`/api/competitions/${id}`),
          fetch(`/api/competitions/${id}/leaderboard`),
        ]);

        const compData = await compRes.json();
        const leaderData = await leaderRes.json();

        if (compData.success) setCompetition(compData.data);
        if (leaderData.success) setLeaderboard(leaderData.data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        toast.error('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!competition) {
    return <div className="w-full">Không tìm thấy cuộc thi</div>;
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
    return null;
  };

  return (
    <div className="w-full">
      <Link href={`/competitions/${id}`}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Competition
        </Button>
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{competition.title}</h1>
        <p className="text-muted-foreground mt-2">Leaderboard</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center gap-4 p-4 border rounded-lg ${
                  entry.rank <= 3 ? 'bg-accent/50' : ''
                }`}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted font-bold">
                  {getRankIcon(entry.rank) || `#${entry.rank}`}
                </div>
                
                <Image
                  src={entry.avatar}
                  alt={entry.team}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                
                <div className="flex-1">
                  <h3 className="font-medium">{entry.team}</h3>
                  <p className="text-sm text-muted-foreground">{entry.members} members</p>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold">{entry.score}</div>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
                
                {entry.rank <= 3 && (
                  <Badge variant="outline" className="ml-2">
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

