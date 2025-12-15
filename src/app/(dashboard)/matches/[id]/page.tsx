'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MessageCircle, Star, Clock, Users, Calendar, Globe, Languages, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';

interface Partner {
  _id: string;
  id?: string;
  userId: string;
  name: string;
  avatar: string;
  age: number;
  major: string;
  university: string;
  bio: string;
  subjects: string[];
  availability: string[];
  studyStyle: string[];
  goals: string[];
  rating: number;
  matchScore: number;
  studyHours: number;
  sessionsCompleted: number;
  badges: string[];
  timezone: string;
  languages: string[];
  status: 'available' | 'busy' | 'offline';
}

export default function PartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/partners/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch partner');
        }
        const data = await response.json();
        setPartner(data.data || data);
      } catch (error: any) {
        toast.error('Không thể tải thông tin bạn học');
        console.error('Error fetching partner:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full">
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50 animate-spin" />
            <h3 className="text-lg font-semibold mb-2">Đang tải thông tin...</h3>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Không tìm thấy bạn học</h1>
          <p className="text-muted-foreground mb-4">Bạn học bạn đang tìm không tồn tại.</p>
          <Link href="/matches">
            <Button>Quay lại danh sách</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSendRequest = async () => {
    if (!message.trim()) {
      toast.error('Vui lòng viết tin nhắn');
      return;
    }
    
    try {
      setSending(true);
      const response = await fetch('/api/partner-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partnerId: partner?._id || id,
          message: message.trim(),
          subject: partner?.subjects[0] || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send request');
      }

      toast.success('Đã gửi yêu cầu thành công!');
      setIsDialogOpen(false);
      setMessage('');
    } catch (error: any) {
      toast.error('Không thể gửi yêu cầu');
      console.error('Error sending request:', error);
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full">
      <Link href="/matches">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-6">
                <div className="relative w-28 h-28 flex-shrink-0">
                  <Image
                    src={partner.avatar}
                    alt={partner.name}
                    width={112}
                    height={112}
                    className="rounded-full object-cover w-full h-full"
                  />
                  <div
                    className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-background ${getStatusColor(partner.status)}`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{partner.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                          <span className="font-bold">{partner.rating}</span>
                          <span className="text-muted-foreground">({partner.reviewsCount} đánh giá)</span>
                        </div>
                      </div>
                      {partner.matchScore && (
                        <Badge className="mt-2 bg-blue-500/10 text-blue-500">
                          {partner.matchScore}% Phù hợp
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-4">{partner.bio}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg" disabled={sending}>
                    <MessageCircle className="h-5 w-5 mr-2" />
                    {sending ? 'Đang gửi...' : 'Gửi yêu cầu học cùng'}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Gửi yêu cầu học cùng đến {partner.name}</DialogTitle>
                    <DialogDescription>
                      Giới thiệu bản thân và chia sẻ những gì bạn muốn học cùng nhau
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label>Tin nhắn</Label>
                      <Textarea
                        placeholder="Chào bạn! Mình rất muốn được học cùng..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                      />
                    </div>
                    <Button onClick={handleSendRequest} className="w-full">
                      Gửi yêu cầu
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Subjects */}
          <Card>
            <CardHeader>
              <CardTitle>Môn học</CardTitle>
              <CardDescription>Lĩnh vực chuyên môn và sở thích học tập</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {partner.subjects.map((subject) => (
                  <Badge key={subject} variant="secondary" className="text-sm">
                    {subject}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Study Style */}
          <Card>
            <CardHeader>
              <CardTitle>Phong cách học tập</CardTitle>
              <CardDescription>Cách tiếp cận học tập ưa thích</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {partner.studyStyle.map((style) => (
                  <Badge key={style} variant="outline" className="text-sm">
                    {style}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Mục tiêu học tập</CardTitle>
              <CardDescription>Những gì họ đang hướng tới</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {partner.goals.map((goal, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {goal}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Thời gian rảnh</CardTitle>
              <CardDescription>Thời gian học điển hình</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {partner.availability.map((time, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {time}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Tổng giờ học</div>
                <div className="text-2xl font-bold">{partner.studyHours}h</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Phiên học hoàn thành</div>
                <div className="text-2xl font-bold">{partner.sessionsCompleted}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Đánh giá trung bình</div>
                <div className="text-2xl font-bold flex items-center gap-1">
                  {partner.rating}
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Huy hiệu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {partner.badges.map((badge) => (
                  <Badge key={badge} className="bg-purple-500/10 text-purple-500">
                    {badge}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thông tin bổ sung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Múi giờ:</span>
                <span className="font-medium">{partner.timezone}</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Languages className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <span className="text-muted-foreground">Ngôn ngữ:</span>
                  <div className="font-medium">{partner.languages.join(', ')}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Trạng thái:</span>
                <Badge className={
                  partner.status === 'available' ? 'bg-green-500/10 text-green-500' :
                  partner.status === 'busy' ? 'bg-yellow-500/10 text-yellow-500' :
                  'bg-gray-500/10 text-gray-500'
                }>
                  {partner.status === 'available' ? 'Đang rảnh' :
                   partner.status === 'busy' ? 'Đang bận' : 'Ngoại tuyến'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

