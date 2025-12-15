'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, ArrowLeft, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from '@/lib/i18n/vi';

interface StudySession {
  _id: string;
  id?: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  subject: string;
  scheduledAt: string;
  duration: number;
}

export default function SessionReviewPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const router = useRouter();
  const [session, setSession] = useState<StudySession | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/study-sessions/${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch session');
        }
        const data = await response.json();
        setSession(data.data || data);
      } catch (error: any) {
        toast.error('Không thể tải phiên học');
        console.error('Error fetching session:', error);
        router.push('/matches/sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, router]);

  if (loading) {
    return (
      <div className="w-full">
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50 animate-spin" />
            <h3 className="text-lg font-semibold mb-2">Đang tải phiên học...</h3>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Không tìm thấy phiên học</h1>
          <p className="text-muted-foreground mb-4">Phiên học bạn đang tìm không tồn tại.</p>
          <Link href="/matches/sessions">
            <Button>Quay lại phiên học</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Vui lòng chọn đánh giá');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`/api/study-sessions/${sessionId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          review,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      toast.success('Đã gửi đánh giá thành công!');
      router.push('/matches/sessions');
    } catch (error: any) {
      toast.error('Không thể gửi đánh giá');
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <Link href="/matches/sessions">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại phiên học
        </Button>
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Review Study Session</h1>
        <p className="text-muted-foreground mt-2">Share your experience with {session.partnerName}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Review Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Session Review</CardTitle>
              <CardDescription>Help improve the study partner experience</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div>
                  <Label className="text-base">How was your session? *</Label>
                  <div className="flex items-center gap-2 mt-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-10 w-10 ${
                            star <= (hoveredRating || rating)
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="ml-2 text-lg font-medium">
                        {rating === 5 ? 'Excellent!' :
                         rating === 4 ? 'Great!' :
                         rating === 3 ? 'Good' :
                         rating === 2 ? 'Fair' :
                         'Poor'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Written Review */}
                <div>
                  <Label>Your Review (Optional)</Label>
                  <Textarea
                    placeholder="What did you like about the session? What could be improved?"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={6}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Your review will help other students and improve the matching algorithm
                  </p>
                </div>

                {/* Quick Feedback Tags */}
                <div>
                  <Label className="text-base">What made this session great?</Label>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {[
                      'Well prepared',
                      'Great explanations',
                      'Patient',
                      'Collaborative',
                      'Punctual',
                      'Knowledgeable',
                      'Engaging',
                      'Helpful resources',
                    ].map((tag) => (
                      <Button
                        key={tag}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="justify-start"
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Review
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Skip
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Session Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Image
                  src={session.partnerAvatar}
                  alt={session.partnerName}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="font-medium">{session.partnerName}</div>
                  <div className="text-sm text-muted-foreground">{session.subject}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <div className="font-medium">
                    {format(new Date(session.scheduledAt), 'MMMM d, yyyy')}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Time:</span>
                  <div className="font-medium">
                    {format(new Date(session.scheduledAt), 'h:mm a')}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <div className="font-medium">{session.duration} minutes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Review Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p>Be honest and constructive in your feedback</p>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p>Focus on the session quality and collaboration</p>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p>Mention specific things that worked well</p>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p>Keep feedback professional and respectful</p>
              </div>
            </CardContent>
          </Card>

          {/* Impact */}
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-base">Your Impact</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                Your reviews help build a better study community and improve our matching algorithm
                to connect students more effectively.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

