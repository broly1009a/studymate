'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBlogPosts, deleteBlogPost } from '@/lib/api/blog';
import { BlogPost } from '@/lib/mock-data/blog';
import { ArrowLeft, PenSquare, Eye, Heart, MessageCircle, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from '@/lib/i18n/vi';
import { toast } from 'sonner';

export default function MyPostsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [myPosts, setMyPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock current user ID
  const currentUserId = '1';

  useEffect(() => {
    async function fetchMyPosts() {
      try {
        setLoading(true);
        const posts = await getBlogPosts({ authorId: currentUserId });
        setMyPosts(posts);
      } catch (error) {
        console.error('Failed to fetch my posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMyPosts();
  }, [currentUserId]);

  // Filter by status
  const filteredPosts = myPosts.filter(post => {
    if (statusFilter === 'all') return true;
    return post.status === statusFilter;
  });

  const handleDelete = async (postId: string) => {
    if (confirm('Bạn có chắc muốn xóa bài viết này?')) {
      try {
        await deleteBlogPost(postId);
        setMyPosts(myPosts.filter(p => p.id !== postId));
        toast.success('Đã xóa bài viết');
      } catch (error) {
        toast.error('Không thể xóa bài viết');
      }
    }
  };

  const stats = {
    total: myPosts.length,
    published: myPosts.filter(p => p.status === 'published').length,
    draft: myPosts.filter(p => p.status === 'draft').length,
    archived: myPosts.filter(p => p.status === 'archived').length,
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/blog">
            <Button variant="ghost" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {vi.common.back}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{vi.blog.myPosts}</h1>
          <p className="text-muted-foreground">Quản lý các bài viết của bạn</p>
        </div>
        <Link href="/blog/new">
          <Button>
            <PenSquare className="h-4 w-4 mr-2" />
            {vi.blog.writeBlog}
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng bài viết
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đã xuất bản
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bản nháp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lưu trữ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.archived}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Lọc theo trạng thái:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả ({stats.total})</SelectItem>
                <SelectItem value="published">Đã xuất bản ({stats.published})</SelectItem>
                <SelectItem value="draft">Bản nháp ({stats.draft})</SelectItem>
                <SelectItem value="archived">Lưu trữ ({stats.archived})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <PenSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">{vi.blog.empty.noMyPosts}</h3>
            <p className="text-muted-foreground mb-4">{vi.blog.empty.noMyPostsDescription}</p>
            <Link href="/blog/new">
              <Button>{vi.blog.writeBlog}</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Cover Image */}
                  <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={
                              post.status === 'published' ? 'default' :
                              post.status === 'draft' ? 'secondary' : 'outline'
                            }
                          >
                            {post.status === 'published' ? 'Đã xuất bản' :
                             post.status === 'draft' ? 'Bản nháp' : 'Lưu trữ'}
                          </Badge>
                          <Badge variant="secondary">{post.category}</Badge>
                          {post.featured && (
                            <Badge className="bg-orange-500">Nổi bật</Badge>
                          )}
                        </div>
                        <Link href={`/blog/${post.id}`}>
                          <h3 className="text-xl font-bold hover:text-primary mb-2">
                            {post.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {post.commentsCount}
                        </div>
                        <span>•</span>
                        <span>{format(new Date(post.publishedAt), 'dd/MM/yyyy')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/blog/${post.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Sửa
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

