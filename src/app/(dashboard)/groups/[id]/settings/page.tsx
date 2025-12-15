'use client';

import { use, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getGroupById } from '@/lib/mock-data/groups';
import { ArrowLeft, Trash } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';

export default function GroupSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const group = getGroupById(id);

  const [settings, setSettings] = useState({
    notifications: true,
    emailDigest: true,
    allowInvites: true,
    showActivity: true,
  });

  if (!group) {
    return <div className="w-full">Không tìm thấy nhóm</div>;
  }

  const handleSave = () => {
    toast.success('Đã lưu cài đặt thành công!');
  };

  const handleLeave = () => {
    toast.success('Bạn đã rời khỏi nhóm');
  };

  const handleDelete = () => {
    toast.success('Đã xóa nhóm');
  };

  return (
    <div className="w-full">
      <Link href={`/groups/${id}`}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Group
        </Button>
      </Link>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Receive notifications for new messages and events
                </p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label>Email Digest</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Receive daily email summary of group activity
                </p>
              </div>
              <Switch
                checked={settings.emailDigest}
                onCheckedChange={(checked) => setSettings({ ...settings, emailDigest: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label>Allow Member Invites</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Let members invite others to the group
                </p>
              </div>
              <Switch
                checked={settings.allowInvites}
                onCheckedChange={(checked) => setSettings({ ...settings, allowInvites: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label>Show Activity Status</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Display your online status to group members
                </p>
              </div>
              <Switch
                checked={settings.showActivity}
                onCheckedChange={(checked) => setSettings({ ...settings, showActivity: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-yellow-500/50 rounded-lg">
              <div>
                <Label>Leave Group</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  You can rejoin later if the group is public
                </p>
              </div>
              <Button variant="outline" onClick={handleLeave}>
                Leave
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border border-red-500/50 rounded-lg">
              <div>
                <Label className="text-red-500">Delete Group</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Permanently delete this group and all its data
                </p>
              </div>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full">
          Save Settings
        </Button>
      </div>
    </div>
  );
}

