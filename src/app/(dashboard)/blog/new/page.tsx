'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { getBlogCategories, createBlogPost } from '@/lib/api/blog';
import { BlogCategory } from '@/lib/mock-data/blog';
import { ArrowLeft, Save, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';

export default function NewBlogPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getBlogCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }
    fetchCategories();
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: '',
    tags: '',
    featured: false,
    status: 'draft' as 'draft' | 'published',
  });

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published') => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.category) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setLoading(true);
      const newPost = {
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
        excerpt: formData.excerpt,
        content: formData.content,
        coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
        authorId: '1', // Mock user ID
        authorName: 'Nguyễn Văn An',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=An',
        category: formData.category,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        views: 0,
        likes: 0,
        commentsCount: 0,
        readTime: Math.ceil(formData.content.length / 1000),
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status,
        featured: formData.featured,
      };

      await createBlogPost(newPost);

      const message = status === 'draft'
        ? 'Đã lưu bản nháp'
        : 'Đã xuất bản bài viết';

      toast.success(message);
      router.push('/blog');
    } catch (error) {
      toast.error('Không thể tạo bài viết');
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold">{vi.blog.writeBlog}</h1>
          <p className="text-muted-foreground">{vi.blog.subtitle}</p>
        </div>
      </div>

      <form>
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>Nhập thông tin cơ bản cho bài viết</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">{vi.blog.form.title} *</Label>
                <Input
                  id="title"
                  placeholder={vi.blog.form.titlePlaceholder}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt">{vi.blog.form.excerpt}</Label>
                <Textarea
                  id="excerpt"
                  placeholder={vi.blog.form.excerptPlaceholder}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="coverImage">{vi.blog.form.coverImage}</Label>
                <Input
                  id="coverImage"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>{vi.blog.form.content} *</CardTitle>
              <CardDescription>Viết nội dung bài viết của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={vi.blog.form.contentPlaceholder}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={15}
                className="font-mono"
                required
              />
              <p className="text-xs text-muted-foreground mt-2">
                Hỗ trợ Markdown. Sử dụng # cho tiêu đề, ** cho in đậm, * cho in nghiêng.
              </p>
            </CardContent>
          </Card>

          {/* Categories & Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Phân loại</CardTitle>
              <CardDescription>Chọn danh mục và thẻ cho bài viết</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">{vi.blog.form.category} *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags">{vi.blog.form.tags}</Label>
                <Input
                  id="tags"
                  placeholder={vi.blog.form.tagsPlaceholder}
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Phân cách các thẻ bằng dấu phẩy (ví dụ: học tập, công nghệ, AI)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt</CardTitle>
              <CardDescription>Tùy chọn hiển thị bài viết</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="featured">{vi.blog.form.featured}</Label>
                  <p className="text-sm text-muted-foreground">
                    Hiển thị bài viết ở mục nổi bật
                  </p>
                </div>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => handleSubmit(e, 'draft')}
            >
              <Save className="h-4 w-4 mr-2" />
              {vi.blog.form.saveDraft}
            </Button>
            <Button
              type="button"
              onClick={(e) => handleSubmit(e, 'published')}
            >
              <Send className="h-4 w-4 mr-2" />
              {vi.blog.form.publish}
            </Button>
            <Link href="/blog">
              <Button type="button" variant="ghost">
                {vi.common.cancel}
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

