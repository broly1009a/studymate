'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'StudyMate',
    maintenanceMode: false,
    userRegistration: true,
    emailVerification: true,
    maxFileSize: '10',
    apiRateLimit: '100',
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="mb-2">← Back to Admin</Button>
        </Link>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-muted-foreground mt-2">Configure platform settings</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Site Name</Label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Maintenance Mode</div>
                  <div className="text-sm text-muted-foreground">
                    Disable access to the platform
                  </div>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, maintenanceMode: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Toggles</CardTitle>
              <CardDescription>Enable or disable platform features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">User Registration</div>
                  <div className="text-sm text-muted-foreground">
                    Allow new users to register
                  </div>
                </div>
                <Switch
                  checked={settings.userRegistration}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, userRegistration: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Email Verification</div>
                  <div className="text-sm text-muted-foreground">
                    Require email verification for new accounts
                  </div>
                </div>
                <Switch
                  checked={settings.emailVerification}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailVerification: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Storage Settings</CardTitle>
              <CardDescription>Configure file upload limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Max File Size (MB)</Label>
                <Input
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => setSettings({ ...settings, maxFileSize: e.target.value })}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Maximum file size for uploads
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>Configure API rate limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Rate Limit (requests/minute)</Label>
                <Input
                  type="number"
                  value={settings.apiRateLimit}
                  onChange={(e) => setSettings({ ...settings, apiRateLimit: e.target.value })}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Maximum API requests per minute per user
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2 mt-6">
        <Button onClick={handleSave} className="flex-1">Save Changes</Button>
        <Button variant="outline">Reset to Defaults</Button>
      </div>
    </div>
  );
}

