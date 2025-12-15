'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CreateEventPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'study',
    startTime: '',
    endTime: '',
    location: '',
    reminder: '30',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.startTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Event created successfully!');
    router.push('/calendar');
  };

  return (
    <div className="w-full">
      <Link href="/calendar">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Calendar
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Event Title *</Label>
              <Input
                placeholder="e.g., Study Session - Algorithms"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Add event details..."
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
                  <SelectItem value="study">Study Session</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="assignment">Assignment Due</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
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
              <Label>Location</Label>
              <Input
                placeholder="e.g., Library or Online"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Reminder</Label>
              <Select
                value={formData.reminder}
                onValueChange={(value) => setFormData({ ...formData, reminder: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No reminder</SelectItem>
                  <SelectItem value="15">15 minutes before</SelectItem>
                  <SelectItem value="30">30 minutes before</SelectItem>
                  <SelectItem value="60">1 hour before</SelectItem>
                  <SelectItem value="1440">1 day before</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Create Event</Button>
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

