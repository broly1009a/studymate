'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  UsersRound,
  Trophy,
  Calendar,
  BookOpen,
  Target,
  BarChart3,
  Bot,
  StickyNote,
  PenSquare,
  Home,
  MessageCircle,
} from 'lucide-react';
import { vi } from '@/lib/i18n/vi';

// Main navigation items (kept in sidebar)
const navigation = [
  {
    name: 'Trang chủ',
    href: '/home',
    icon: Home,
  },
  {
    name: 'Bạn học',
    href: '/matches',
    icon: Users,
  },
  {
    name: 'Tin nhắn',
    href: '/messages',
    icon: MessageCircle,
  },
  {
    name: 'Diễn đàn',
    href: '/forum',
    icon: MessageSquare,
  },
  {
    name: 'Nhóm học',
    href: '/groups',
    icon: UsersRound,
  },
  {
    name: 'Cuộc thi',
    href: '/competitions',
    icon: Trophy,
  },
  {
    name: 'Blog',
    href: '/blog',
    icon: PenSquare,
  },
];

// Quick access items (moved to header)
export const quickAccessItems = [
  {
    name: 'Lịch',
    href: '/calendar',
    icon: Calendar,
  },
  {
    name: 'Phiên học',
    href: '/study-sessions',
    icon: BookOpen,
  },
  {
    name: 'Mục tiêu',
    href: '/goals',
    icon: Target,
  },
  {
    name: 'Phân tích',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Ghi chú',
    href: '/notes',
    icon: StickyNote,
  },
  {
    name: 'AI',
    href: '/ai-assistant',
    icon: Bot,
  },
];

export function Sidebar() {
  // Hide sidebar for all pages - navigation is now in header
  return null;
}

