'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';

export default function AskQuestionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subject: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.subject) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (formData.tags.length === 0) {
      toast.error('Vui lòng thêm ít nhất một thẻ');
      return;
    }

    toast.success('Đã đăng câu hỏi thành công!');
    router.push('/forum');
  };

  return (
    <div className="w-full">
      <Link href="/forum">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại diễn đàn
        </Button>
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{vi.forum.askQuestion}</h1>
        <p className="text-muted-foreground mt-2">Nhận trợ giúp từ cộng đồng</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Question Details</CardTitle>
              <CardDescription>Be specific and clear to get better answers</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <Label>Question Title *</Label>
                  <Input
                    placeholder="e.g., How do I solve quadratic equations?"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Be specific and imagine you're asking a question to another person
                  </p>
                </div>

                {/* Subject */}
                <div>
                  <Label>Subject *</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="English Literature">English Literature</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Content */}
                <div>
                  <Label>Question Details *</Label>
                  <Textarea
                    placeholder="Include all the information someone would need to answer your question..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={10}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Explain what you've tried and where you're stuck
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <Label>Tags *</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Add a tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Add up to 5 tags to help others find your question
                  </p>
                </div>

                {/* Submit */}
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Post Question
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Writing Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Writing a Good Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p>Summarize your problem in the title</p>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p>Describe what you've tried and what didn't work</p>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p>Include relevant code, formulas, or examples</p>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p>Use proper formatting and grammar</p>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p>Add relevant tags for better visibility</p>
              </div>
            </CardContent>
          </Card>

          {/* Example Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Popular Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['algebra', 'calculus', 'programming', 'physics', 'chemistry', 'biology'].map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary"
                    onClick={() => {
                      if (!formData.tags.includes(tag)) {
                        setFormData({
                          ...formData,
                          tags: [...formData.tags, tag],
                        });
                      }
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

