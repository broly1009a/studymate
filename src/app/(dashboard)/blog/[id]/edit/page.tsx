'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { getBlogPostById, getBlogCategories, updateBlogPost } from '@/lib/api/blog';
import { BlogPost, BlogCategory } from '@/lib/mock-data/blog';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: '',
    tags: '',
    featured: false,
    status: 'draft' as 'draft' | 'published' | 'archived',
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [postData, categoriesData] = await Promise.all([
          getBlogPostById(id),
          getBlogCategories()
        ]);

        if (postData) {
          setPost(postData);
          setFormData({
            title: postData.title,
            excerpt: postData.excerpt,
            content: postData.content,
            coverImage: postData.coverImage,
            category: postData.category,
            tags: postData.tags.join(', '),
            featured: postData.featured,
            status: postData.status,
          });
        }
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch blog post:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

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

  if (!post) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Không tìm thấy bài viết</h1>
          <p className="text-muted-foreground mb-4">Bài viết bạn muốn chỉnh sửa không tồn tại.</p>
          <Link href="/blog">
            <Button>Quay lại Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.category) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setSaving(true);
      await updateBlogPost(id, {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        coverImage: formData.coverImage,
        category: formData.category,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        featured: formData.featured,
        status: formData.status,
        updatedAt: new Date().toISOString(),
      });

      toast.success('Đã cập nhật bài viết');
      router.push(`/blog/${id}`);
    } catch (error) {
      toast.error('Không thể cập nhật bài viết');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href={`/blog/${id}`}>
            <Button variant="ghost" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {vi.common.back}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Chỉnh sửa bài viết</h1>
          <p className="text-muted-foreground">Cập nhật nội dung bài viết của bạn</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>Cập nhật thông tin cơ bản cho bài viết</CardDescription>
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
              <CardDescription>Chỉnh sửa nội dung bài viết</CardDescription>
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
              <CardDescription>Cập nhật danh mục và thẻ</CardDescription>
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
                  Phân cách các thẻ bằng dấu phẩy
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

              <div>
                <Label htmlFor="status">{vi.blog.form.status}</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'draft' | 'published' | 'archived') => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">{vi.blog.form.draft}</SelectItem>
                    <SelectItem value="published">{vi.blog.form.published}</SelectItem>
                    <SelectItem value="archived">{vi.blog.form.archived}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {vi.blog.form.update}
            </Button>
            <Link href={`/blog/${id}`}>
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

