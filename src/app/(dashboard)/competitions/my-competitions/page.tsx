'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Calendar, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

export default function MyCompetitionsPage() {
  const [myCompetitions, setMyCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCompetitions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/competitions/my-competitions');
        const data = await response.json();
        if (data.success) {
          setMyCompetitions(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch my competitions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCompetitions();
  }, []);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Competitions</h1>
        <p className="text-muted-foreground mt-2">Track your competition participation</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Competitions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myCompetitions.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Ongoing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {myCompetitions.filter(c => c.status === 'ongoing').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">
                  {myCompetitions.filter(c => c.status === 'upcoming').length}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4 mt-6">
          {myCompetitions.map((competition) => (
            <Card key={competition.id}>
              <div className="flex">
                <div className="relative w-48 h-32">
                  <Image
                    src={competition.banner}
                    alt={competition.title}
                    fill
                    className="object-cover rounded-l-lg"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/competitions/${competition.id}`}>
                        <h3 className="text-xl font-bold hover:underline">{competition.title}</h3>
                      </Link>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(competition.startDate), 'MMM d, yyyy')}
                        </div>
                        {competition.teamName && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              Team: {competition.teamName}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={competition.status === 'ongoing' ? 'default' : 'secondary'}>
                        {competition.status}
                      </Badge>
                      <Link href={`/competitions/${competition.id}`}>
                        <Button size="sm">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <Card>
                <CardContent className="py-12 text-center">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Completed Competitions</h3>
                  <p className="text-muted-foreground">
                    Your completed competitions will appear here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
      </Tabs>
    </div>
  );
}

