'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';

export default function EditGroupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    subjects: [] as string[],
    isPublic: true,
    maxMembers: '30',
  });

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/groups/${slug}`);
        const data = await response.json();
        if (data.success) {
          const groupData = data.data;
          setGroup(groupData);
          setFormData({
            name: groupData.name || '',
            description: groupData.description || '',
            category: groupData.category || '',
            subjects: groupData.subjects || [],
            isPublic: groupData.isPublic ?? true,
            maxMembers: groupData.maxMembers?.toString() || '30',
          });
        }
      } catch (error) {
        console.error('Failed to fetch group:', error);
        toast.error('Failed to load group');
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const response = await fetch(`/api/groups/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          maxMembers: parseInt(formData.maxMembers),
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Group updated successfully!');
        router.push(`/groups/${slug}`);
      } else {
        toast.error(data.message || 'Failed to update group');
      }
    } catch (error) {
      console.error('Failed to update group:', error);
      toast.error('Failed to update group');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-muted-foreground">Group not found</h2>
        <p className="text-muted-foreground mt-2">The group you're looking for doesn't exist.</p>
        <Link href="/groups">
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Groups
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href={`/groups/${slug}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Group
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Group</h1>
          <p className="text-sm text-muted-foreground">
            Update your group information
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Group Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter group name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="study">Study Group</SelectItem>
                    <SelectItem value="project">Project Group</SelectItem>
                    <SelectItem value="exam-prep">Exam Preparation</SelectItem>
                    <SelectItem value="language">Language Learning</SelectItem>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your group"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="maxMembers">Max Members</Label>
                <Input
                  id="maxMembers"
                  type="number"
                  value={formData.maxMembers}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: e.target.value }))}
                  placeholder="30"
                  min="1"
                  max="1000"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
                />
                <Label htmlFor="isPublic">Public Group</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Link href={`/groups/${slug}`}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Update Group
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}