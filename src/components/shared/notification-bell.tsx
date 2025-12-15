'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import type { Notification } from '@/types/dashboard';

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'match',
    title: 'New Study Partner Match',
    message: 'You have a new study partner match for Mathematics',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    isRead: false,
    actionUrl: '/matches',
  },
  {
    id: '2',
    type: 'question',
    title: 'Answer to Your Question',
    message: 'Someone answered your question about calculus',
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
];

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-auto p-0 text-xs text-primary hover:text-primary/80"
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                asChild
              >
                <Link href={notification.actionUrl || '/notifications'}>
                  <div className="flex w-full items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={cn(
                          "text-sm font-medium",
                          !notification.isRead && "text-primary"
                        )}>
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.preventDefault();
                            markAsRead(notification.id);
                          }}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.preventDefault();
                          deleteNotification(notification.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/notifications" className="w-full text-center cursor-pointer">
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

