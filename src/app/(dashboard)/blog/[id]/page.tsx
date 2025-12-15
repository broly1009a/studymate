'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { getBlogPostById, getBlogComments, getBlogPosts, incrementBlogPostViews, toggleBlogPostLike, deleteBlogPost } from '@/lib/api/blog';
import { BlogPost, BlogComment } from '@/lib/mock-data/blog';
import { ArrowLeft, Eye, Heart, MessageCircle, Clock, Share2, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from '@/lib/i18n/vi';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const postData = await getBlogPostById(id);
        if (!postData) {
          setLoading(false);
          return;
        }
        setPost(postData);

        // Increment view count
        await incrementBlogPostViews(id);

        // Fetch comments and related posts
        const [commentsData, relatedData] = await Promise.all([
          getBlogComments(id),
          getBlogPosts({ category: postData.category, status: 'published' })
        ]);

        setComments(commentsData);
        setRelatedPosts(relatedData.filter(p => p.id !== id).slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch blog post:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleLike = async () => {
    try {
      await toggleBlogPostLike(id, !liked);
      setLiked(!liked);
      toast.success(liked ? 'Đã bỏ thích' : 'Đã thích bài viết');
    } catch (error) {
      toast.error('Không thể thực hiện thao tác');
    }
  };

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
          <p className="text-muted-foreground mb-4">Bài viết bạn đang tìm không tồn tại.</p>
          <Link href="/blog">
            <Button>Quay lại Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Đã sao chép link bài viết');
  };

  const handleComment = () => {
    if (!newComment.trim()) return;
    toast.success('Đã thêm bình luận');
    setNewComment('');
  };

  const handleDelete = async () => {
    if (confirm('Bạn có chắc muốn xóa bài viết này?')) {
      try {
        await deleteBlogPost(id);
        toast.success('Đã xóa bài viết');
        router.push('/blog');
      } catch (error) {
        toast.error('Không thể xóa bài viết');
      }
    }
  };

  return (
    <div className="w-full">
      {/* Back Button */}
      <Link href="/blog">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {vi.common.back}
        </Button>
      </Link>

      {/* Cover Image */}
      <div className="relative h-[400px] rounded-lg overflow-hidden mb-8">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Post Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary">{post.category}</Badge>
          {post.featured && (
            <Badge className="bg-orange-500">{vi.blog.card.featured}</Badge>
          )}
          <span className="text-sm text-muted-foreground">
            {format(new Date(post.publishedAt), 'dd/MM/yyyy HH:mm')}
          </span>
        </div>

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>

        {/* Author & Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={post.authorAvatar}
              alt={post.authorName}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <div className="font-semibold">{post.authorName}</div>
              <div className="text-sm text-muted-foreground">
                {post.readTime} {vi.blog.card.readTime}
              </div>
            </div>
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
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mb-8 pb-8 border-b">
        <Button
          variant={liked ? "default" : "outline"}
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 mr-2 ${liked ? 'fill-current' : ''}`} />
          {vi.blog.detail.like}
        </Button>
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          {vi.blog.detail.share}
        </Button>
        <div className="ml-auto flex gap-2">
          <Link href={`/blog/${post.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              {vi.blog.detail.edit}
            </Button>
          </Link>
          <Button variant="outline" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            {vi.blog.detail.delete}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
      </div>

      {/* Tags */}
      <div className="mb-8">
        <h3 className="font-semibold mb-3">{vi.blog.detail.tags}</h3>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Comments */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            {vi.blog.detail.comments} ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Comment Form */}
          <div className="mb-6">
            <Textarea
              placeholder={vi.blog.detail.writeComment}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-2"
            />
            <Button onClick={handleComment}>
              <MessageCircle className="h-4 w-4 mr-2" />
              {vi.common.submit}
            </Button>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-4 rounded-lg border">
                <Image
                  src={comment.authorAvatar}
                  alt={comment.authorName}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{comment.authorName}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{comment.content}</p>
                  <Button variant="ghost" size="sm">
                    <Heart className="h-3 w-3 mr-1" />
                    {comment.likes}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">{vi.blog.detail.relatedPosts}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative h-32">
                    <Image
                      src={relatedPost.coverImage}
                      alt={relatedPost.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-base line-clamp-2">
                      {relatedPost.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {relatedPost.excerpt}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

