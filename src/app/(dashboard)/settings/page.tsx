'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Save, CreditCard, Crown } from 'lucide-react';
import { vi } from '@/lib/i18n/vi';
import Link from 'next/link';

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success(vi.success.saved);
    setIsSubmitting(false);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{vi.settings.title}</h1>
        <p className="text-muted-foreground mt-2">{vi.settings.subtitle}</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="account">{vi.settings.account}</TabsTrigger>
          <TabsTrigger value="privacy">{vi.settings.privacy}</TabsTrigger>
          <TabsTrigger value="notifications">{vi.settings.notifications}</TabsTrigger>
          <TabsTrigger value="appearance">{vi.settings.appearance}</TabsTrigger>
          <TabsTrigger value="security">{vi.settings.security}</TabsTrigger>
          <TabsTrigger value="subscription">Đăng ký</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tài khoản</CardTitle>
              <CardDescription>Cập nhật thông tin tài khoản của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" />
              </div>
              <div>
                <Label htmlFor="username">Tên người dùng</Label>
                <Input id="username" defaultValue="johndoe" />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" type="tel" placeholder="+84 (123) 456-789" />
              </div>
              <div>
                <Label htmlFor="timezone">{vi.settings.timezone}</Label>
                <Select defaultValue="utc">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Giờ Đông (EST)</SelectItem>
                    <SelectItem value="pst">Giờ Thái Bình Dương (PST)</SelectItem>
                    <SelectItem value="ict">Giờ Đông Dương (ICT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSave} disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {vi.settings.saveChanges}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control who can see your information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground">Who can view your profile</p>
                </div>
                <Select defaultValue="public">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Email</Label>
                  <p className="text-sm text-muted-foreground">Display email on your profile</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Activity</Label>
                  <p className="text-sm text-muted-foreground">Display your recent activity</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Statistics</Label>
                  <p className="text-sm text-muted-foreground">Display your study statistics</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button onClick={handleSave} disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Manage your email notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Messages</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Connection Requests</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Group Invites</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Question Answers</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Achievements</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Weekly Digest</Label>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>Manage your push notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Push Notifications</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Messages</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Study Reminders</Label>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how StudyMate looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Theme</Label>
                <Select defaultValue="system">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Font Size</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label>Compact Mode</Label>
                <Switch />
              </div>
              <Button onClick={handleSave} disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Login Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified of new logins</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="pt-4">
                <Button variant="outline">Change Password</Button>
              </div>
              <div className="pt-4 border-t">
                <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Gói đăng ký
              </CardTitle>
              <CardDescription>Quản lý gói đăng ký và thanh toán của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Gói hiện tại: Free</h3>
                    <p className="text-sm text-muted-foreground">
                      Bạn đang sử dụng gói miễn phí
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                </div>
                <Link href="/subscription">
                  <Button className="w-full" size="lg">
                    <Crown className="h-4 w-4 mr-2" />
                    Nâng cấp gói Premium
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Lợi ích khi nâng cấp:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Truy cập không giới hạn AI Assistant
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Tạo và tham gia nhiều nhóm học hơn
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Phân tích chi tiết về tiến độ học tập
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Ưu tiên hỗ trợ khách hàng
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Không có quảng cáo
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-3">Lịch sử thanh toán</h4>
                <p className="text-sm text-muted-foreground">
                  Chưa có giao dịch nào
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

