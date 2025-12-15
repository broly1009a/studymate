'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Medal, Award, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

export default function CompetitionResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [competition, setCompetition] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchResultsData = async () => {
      try {
        setLoading(true);
        const [compRes, resultsRes] = await Promise.all([
          fetch(`/api/competitions/${id}`),
          fetch(`/api/competitions/${id}/results`),
        ]);

        const compData = await compRes.json();
        const resultsData = await resultsRes.json();

        if (compData.success) setCompetition(compData.data);
        if (resultsData.success) setResults(resultsData.data);
      } catch (error) {
        console.error('Failed to fetch results:', error);
        toast.error('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchResultsData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!competition) {
    return <div className="w-full">Competition not found</div>;
  }

  const handleDownloadCertificate = async () => {
    try {
      setDownloading(true);
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Certificate downloaded!');
    } catch (error) {
      console.error('Failed to download:', error);
      toast.error('Failed to download certificate');
    } finally {
      setDownloading(false);
    }
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
        <p className="text-muted-foreground mt-2">Final Results</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {results.map((result) => (
          <Card
            key={result.rank}
            className={result.rank === 1 ? 'border-yellow-500 bg-yellow-500/5' : ''}
          >
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {result.rank === 1 && <Trophy className="h-12 w-12 text-yellow-500" />}
                {result.rank === 2 && <Medal className="h-12 w-12 text-gray-400" />}
                {result.rank === 3 && <Medal className="h-12 w-12 text-amber-600" />}
              </div>
              <CardTitle className="text-2xl">#{result.rank}</CardTitle>
              <CardDescription>{result.prize}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Image
                src={result.avatar}
                alt={result.team}
                width={80}
                height={80}
                className="rounded-full mx-auto mb-3"
              />
              <h3 className="font-bold text-lg">{result.team}</h3>
              <div className="text-3xl font-bold text-primary mt-2">{result.score}</div>
              <p className="text-sm text-muted-foreground">points</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Competition Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">{competition.participantCount}</div>
              <div className="text-sm text-muted-foreground mt-1">Participants</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">{competition.teamCount}</div>
              <div className="text-sm text-muted-foreground mt-1">Teams</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">48</div>
              <div className="text-sm text-muted-foreground mt-1">Submissions</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">2850</div>
              <div className="text-sm text-muted-foreground mt-1">Top Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Your Achievement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
            <div>
              <h3 className="font-medium">Participation Certificate</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Thank you for participating in {competition.title}
              </p>
            </div>
            <Button onClick={handleDownloadCertificate} disabled={downloading}>
              {downloading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

