'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';

export default function CreateEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'study_session',
    startTime: '',
    endTime: '',
    location: '',
  });

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/groups/${id}`);
        const data = await response.json();
        if (data.success) {
          setGroup(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch group:', error);
        toast.error('Failed to load group');
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!group) {
    return <div className="w-full">Group not found</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.startTime || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`/api/groups/${id}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Event created successfully!');
        router.push(`/groups/${id}/calendar`);
      } else {
        toast.error(data.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Failed to create event:', error);
      toast.error('Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <Link href={`/groups/${id}/calendar`}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Calendar
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create Event for {group.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Event Title *</Label>
              <Input
                placeholder="e.g., Weekly Study Session"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Describe the event..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Event Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="study_session">Study Session</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="social">Social Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time *</Label>
                <Input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label>Location *</Label>
              <Input
                placeholder="e.g., Library Room 301 or Online"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-2"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Event
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={submitting}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

