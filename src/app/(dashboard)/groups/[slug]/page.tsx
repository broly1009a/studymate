'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, Calendar, MessageSquare, FolderOpen, Settings, UserPlus, Lock, Globe, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    type: 'study_session',
    isVirtual: false,
    meetingLink: '',
  });

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

  const handleCreateEvent = async () => {
    if (!group) return;

    const token = localStorage.getItem('studymate_auth_token');
    if (!token) {
      toast.error('Please login to create events');
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`/api/groups/${slug}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventForm),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Event created successfully!');
        setShowCreateEvent(false);
        setEventForm({
          title: '',
          description: '',
          startTime: '',
          endTime: '',
          location: '',
          type: 'study_session',
          isVirtual: false,
          meetingLink: '',
        });
        // Refresh events
        const eventsRes = await fetch(`/api/groups/${slug}/events`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const eventsData = await eventsRes.json();
        if (eventsData.success) setEvents(eventsData.data);
      } else {
        toast.error(data.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Failed to create event:', error);
      toast.error('Failed to create event');
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>
                    Events and activities in this group
                  </CardDescription>
                </div>
                {isMember && (
                  <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Create New Event</DialogTitle>
                        <DialogDescription>
                          Create a new event for this group. All members will be notified.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Event Title</Label>
                          <Input
                            id="title"
                            value={eventForm.title}
                            onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter event title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={eventForm.description}
                            onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe the event"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="startTime">Start Time</Label>
                            <Input
                              id="startTime"
                              type="datetime-local"
                              value={eventForm.startTime}
                              onChange={(e) => setEventForm(prev => ({ ...prev, startTime: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="endTime">End Time (Optional)</Label>
                            <Input
                              id="endTime"
                              type="datetime-local"
                              value={eventForm.endTime}
                              onChange={(e) => setEventForm(prev => ({ ...prev, endTime: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={eventForm.location}
                            onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Physical location or 'Online'"
                          />
                        </div>
                        <div>
                          <Label htmlFor="type">Event Type</Label>
                          <Select value={eventForm.type} onValueChange={(value) => setEventForm(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="study_session">Study Session</SelectItem>
                              <SelectItem value="meeting">Meeting</SelectItem>
                              <SelectItem value="workshop">Workshop</SelectItem>
                              <SelectItem value="social">Social Event</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="isVirtual"
                            checked={eventForm.isVirtual}
                            onChange={(e) => setEventForm(prev => ({ ...prev, isVirtual: e.target.checked }))}
                          />
                          <Label htmlFor="isVirtual">This is a virtual event</Label>
                        </div>
                        {eventForm.isVirtual && (
                          <div>
                            <Label htmlFor="meetingLink">Meeting Link</Label>
                            <Input
                              id="meetingLink"
                              value={eventForm.meetingLink}
                              onChange={(e) => setEventForm(prev => ({ ...prev, meetingLink: e.target.value }))}
                              placeholder="Zoom, Google Meet, etc."
                            />
                          </div>
                        )}
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowCreateEvent(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateEvent} disabled={actionLoading}>
                            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Create Event
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
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