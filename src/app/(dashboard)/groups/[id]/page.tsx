'use client';

import { use, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getGroupById, getGroupMembers, getGroupEvents } from '@/lib/mock-data/groups';
import { ArrowLeft, Users, Calendar, MessageSquare, FolderOpen, Settings, UserPlus, Lock, Globe } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const group = getGroupById(id);
  const members = group ? getGroupMembers(group.id) : [];
  const events = group ? getGroupEvents(group.id) : [];
  const [activeTab, setActiveTab] = useState('about');

  if (!group) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Group Not Found</h1>
          <p className="text-muted-foreground mb-4">The group you're looking for doesn't exist.</p>
          <Link href="/groups">
            <Button>Back to Groups</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleJoinGroup = () => {
    toast.success('Joined group successfully!');
  };

  const handleLeaveGroup = () => {
    toast.success('Left group');
  };

  return (
    <div className="w-full">
      <Link href="/groups">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Groups
        </Button>
      </Link>

      {/* Header */}
      <div className="relative h-48 rounded-lg overflow-hidden mb-6">
        <Image
          src={group.coverImage}
          alt={group.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Group Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Image
                  src={group.avatar}
                  alt={group.name}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{group.name}</CardTitle>
                      <CardDescription className="mt-2">{group.description}</CardDescription>
                      <div className="flex items-center gap-2 mt-3">
                        {group.visibility === 'private' ? (
                          <Badge variant="secondary">
                            <Lock className="h-3 w-3 mr-1" />
                            Private
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Globe className="h-3 w-3 mr-1" />
                            Public
                          </Badge>
                        )}
                        <Badge variant="outline">{group.category}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {group.isJoined ? (
                        <>
                          <Button variant="outline" onClick={handleLeaveGroup}>
                            Leave Group
                          </Button>
                          <Link href={`/groups/${group.id}/settings`}>
                            <Button variant="outline" size="icon">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <Button onClick={handleJoinGroup}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Join Group
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>About This Group</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-muted-foreground">{group.description}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Subjects</h4>
                    <div className="flex flex-wrap gap-2">
                      {group.subjects.map((subject) => (
                        <Badge key={subject} variant="secondary">{subject}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Created</h4>
                    <p className="text-muted-foreground">
                      {format(new Date(group.createdAt), 'MMMM d, yyyy')} by {group.ownerName}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="members" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Members ({members.length})</CardTitle>
                    <Button size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Image
                            src={member.userAvatar}
                            alt={member.userName}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div>
                            <div className="font-medium">{member.userName}</div>
                            <div className="text-sm text-muted-foreground">
                              {member.reputation} reputation
                            </div>
                          </div>
                        </div>
                        <Badge variant={
                          member.role === 'owner' ? 'default' :
                          member.role === 'admin' ? 'secondary' :
                          'outline'
                        }>
                          {member.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Upcoming Events</CardTitle>
                    <Link href={`/groups/${group.id}/events/new`}>
                      <Button size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Create Event
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {events.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No upcoming events
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {events.map((event) => (
                        <Link key={event.id} href={`/groups/${group.id}/events/${event.id}`}>
                          <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{event.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {event.description}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                  <span>{format(new Date(event.startTime), 'MMM d, h:mm a')}</span>
                                  <span>•</span>
                                  <span>{event.location}</span>
                                </div>
                              </div>
                              <Badge variant="outline">{event.type.replace('_', ' ')}</Badge>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Resources</CardTitle>
                    <Button size="sm">
                      <FolderOpen className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    No resources yet
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Group Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Members</div>
                <div className="text-2xl font-bold">{group.memberCount}/{group.maxMembers}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Upcoming Events</div>
                <div className="text-2xl font-bold">{events.length}</div>
              </div>
              {group.isJoined && group.unreadMessages! > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground">Unread Messages</div>
                  <div className="text-2xl font-bold text-blue-500">{group.unreadMessages}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {group.isJoined && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/groups/${group.id}/chat`}>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Group Chat
                  </Button>
                </Link>
                <Link href={`/groups/${group.id}/calendar`}>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendar
                  </Button>
                </Link>
                <Link href={`/groups/${group.id}/resources`}>
                  <Button variant="outline" className="w-full justify-start">
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Resources
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

