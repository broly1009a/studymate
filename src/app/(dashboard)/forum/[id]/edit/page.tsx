'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Question {
  _id: string;
  id?: string;
  title: string;
  content: string;
  tags: string[];
}

export default function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/forum-questions/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch question');
        }
        const data = await response.json();
        const fetchedQuestion = data.data || data;
        setQuestion(fetchedQuestion);
        setFormData({
          title: fetchedQuestion.title || '',
          content: fetchedQuestion.content || '',
          tags: fetchedQuestion.tags || [],
        });
      } catch (error: any) {
        toast.error('Không thể tải câu hỏi');
        console.error('Error fetching question:', error);
        router.push('/forum');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id, router]);

  if (loading) {
    return (
      <div className="w-full">
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50 animate-spin" />
            <h3 className="text-lg font-semibold mb-2">Đang tải câu hỏi...</h3>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!question) {
    return <div className="w-full">Không tìm thấy câu hỏi</div>;
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim().toLowerCase()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast.error('Vui lòng điền tất cả các trường bắt buộc');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`/api/forum-questions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          tags: formData.tags,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update question');
      }

      toast.success('Câu hỏi đã được cập nhật thành công!');
      router.push(`/forum/${id}`);
    } catch (error: any) {
      toast.error('Không thể cập nhật câu hỏi');
      console.error('Error updating question:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <Link href={`/forum/${id}`}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Question
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Edit Question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Content *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag}>Add</Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  'Lưu thay đổi'
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

