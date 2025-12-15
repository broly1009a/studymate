'use client';

import { use, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { getGroupById } from '@/lib/mock-data/groups';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';

export default function EditGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const group = getGroupById(id);

  const [formData, setFormData] = useState({
    name: group?.name || '',
    description: group?.description || '',
    category: group?.category || '',
    visibility: (group?.visibility || 'public') as 'public' | 'private',
    maxMembers: group?.maxMembers.toString() || '30',
    autoApprove: true,
  });

  if (!group) {
    return <div className="w-full">Không tìm thấy nhóm</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Đã cập nhật nhóm thành công!');
    router.push(`/groups/${id}`);
  };

  return (
    <div className="w-full">
      <Link href={`/groups/${id}`}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Group
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Edit Group</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Group Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Description *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Visibility</Label>
              <Select
                value={formData.visibility}
                onValueChange={(value) => setFormData({ ...formData, visibility: value as 'public' | 'private' })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Maximum Members</Label>
              <Input
                type="number"
                min="5"
                max="100"
                value={formData.maxMembers}
                onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                className="mt-2"
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label>Auto-approve join requests</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Automatically accept new members
                </p>
              </div>
              <Switch
                checked={formData.autoApprove}
                onCheckedChange={(checked) => setFormData({ ...formData, autoApprove: checked })}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Save Changes</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

