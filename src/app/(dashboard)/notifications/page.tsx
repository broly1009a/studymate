'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, Check, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Notification } from '@/types/dashboard';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'match',
    title: 'New Study Partner Match',
    message: 'You have a new study partner match for Mathematics. Check out their profile!',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    isRead: false,
    actionUrl: '/matches',
  },
  {
    id: '2',
    type: 'question',
    title: 'Answer to Your Question',
    message: 'Someone answered your question about calculus derivatives.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isRead: false,
    actionUrl: '/questions/123',
  },
  {
    id: '3',
    type: 'group',
    title: 'Group Invitation',
    message: 'You have been invited to join "Physics Study Group"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isRead: true,
    actionUrl: '/groups/456',
  },
  {
    id: '4',
    type: 'competition',
    title: 'Competition Starting Soon',
    message: 'The "Math Challenge 2025" competition starts in 2 hours!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    isRead: false,
    actionUrl: '/competitions/789',
  },
  {
    id: '5',
    type: 'system',
    title: 'Profile Update',
    message: 'Your profile has been successfully updated.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isRead: true,
    actionUrl: '/profile',
  },
  {
    id: '6',
    type: 'question',
    title: 'Question Upvoted',
    message: 'Your answer received 5 upvotes!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    isRead: true,
    actionUrl: '/questions/456',
  },
];

const typeLabels = {
  match: 'Kết nối',
  question: 'Câu hỏi',
  group: 'Nhóm',
  competition: 'Cuộc thi',
  system: 'Hệ thống',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | Notification['type']>('all');

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
    toast.success('Đã đánh dấu là đã đọc');
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('Đã đánh dấu tất cả là đã đọc');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Đã xóa thông báo');
  };

  const deleteAll = () => {
    setNotifications([]);
    toast.success('Đã xóa tất cả thông báo');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" />
            {vi.nav.notifications}
          </h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? `Bạn có ${unreadCount} thông báo chưa đọc` : 'Đã xem hết!'}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="mr-2 h-4 w-4" />
              Đánh dấu tất cả đã đọc
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="outline" onClick={deleteAll}>
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa tất cả
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="match">Kết nối</TabsTrigger>
          <TabsTrigger value="question">Câu hỏi</TabsTrigger>
          <TabsTrigger value="group">Nhóm</TabsTrigger>
          <TabsTrigger value="competition">Cuộc thi</TabsTrigger>
          <TabsTrigger value="system">Hệ thống</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Không có thông báo</h3>
              <p className="text-sm text-muted-foreground">
                {filter === 'all'
                  ? "Bạn đã xem hết! Quay lại sau để xem thông báo mới."
                  : `Không có thông báo ${typeLabels[filter as Notification['type']].toLowerCase()}.`}
              </p>
            </div>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 transition-colors ${
                !notification.isRead ? 'bg-primary/5 border-primary/20' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium ${!notification.isRead ? 'text-primary' : ''}`}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <Badge variant="secondary">
                      {typeLabels[notification.type]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                    </span>
                    {notification.actionUrl && (
                      <Link href={notification.actionUrl}>
                        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                          Xem chi tiết →
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination (placeholder) */}
      {filteredNotifications.length > 0 && (
        <div className="flex justify-center">
          <Button variant="outline">Tải thêm</Button>
        </div>
      )}
    </div>
  );
}

