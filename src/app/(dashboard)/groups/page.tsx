'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Plus,
  Users,
  Lock,
  Globe,
  MessageCircle,
  X,
  Maximize2,
  Minimize2,
  Video,
  Image as ImageIcon,
  File,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [page, setPage] = useState(1);

  const [groups, setGroups] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch groups from API
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '12',
        });

        if (searchQuery) {
          params.append('search', searchQuery);
        }

        if (categoryFilter !== 'all') {
          params.append('category', categoryFilter);
        }

        if (visibilityFilter !== 'all') {
          params.append('visibility', visibilityFilter);
        }

        const response = await fetch(`/api/groups?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setGroups(data.data);
          setTotalPages(data.pagination.pages);
        }
      } catch (error) {
        console.error('Failed to fetch groups:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchGroups, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, categoryFilter, visibilityFilter, page]);

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/groups/stats');
        const data = await response.json();

        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  // 👇 State cho phần Chat Dock
  const [openChats, setOpenChats] = useState<any[]>([]);
  const [minimized, setMinimized] = useState<string[]>([]);
  const myGroups = groups.filter((g) => g.isJoined);

  const toggleChat = (group: any) => {
    setOpenChats((prev) =>
      prev.some((c) => c.id === group.id)
        ? prev.filter((c) => c.id !== group.id)
        : [...prev, group]
    );
  };

  const toggleMinimize = (id: string) => {
    setMinimized((prev) =>
      prev.includes(id)
        ? prev.filter((mid) => mid !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Nhóm học</h1>
          <p className="text-muted-foreground mt-2">Tham gia nhóm và cùng nhau học tập</p>
        </div>
        <Link href="/groups/new">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Tạo nhóm mới
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng số nhóm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalGroups || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nhóm công khai</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats?.publicGroups || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nhóm của tôi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500 cursor-pointer hover:underline"
              onClick={() => alert('Sẽ hiện danh sách chat ở góc màn hình')}>
              {stats?.myGroups || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng thành viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalMembers || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm nhóm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger suppressHydrationWarning>
                <SelectValue placeholder="Tất cả danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                <SelectItem value="Khoa học máy tính">Khoa học máy tính</SelectItem>
                <SelectItem value="Toán học">Toán học</SelectItem>
                <SelectItem value="Vật lý">Vật lý</SelectItem>
                <SelectItem value="Hóa học">Hóa học</SelectItem>
                <SelectItem value="Ngoại ngữ">Ngoại ngữ</SelectItem>
                <SelectItem value="Kinh tế">Kinh tế</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Ôn thi THPT">Ôn thi THPT</SelectItem>
                <SelectItem value="Thiết kế">Thiết kế</SelectItem>
              </SelectContent>
            </Select>
            <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
              <SelectTrigger suppressHydrationWarning>
                <SelectValue placeholder="Tất cả nhóm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả nhóm</SelectItem>
                <SelectItem value="public">Công khai</SelectItem>
                <SelectItem value="private">Riêng tư</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Groups List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {groups.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Không tìm thấy nhóm</h3>
                  <p className="text-muted-foreground mb-4">
                    Thử điều chỉnh bộ lọc tìm kiếm hoặc tạo nhóm mới
                  </p>
                  <Link href="/groups/new">
                    <Button>Tạo nhóm mới</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              groups.map((group) => (
                <div key={group._id} onClick={() => toggleChat(group)}>
                  <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full overflow-hidden">
                    <div className="relative h-32 bg-gradient-to-br from-primary/20 to-primary/5">
                      <Image
                        src={group.coverImage || '/default-cover.jpg'}
                        alt={group.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        {group.visibility === 'private' ? (
                          <Badge className="bg-red-500/90">
                            <Lock className="h-3 w-3 mr-1" /> Riêng tư
                          </Badge>
                        ) : (
                          <Badge className="bg-green-500/90">
                            <Globe className="h-3 w-3 mr-1" /> Công khai
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardHeader className="relative">
                      <div className="absolute -top-8 left-4">
                        <Image
                          src={group.avatar || '/default-avatar.png'}
                          alt={group.name}
                          width={64}
                          height={64}
                          className="rounded-lg border-4 border-background bg-background"
                        />
                      </div>
                      <div className="pt-8">
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-2">
                          {group.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mb-6">
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Trước
              </Button>
              <div className="text-sm text-muted-foreground">
                Trang {page} của {totalPages}
              </div>
              <Button
                variant="outline"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Sau
              </Button>
            </div>
          )}
        </>
      )}

      {/* Floating MyGroups Chat Dock */}
      <div className="fixed bottom-6 right-6 flex gap-4 z-50">
        <AnimatePresence>
          {openChats.map((group) => {
            const isMin = minimized.includes(group.id);
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                className="w-80"
              >
                <Card className="shadow-2xl border rounded-2xl overflow-hidden">
                  <CardHeader className="flex justify-between items-center bg-primary/10 p-2">
                    <div className="flex items-center gap-2">
                      <Image
                        src={group.avatar}
                        alt=""
                        width={32}
                        height={32}
                        className="rounded-md"
                      />
                      <span className="font-semibold text-sm">{group.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => toggleMinimize(group.id)}>
                        {isMin ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => toggleChat(group)}>
                        <X size={16} />
                      </Button>
                    </div>
                  </CardHeader>

                  {!isMin && (
                    <>
                      <CardContent className="h-64 overflow-y-auto space-y-2 p-3">
                        <div className="text-sm text-muted-foreground">
                          Chat history (demo) — future messages will appear here.
                        </div>
                      </CardContent>
                      <CardContent className="flex gap-2 p-2 border-t">
                        <Button size="icon" variant="ghost">
                          <ImageIcon size={18} />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <File size={18} />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Video size={18} />
                        </Button>
                        <Input placeholder="Type a message..." className="flex-1" />
                      </CardContent>
                    </>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
