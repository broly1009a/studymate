'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, Calendar, MessageSquare, FolderOpen, Settings, UserPlus, Lock, Globe, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function GroupDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [group, setGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchGroupData = async () => {
      const token = localStorage.getItem('studymate_auth_token');
      if (!token) {
        toast.error('Please login to view group details');
        return;
      }

      try {
        setLoading(true);
        const groupRes = await fetch(`/api/groups/${slug}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const groupData = await groupRes.json();

        if (groupData.success) {
          setGroup(groupData.data);

          // Check membership status by making an API call to get current user
          // We'll check if the current user is a member of this group
          const userRes = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const userData = await userRes.json();

          if (userData.success) {
            const currentUserId = userData.data._id;
            const isMemberOfGroup = groupData.data.members?.some((member: any) => member._id === currentUserId);
            const isAdminOfGroup = groupData.data.admins?.some((admin: any) => admin._id === currentUserId);

            setIsMember(isMemberOfGroup || false);
            setIsAdmin(isAdminOfGroup || false);
          }

          // Fetch members and events using the slug
          const [membersRes, eventsRes] = await Promise.all([
            fetch(`/api/groups/${slug}/members`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }),
            fetch(`/api/groups/${slug}/events`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }),
          ]);

          const membersData = await membersRes.json();
          const eventsData = await eventsRes.json();

          if (membersData.success) setMembers(membersData.data);
          if (eventsData.success) setEvents(eventsData.data);
        }
      } catch (error) {
        console.error('Failed to fetch group data:', error);
        toast.error('Failed to load group data');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [slug]);

  const handleJoinGroup = async () => {
    if (!group) return;

    const token = localStorage.getItem('studymate_auth_token');
    if (!token) {
      toast.error('Please login to join groups');
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`/api/groups/${slug}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Successfully joined the group!');
        setIsMember(true);
        // Refresh group data
        const groupRes = await fetch(`/api/groups/${slug}`);
        const groupData = await groupRes.json();
        if (groupData.success) setGroup(groupData.data);
      } else {
        toast.error(data.message || 'Failed to join group');
      }
    } catch (error) {
      console.error('Failed to join group:', error);
      toast.error('Failed to join group');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!group) return;

    const token = localStorage.getItem('studymate_auth_token');
    if (!token) {
      toast.error('Please login to leave groups');
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`/api/groups/${slug}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Successfully left the group');
        setIsMember(false);
        // Refresh group data
        const groupRes = await fetch(`/api/groups/${slug}`);
        const groupData = await groupRes.json();
        if (groupData.success) setGroup(groupData.data);
      } else {
        toast.error(data.message || 'Failed to leave group');
      }
    } catch (error) {
      console.error('Failed to leave group:', error);
      toast.error('Failed to leave group');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-muted-foreground">Group not found</h2>
        <p className="text-muted-foreground mt-2">The group you're looking for doesn't exist.</p>
        <Link href="/groups">
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Groups
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/groups">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Groups
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{group.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant={group.isPublic ? 'default' : 'secondary'}>
                {group.isPublic ? <Globe className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                {group.isPublic ? 'Public' : 'Private'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {group.members_count} members
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isMember ? (
            <>
              <Link href={`/groups/${slug}/chat`}>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </Button>
              </Link>
              {isAdmin && (
                <Link href={`/groups/${slug}/settings`}>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                onClick={handleLeaveGroup}
                disabled={actionLoading}
              >
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Leave Group
              </Button>
            </>
          ) : (
            <Button onClick={handleJoinGroup} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
              Join Group
            </Button>
          )}
        </div>
      </div>

      {/* Group Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
          <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About this group</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{group.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Category</h4>
                  <p className="text-sm text-muted-foreground">{group.category}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Created</h4>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(group.createdAt), 'PPP')}
                  </p>
                </div>
              </div>

              {group.subjects && group.subjects.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Subjects</h4>
                  <div className="flex flex-wrap gap-2">
                    {group.subjects.map((subject: string) => (
                      <Badge key={subject} variant="outline">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                {group.members_count} members in this group
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.slice(0, 10).map((member: any) => (
                  <div key={member._id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{member.fullName || 'Anonymous'}</p>
                      <p className="text-sm text-muted-foreground">
                        Joined {format(new Date(member.joinedAt || Date.now()), 'PP')}
                      </p>
                    </div>
                  </div>
                ))}
                {members.length > 10 && (
                  <Link href={`/groups/${slug}/members`}>
                    <Button variant="outline" className="w-full">
                      View All Members ({members.length})
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Events and activities in this group
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.slice(0, 5).map((event: any) => (
                  <div key={event._id} className="flex items-start space-x-3 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {format(new Date(event.date), 'PPP')} at {event.time}
                      </p>
                    </div>
                  </div>
                ))}
                {events.length > 5 && (
                  <Link href={`/groups/${slug}/events`}>
                    <Button variant="outline" className="w-full">
                      View All Events ({events.length})
                    </Button>
                  </Link>
                )}
                {events.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No upcoming events
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
              <CardDescription>
                Shared files and resources for this group
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No resources shared yet</p>
                <Link href={`/groups/${slug}/resources`}>
                  <Button className="mt-4">
                    Browse Resources
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Group Chat</CardTitle>
              <CardDescription>
                Communicate with group members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Join the conversation</p>
                <Link href={`/groups/${slug}/chat`}>
                  <Button className="mt-4">
                    Open Chat
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}