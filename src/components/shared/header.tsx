'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User, LogOut, Settings, Home, Users as UsersIcon, MessageCircle, MessageSquare, UsersRound, Trophy, PenSquare, Crown, UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

// Main navigation items for header
const mainNavigation = [
  { name: 'Trang chủ', href: '/home', icon: Home },
  { name: 'Bạn học', href: '/matches', icon: UsersIcon },
  { name: 'Diễn đàn', href: '/forum', icon: MessageSquare },
  { name: 'Nhóm học', href: '/groups', icon: UsersRound },
  { name: 'Cuộc thi', href: '/competitions', icon: Trophy },
  { name: 'Blog', href: '/blog', icon: PenSquare },
];

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch - only check pathname after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch pending partner requests count
  useEffect(() => {
    const fetchPendingCount = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`${API_URL}/partner-requests?userId=${user.id}&type=received&status=pending`);
        const data = await response.json();
        if (data.success) {
          setPendingRequestsCount(data.data.length);
        }
      } catch (error) {
        console.error('Failed to fetch pending requests count:', error);
      }
    };

    fetchPendingCount();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarUrl = () => {
    // console.log('Fetching avatar URL for user:', user);
    if (user?.avatar) {
      // console.log('User avatar found:', user.avatar);
      return user.avatar;
    }
    if (user?.profileImages && user.profileImages.length > 0) {
      // console.log('Using profile image as avatar:', user.profileImages[0].url);
      return user.profileImages[0]?.url;
    }
   // console.log('No avatar or profile images found for user.');
    return undefined;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="w-full flex h-16 items-center justify-between px-6">
        {/* Left Section: Logo + Navigation */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-1 font-bold text-xl flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-[#6059f7] to-[#4f47d9] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-[#6059f7]">StudyMate</span>
          </Link>

          {/* Main Navigation Menu */}
          <nav className="hidden xl:flex items-center gap-1">
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-[#6059f7] text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-[#6059f7]"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center Section: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Tìm kiếm..."
              className="pl-10 w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-[#6059f7] transition-colors"
            />
          </div>
        </div>

        {/* Right Section: Premium + Message + Notification + User */}
        <div className="flex items-center gap-3">
          {/* Premium Button */}
          <Link
            href="/subscription"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-orange-600"
          >
            <Crown className="w-4 h-4 animate-pulse" />
            <span>Premium</span>
          </Link>

          {/* Message & Partner Requests Icons */}
          <div className="hidden lg:flex items-center gap-1 px-3 border-r">
            <Link
              href="/messages"
              className={cn(
                "p-2 rounded-lg transition-all",
                mounted && (pathname === '/messages' || pathname.startsWith('/messages/'))
                  ? "bg-[#6059f7] text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-[#6059f7]"
              )}
              title="Tin nhắn"
              suppressHydrationWarning
            >
              <MessageCircle className="w-5 h-5" />
            </Link>
            
            <Link
              href="/partner-requests"
              className={cn(
                "p-2 rounded-lg transition-all relative",
                mounted && (pathname === '/partner-requests' || pathname.startsWith('/partner-requests/'))
                  ? "bg-[#6059f7] text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-[#6059f7]"
              )}
              title="Yêu cầu học cùng"
              suppressHydrationWarning
            >
              <UserPlus className="w-5 h-5" />
              {pendingRequestsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {pendingRequestsCount > 9 ? '9+' : pendingRequestsCount}
                </span>
              )}
            </Link>
          </div>

          {/* Notification Bell */}
          <NotificationBell />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-[#6059f7] hover:ring-offset-2 transition-all">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={getAvatarUrl()} 
                    alt={user?.fullName}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-[#6059f7] text-white font-semibold">
                    {user?.fullName ? getInitials(user.fullName) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>{vi.common.profile}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{vi.common.settings}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>{vi.common.logout}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

