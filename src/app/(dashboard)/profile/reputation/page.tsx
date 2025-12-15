'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, MessageCircle, MoreHorizontal, Camera } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const profile = {
  name: 'Duy Anh',
  username: '@Duy Anh',
  tagline: 'Tôi là vua lập trình, bậc thầy kinh tế',
  followers: 836,
  following: 239,
  avatar: '/avatars/default-avatar.png',
  cover: '/images/profile-cover.jpg',
};

const tabs = ['Bài viết', 'Giới thiệu', 'Reels', 'Ảnh', 'Nhóm', 'Sự kiện', 'Xem thêm'];

export default function FacebookLikeProfile() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* =================== COVER + AVATAR =================== */}
      <div className="relative">
        {/* Cover */}
        <div
          className="h-60 md:h-72 w-full bg-center bg-cover"
          style={{ backgroundImage: `url(${profile.cover})` }}
        />
        {/* Fade dưới cover (tùy thích) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Avatar (absolute chồng lên mép dưới) */}
        <div className="absolute -bottom-16 left-4 md:left-6">
          <div className="relative">
            <Image
              src={profile.avatar}
              alt="avatar"
              width={180}
              height={180}
              className="h-32 w-32 md:h-44 md:w-44 rounded-full border-4 border-background object-cover shadow-lg"
            />
            <button
              className="absolute bottom-1 right-1 rounded-full bg-muted p-2 shadow border"
              title="Đổi ảnh đại diện"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =================== BLOCK CHỮ DƯỚI COVER/AVATAR =================== */}
      <div className="w-full">
        {/* mt-* để tách khỏi cover; pl-* để chừa chỗ avatar bên trái */}
        <div className="mt-24 pl-40 md:mt-28 md:pl-56 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{profile.name}</h1>
            <div className="text-muted-foreground -mt-1">{profile.username}</div>

            <p className="mt-2">{profile.tagline}</p>

            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>Computer Science at MIT</span>
              <span>Joined January 2023</span>
            </div>

            {/* Chips ngôn ngữ */}
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-muted text-sm">English (native)</span>
              <span className="px-3 py-1 rounded-full bg-muted text-sm">Spanish (conversational)</span>
              <span className="px-3 py-1 rounded-full bg-muted text-sm">French (basic)</span>
            </div>
          </div>

          {/* Actions bên phải */}
          <div className="flex items-center gap-2">
            <Button>Edit Profile</Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* =================== TABS BAR =================== */}
      <div className="border-t mt-4">
        <div className="w-full">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {tabs.map((t, i) => (
              <button
                key={t}
                className={`relative px-4 py-3 text-sm whitespace-nowrap hover:bg-muted/50 rounded-md ${i === 0 ? 'text-primary font-semibold' : 'text-foreground'
                  }`}
              >
                {t}
                {i === 0 && (
                  <span className="absolute left-0 right-0 -bottom-[1px] h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =================== CONTENT (TRÁI: INFO, PHẢI: BÀI VIẾT) =================== */}
      <div className="w-full">
        {/* Left column */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Giới thiệu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Đang sống tại Hà Nội</p>
              <p>Làm việc tại Study Mate</p>
              <p>Học tại MIT – Computer Science</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ảnh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kỹ năng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Programming</span><span>95%</span>
                </div>
                <Progress value={95} />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Data Structures</span><span>80%</span>
                </div>
                <Progress value={80} />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Mathematics</span><span>90%</span>
                </div>
                <Progress value={90} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bài viết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-xl border p-4">
                  <div className="flex gap-3">
                    <Image
                      src={profile.avatar}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{profile.name}</div>
                      <div className="text-sm text-muted-foreground">2 giờ trước</div>
                    </div>
                  </div>
                  <p className="mt-3">
                    Đây là nội dung bài viết demo #{i}. Giao diện mô phỏng timeline của Facebook.
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
