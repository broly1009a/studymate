'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  User,
  LogOut,
  Settings,
  MessageCircle,
  UsersRound,
  Trophy,
  MessageSquare,
  Crown,
  UserPlus,
  Home,
  Users as UsersIcon,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { NotificationBell } from './notification-bell';
import { vi } from '@/lib/i18n/vi';
import { cn } from '@/lib/utils';
import { API_URL } from '@/lib/constants';

const mainNavigation = [
  { name: 'Trang chủ', href: '/home', icon: Home },
  { name: 'Bạn học', href: '/matches', icon: UsersIcon },
  { name: 'Nhóm học', href: '/groups', icon: UsersRound },
  { name: 'Sự kiện', href: '/competitions', icon: Trophy },
  { name: 'Diễn đàn', href: '/forum', icon: MessageSquare },
];

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchPendingCount = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(
          `${API_URL}/partner-requests?userId=${user.id}&type=received&status=pending`
        );
        const data = await res.json();
        if (data.success) setPendingRequestsCount(data.data.length);
      } catch {}
    };

    fetchPendingCount();
    const i = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(i);
  }, [user?.id]);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const getAvatarUrl = () =>
    user?.avatar || user?.profileImages?.[0]?.url;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="relative mx-auto flex h-16 max-w-[1440px] items-center px-6">

        {/* LEFT – LOGO */}
        <Link
          href="/home"
          className="flex items-center gap-2 font-bold text-lg"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#6b63ff] to-[#5a52e6] flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <span className="text-gray-900">StudyMate</span>
        </Link>

        {/* CENTER – NAVIGATION */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 lg:flex items-center gap-8">
          {mainNavigation.map(item => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex items-center gap-1 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-[#6b63ff]'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}

                {isActive && (
                  <span className="absolute -bottom-4 left-0 h-[2px] w-full rounded-full bg-[#6b63ff]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT – ACTIONS */}
        <div className="ml-auto flex items-center gap-3">
       {/* Premium */}
<Link href="/subscription" className="hidden md:block">
  <div
    className="
      rounded-xl p-[2px]
      bg-gradient-to-b from-[#8f85ff] to-[#5a52e6]
      shadow-[0_8px_20px_rgba(90,82,230,0.45)]
      hover:shadow-[0_10px_26px_rgba(90,82,230,0.6)]
      transition-all
    "
  >
    <div
      className="
        flex items-center gap-2
        rounded-xl px-6 py-2
        text-sm font-bold tracking-wide text-white
        bg-gradient-to-b from-[#9b92ff] to-[#6b63ff]
        shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]
        hover:brightness-110
        active:translate-y-[1px]
        transition-all
      "
    >
      PREMIUM
      <Crown className="h-4 w-4 fill-white" />
    </div>
  </div>
</Link>

          {/* Messages */}
          <Link
            href="/messages"
            className={cn(
              'rounded-xl p-2 transition',
              mounted &&
                (pathname === '/messages' ||
                  pathname.startsWith('/messages/'))
                ? 'bg-[#6b63ff] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            )}
            suppressHydrationWarning
          >
            <MessageCircle className="h-5 w-5" />
          </Link>

          {/* Partner requests */}
          <Link
            href="/partner-requests"
            className="relative rounded-xl p-2 text-gray-600 hover:bg-gray-100"
          >
            <UserPlus className="h-5 w-5" />
            {pendingRequestsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {pendingRequestsCount > 9 ? '9+' : pendingRequestsCount}
              </span>
            )}
          </Link>

          <NotificationBell />

          {/* Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={getAvatarUrl()} />
                  <AvatarFallback className="bg-[#6b63ff] text-white">
                    {user?.fullName
                      ? getInitials(user.fullName)
                      : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{user?.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  {vi.common.profile}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  {vi.common.settings}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {vi.common.logout}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
