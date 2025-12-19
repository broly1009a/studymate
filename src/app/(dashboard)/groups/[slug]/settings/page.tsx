'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Trash, Loader2, Settings as SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';

export default function GroupSettingsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [settings, setSettings] = useState({
    notifications: true,
    emailDigest: true,
    allowInvites: true,
    showActivity: true,
  });

  useEffect(() => {
    const fetchGroup = async () => {
      const token = localStorage.getItem('studymate_auth_token');
      if (!token) {
        toast.error('Please login to access group settings');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/groups/${slug}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setGroup(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch group:', error);
        toast.error('Failed to load group');
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [slug]);

  const handleLeaveGroup = async () => {
    if (!group) return;

    const token = localStorage.getItem('studymate_auth_token');
    if (!token) {
      toast.error('Please login to leave groups');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`/api/groups/${slug}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Successfully left the group');
        router.push('/groups');
      } else {
        toast.error(data.message || 'Failed to leave group');
      }
    } catch (error) {
      console.error('Failed to leave group:', error);
      toast.error('Failed to leave group');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!group) return;

    if (!confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`/api/groups/${slug}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Group deleted successfully');
        router.push('/groups');
      } else {
        toast.error(data.message || 'Failed to delete group');
      }
    } catch (error) {
      console.error('Failed to delete group:', error);
      toast.error('Failed to delete group');
    } finally {
      setSubmitting(false);
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

  const isCreator = group.creatorId?.toString() === '507f1f77bcf86cd799439011'; // Mock user ID

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href={`/groups/${slug}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Group
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{group.name} - Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your group preferences
          </p>
        </div>
      </div>

      {/* Settings */}
      <div className="grid gap-6">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="h-5 w-5 mr-2" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for new messages and events
                </p>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, notifications: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailDigest">Email Digest</Label>
                <p className="text-sm text-muted-foreground">
                  Receive weekly email summaries of group activity
                </p>
              </div>
              <Switch
                id="emailDigest"
                checked={settings.emailDigest}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, emailDigest: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Group Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Group Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allowInvites">Allow Member Invites</Label>
                <p className="text-sm text-muted-foreground">
                  Let members invite others to join the group
                </p>
              </div>
              <Switch
                id="allowInvites"
                checked={settings.allowInvites}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, allowInvites: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showActivity">Show Activity</Label>
                <p className="text-sm text-muted-foreground">
                  Display group activity in the dashboard
                </p>
              </div>
              <Switch
                id="showActivity"
                checked={settings.showActivity}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, showActivity: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Leave Group</h4>
                <p className="text-sm text-muted-foreground">
                  You will no longer have access to this group's content
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleLeaveGroup}
                disabled={submitting || isCreator}
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Leave Group
              </Button>
            </div>

            {isCreator && (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-destructive">Delete Group</h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete this group and all its content
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDeleteGroup}
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash className="h-4 w-4 mr-2" />}
                  Delete Group
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}