'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Users, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import { vi } from '@/lib/i18n/vi';

interface Partner {
  _id: string;
  id?: string;
  name: string;
  avatar: string;
  major: string;
  rating: number;
  reviewsCount?: number;
  availability: string[];
  subjects: string[];
}

export default function ScheduleSessionPage() {
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    partnerId: '',
    subject: '',
    date: '',
    time: '',
    duration: '60',
    notes: '',
  });

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/partners?limit=5');
        if (!response.ok) {
          throw new Error('Failed to fetch partners');
        }
        const data = await response.json();
        setPartners(data.data || []);
      } catch (error: any) {
        toast.error('Không thể tải danh sách đối tác');
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.partnerId || !formData.subject || !formData.date || !formData.time) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/study-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partnerId: formData.partnerId,
          subject: formData.subject,
          scheduledAt: new Date(`${formData.date}T${formData.time}`),
          duration: parseInt(formData.duration),
          notes: formData.notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      toast.success(vi.matches.schedule.success);
      router.push('/matches/sessions');
    } catch (error: any) {
      toast.error('Không thể tạo phiên học');
      console.error('Error creating session:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPartner = partners.find(p => p._id === formData.partnerId);

  return (
    <div className="w-full">
      <Link href="/matches/sessions">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại phiên học
        </Button>
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{vi.matches.schedule.title}</h1>
        <p className="text-muted-foreground mt-2">{vi.matches.schedule.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
              <CardDescription>Fill in the information for your study session</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Partner Selection */}
                <div>
                  <Label>Study Partner *</Label>
                  <Select
                    value={formData.partnerId}
                    onValueChange={(value) => setFormData({ ...formData, partnerId: value })}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loading ? "Đang tải..." : "Select a partner"} />
                    </SelectTrigger>
                    <SelectContent>
                      {partners.map((partner) => (
                        <SelectItem key={partner._id} value={partner._id}>
                          <div className="flex items-center gap-2">
                            {partner.name} - {partner.rating}⭐
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject */}
                <div>
                  <Label>Subject *</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="English Literature">English Literature</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date *</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label>Time *</Label>
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <Label>Duration (minutes)</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) => setFormData({ ...formData, duration: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="180">3 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Notes */}
                <div>
                  <Label>Session Notes (Optional)</Label>
                  <Textarea
                    placeholder="What topics do you want to cover? Any specific goals?"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={submitting || loading}>
                    <Calendar className="h-4 w-4 mr-2" />
                    {submitting ? 'Đang tạo...' : 'Lên lịch phiên học'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={submitting}
                  >
                    Hủy
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Partner Info */}
          {selectedPartner && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Selected Partner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={selectedPartner.avatar}
                    alt={selectedPartner.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-medium">{selectedPartner.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedPartner.rating}⭐ ({selectedPartner.reviewsCount} reviews)
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Availability</div>
                  <div className="text-sm space-y-1">
                    {selectedPartner.availability.map((time, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scheduling Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p>Choose a time that works for both you and your partner</p>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p>Plan specific topics to cover during the session</p>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p>Start with shorter sessions (60-90 min) to build rapport</p>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p>Be prepared with materials and questions</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Total Sessions</div>
                <div className="text-2xl font-bold">12</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Active Partners</div>
                <div className="text-2xl font-bold">3</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
                <div className="text-2xl font-bold">4.8⭐</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

