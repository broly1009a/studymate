'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, MessageSquare, Calendar, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { vi } from '@/lib/i18n/vi';

export default function MyGroupsPage() {
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyGroups = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/groups/my-groups');
        const data = await response.json();
        if (data.success) {
          setMyGroups(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch my groups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyGroups();
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Groups</h1>
          <p className="text-muted-foreground mt-2">Groups you're a member of</p>
        </div>
        <Link href="/groups/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">My Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myGroups.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Unread Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">
                  {myGroups.reduce((sum, g) => sum + (g.unreadMessages || 0), 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {myGroups.reduce((sum, g) => sum + (g.upcomingEvents || 0), 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Groups List */}
          <div className="space-y-4">
        {myGroups.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Groups Yet</h3>
              <p className="text-muted-foreground mb-4">
                Join or create a group to start learning together
              </p>
              <div className="flex gap-2 justify-center">
                <Link href="/groups">
                  <Button variant="outline">Browse Groups</Button>
                </Link>
                <Link href="/groups/new">
                  <Button>Create Group</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          myGroups.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Image
                    src={group.avatar}
                    alt={group.name}
                    width={64}
                    height={64}
                    className="rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/groups/${group.slug}`}>
                          <CardTitle className="text-xl hover:underline cursor-pointer">
                            {group.name}
                          </CardTitle>
                        </Link>
                        <CardDescription className="mt-2 line-clamp-2">
                          {group.description}
                        </CardDescription>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="secondary">{group.category}</Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            {group.memberCount} members
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/groups/${group.slug}/chat`}>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Chat
                            {group.unreadMessages! > 0 && (
                              <Badge className="ml-2 bg-blue-500">{group.unreadMessages}</Badge>
                            )}
                          </Button>
                        </Link>
                        <Link href={`/groups/${group.slug}/calendar`}>
                          <Button variant="outline" size="sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            Events
                            {group.upcomingEvents! > 0 && (
                              <Badge className="ml-2 bg-green-500">{group.upcomingEvents}</Badge>
                            )}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
          </div>
        </>
      )}
    </div>
  );
}

