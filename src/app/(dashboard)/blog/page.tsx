'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBlogPosts, getBlogCategories, getBlogStats } from '@/lib/api/blog';
import { BlogPost, BlogCategory } from '@/lib/mock-data/blog';
import { Search, PenSquare, Eye, Heart, MessageCircle, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from '@/lib/i18n/vi';

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [stats, setStats] = useState({ totalPosts: 0, totalViews: 0, totalLikes: 0, totalComments: 0 });
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [categoriesData, statsData, postsData] = await Promise.all([
          getBlogCategories(),
          getBlogStats(),
          getBlogPosts({ status: 'published' })
        ]);
        setCategories(categoriesData);
        setStats(statsData);
        setAllPosts(postsData);
      } catch (error) {
        console.error('Failed to fetch blog data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter posts
  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.likes + b.views) - (a.likes + a.views);
      case 'mostViewed':
        return b.views - a.views;
      case 'mostLiked':
        return b.likes - a.likes;
      default: // newest
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
  });

  const featuredPosts = allPosts.filter(post => post.featured).slice(0, 3);

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{vi.blog.title}</h1>
          <p className="text-muted-foreground">{vi.blog.subtitle}</p>
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
              {vi.blog.stats.totalPosts}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {vi.blog.stats.totalViews}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {vi.blog.stats.totalLikes}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLikes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {vi.blog.stats.totalComments}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            {vi.blog.filters.featured}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-orange-500">
                      {vi.blog.card.featured}
                    </Badge>
                  </div>
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">
                      {post.category}
                    </Badge>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                        <Clock className="h-4 w-4" />
                        {post.readTime} {vi.blog.card.readTime}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={vi.blog.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder={vi.blog.filters.category} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{vi.blog.filters.all}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name} ({category.postCount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder={vi.common.sort} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{vi.blog.sort.newest}</SelectItem>
                <SelectItem value="popular">{vi.blog.sort.popular}</SelectItem>
                <SelectItem value="mostViewed">{vi.blog.sort.mostViewed}</SelectItem>
                <SelectItem value="mostLiked">{vi.blog.sort.mostLiked}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      {sortedPosts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <PenSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">{vi.blog.empty.noPosts}</h3>
            <p className="text-muted-foreground mb-4">{vi.blog.empty.noPostsDescription}</p>
            <Link href="/blog/new">
              <Button>{vi.blog.writeBlog}</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(post.publishedAt), 'dd/MM/yyyy')}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Image
                      src={post.authorAvatar}
                      alt={post.authorName}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-sm text-muted-foreground">{post.authorName}</span>
                  </div>
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
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

