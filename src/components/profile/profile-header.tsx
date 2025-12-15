'use client';

import { UserProfile } from '@/types/profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Calendar,
  Edit,
  MessageSquare,
  UserPlus,
  Camera,
} from 'lucide-react';
import { format } from 'date-fns';

interface ProfileHeaderProps {
  profile: UserProfile;
  isOwnProfile: boolean;
}

export function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  const initials = profile.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  // chỉnh 1 chỗ này nếu muốn avatar to/nhỏ
  const AVATAR_SIZE = 250;

  return (
    <header className="w-full bg-background">
      {/* ===== COVER ===== */}
      <div className="relative">
        <div className="h-56 md:h-96 w-full bg-gradient-to-r from-primary/20 to-primary/10 overflow-hidden">
          {profile.coverPhoto && (
            <img
              src={profile.coverPhoto}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {isOwnProfile && (
          <button
            className="absolute bottom-3 right-3 bg-white/85 hover:bg-white text-sm px-3 py-1 rounded-md shadow"
            title="Đổi ảnh bìa"
          >
            <Camera className="inline-block h-4 w-4 mr-1" />
            Đổi ảnh bìa
          </button>
        )}

        {/* Avatar wrapper centered with content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div
            className="absolute"
            style={{ bottom: -(AVATAR_SIZE / 2) - 130 }}
          >
            <Avatar
              className="border-4 border-background shadow-2xl"
              style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
            >
              <AvatarImage src={profile.avatar} alt={profile.fullName} />
              <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* ===== HÀNG NGANG GIỐNG FB (Tên + follower | Nút) ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-3"
          style={{
            // kéo hàng ngang lên sát mép dưới cover
            marginTop: AVATAR_SIZE / 2 - 26, // càng âm càng sát; điều chỉnh để sát avatar
            // chừa chỗ avatar bên trái
            paddingLeft: AVATAR_SIZE + 32,
          }}
        >
          {/* Trái: Tên + follower + bạn chung (giống ảnh 1) */}
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-[30px] md:text-[34px] font-bold leading-tight">
                {profile.fullName}
              </h1>
            </div>



          </div>

          {/* Phải: nhóm nút (cùng hàng) */}
          <div className="flex items-center gap-2 shrink-0">
            {isOwnProfile ? (
              <Button asChild className="gap-2">
                <a href="/profile/edit">
                  <Edit className="h-4 w-4" />
                  Chỉnh sửa trang cá nhân
                </a>
              </Button>
            ) : (
              <>
                <Button className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Nhắn tin
                </Button>
                <Button variant="secondary" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Thêm bạn bè
                </Button>
              </>
            )}
          </div>
        </div>

        {/* ===== KHỐI THÔNG TIN PHỤ (bio, education, joined, chips) ===== */}
        <div className="mt-2" style={{ paddingLeft: AVATAR_SIZE + 32 }}>
          {/* username nhỏ như FB */}
          <div className="text-muted-foreground -mt-1">@{profile.username}</div>

          {profile.bio && (
            <p className="mt-1 text-foreground max-w-3xl">{profile.bio}</p>
          )}

          <div className="flex flex-wrap gap-4 mt-1 text-sm text-muted-foreground">
            {profile?.education?.institution && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>
                  {profile.education.major} at {profile.education.institution}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Tham gia {format(new Date(profile.createdAt), 'MMMM yyyy')}
              </span>
            </div>
          </div>

          {Array.isArray(profile.languages) && profile.languages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.languages.map((lang) => (
                <Badge key={lang.code} variant="secondary">
                  {lang.name} ({lang.proficiency})
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default ProfileHeader;
