'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MessageCircle, Star, Clock, Users, Calendar, Globe, Languages, Loader2, BookOpen, GraduationCap, MapPin, Mail, Target, Award, Trophy, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';

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
  reviewsCount?: number;
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
  const { user } = useAuth();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [existingRequest, setExistingRequest] = useState<{
    _id: string;
    status: 'pending' | 'accepted' | 'rejected';
  } | null>(null);
  const [checkingRequest, setCheckingRequest] = useState(false);

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

  // Check if there's an existing request
  useEffect(() => {
    const checkExistingRequest = async () => {
      if (!user?.id || !partner?._id) return;

      try {
        setCheckingRequest(true);
        const response = await fetch(
          `/api/partner-requests?userId=${user.id}&type=sent&status=pending`
        );
        const data = await response.json();

        if (data.success && data.data) {
          // Find request to this specific partner
          const request = data.data.find(
            (req: any) => String(req.receiverId) === String(partner.userId) // Compare with userId
          );
          if (request) {
            setExistingRequest({
              _id: request._id,
              status: request.status,
            });
          }
        }
      } catch (error) {
        console.error('Failed to check existing request:', error);
      } finally {
        setCheckingRequest(false);
      }
    };

    checkExistingRequest();
  }, [user?.id, partner?._id]);

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

    if (!user) {
      toast.error('Bạn cần đăng nhập để gửi yêu cầu');
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
          senderId: user.id,
          senderName: user.fullName,
          senderAvatar: user.avatar,
          receiverId: partner?.userId || id, 
          receiverName: partner?.name,
          receiverAvatar: partner?.avatar,
          message: message.trim(),
          subject: partner?.subjects[0] || '',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send request');
      }

      toast.success('Đã gửi yêu cầu thành công!');
      setIsDialogOpen(false);
      setMessage('');
      
      // Update existing request state
      const result = await response.json();
      if (result.data) {
        setExistingRequest({
          _id: result.data._id,
          status: 'pending',
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Không thể gửi yêu cầu');
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
      {/* Cover Photo */}
      <div className="relative w-full h-52 md:h-64 overflow-hidden bg-gradient-to-br from-blue-400 via-teal-400 to-green-400">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop"
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
        <Link href="/matches">
          <Button 
            variant="secondary" 
            size="sm" 
            className="absolute top-4 left-4 md:left-6 bg-white/95 hover:bg-white backdrop-blur-sm shadow-lg border-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>
      </div>

      {/* Profile Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-8">
        {/* Avatar and Basic Info */}
        <div className="relative">
          {/* Avatar Container */}
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 -mt-16 md:-mt-20">
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background bg-background overflow-hidden shadow-2xl">
                <Image
                  src={partner.avatar}
                  alt={partner.name}
                  width={160}
                  height={160}
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
              <div
                className={`absolute bottom-2 right-2 md:bottom-3 md:right-3 w-5 h-5 md:w-6 md:h-6 rounded-full border-4 border-background ${getStatusColor(partner.status)} shadow-lg`}
              />
            </div>

            {/* Name and University - Desktop */}
            <div className="hidden md:block flex-1 pb-2">
              <h1 className="text-xl lg:text-2xl font-bold">{partner.name}</h1>
              <p className="text-sm lg:text-base text-muted-foreground flex items-center gap-2 mt-1">
                <GraduationCap className="h-4 w-4" />
                {partner.major} • {partner.university}
              </p>
            </div>

            {/* Action Button - Desktop */}
            <div className="hidden md:block pb-2">
              {existingRequest ? (
                <div className="space-y-2">
                  {existingRequest.status === 'pending' && (
                    <>
                      <Badge className="px-4 py-2 bg-yellow-500/10 text-yellow-600 border-yellow-300">
                        <Clock className="h-4 w-4 mr-2" />
                        Đã gửi yêu cầu
                      </Badge>
                    </>
                  )}
                  {existingRequest.status === 'accepted' && (
                    <Button
                      onClick={() => router.push('/messages')}
                      size="lg"
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Nhắn tin
                    </Button>
                  )}
                  {existingRequest.status === 'rejected' && (
                    <Badge className="px-4 py-2 bg-red-500/10 text-red-600 border-red-300">
                      Đã bị từ chối
                    </Badge>
                  )}
                </div>
              ) : (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg" 
                      disabled={sending || checkingRequest}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      {checkingRequest ? 'Đang kiểm tra...' : sending ? 'Đang gửi...' : 'Kết nối'}
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
              )}
            </div>
          </div>

          {/* Name and University - Mobile */}
          <div className="md:hidden mt-4 space-y-3">
            <div>
              <h1 className="text-2xl font-bold">{partner.name}</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <GraduationCap className="h-4 w-4" />
                {partner.major} • {partner.university}
              </p>
            </div>

            {/* Action Button - Mobile */}
            <div className="pt-1">
              {existingRequest ? (
                <div className="space-y-2">
                  {existingRequest.status === 'pending' && (
                    <>
                      <Badge className="w-full justify-center py-2 bg-yellow-500/10 text-yellow-600 border-yellow-300">
                        <Clock className="h-4 w-4 mr-2" />
                        Đã gửi yêu cầu
                      </Badge>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => router.push('/partner-requests')}
                      >
                        Xem yêu cầu
                      </Button>
                    </>
                  )}
                  {existingRequest.status === 'accepted' && (
                    <Button
                      className="w-full"
                      onClick={() => router.push('/messages')}
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Nhắn tin
                    </Button>
                  )}
                  {existingRequest.status === 'rejected' && (
                    <Badge className="w-full justify-center py-2 bg-red-500/10 text-red-600 border-red-300">
                      Đã bị từ chối
                    </Badge>
                  )}
                </div>
              ) : (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full"
                      size="lg" 
                      disabled={sending || checkingRequest}
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      {checkingRequest ? 'Kiểm tra...' : sending ? 'Đang gửi...' : 'Kết nối'}
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
              )}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-6 mb-6">
          <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Calendar className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tuổi</p>
              <p className="font-semibold text-sm md:text-base">{partner.age}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Chuyên ngành</p>
              <p className="font-semibold text-xs md:text-sm truncate">{partner.major}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Globe className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Múi giờ</p>
              <p className="font-semibold text-xs md:text-sm truncate">{partner.timezone}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Star className="h-4 w-4 md:h-5 md:w-5 text-amber-600 fill-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">GPA</p>
              <p className="font-semibold text-sm md:text-base">{partner.rating}</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{partner.bio}</p>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-green-500/10">
                      <Clock className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{partner.studyHours}</p>
                      <p className="text-xs text-muted-foreground">Giờ học</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-blue-500/10">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{partner.sessionsCompleted}</p>
                      <p className="text-xs text-muted-foreground">Câu hỏi đã trả lời</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-amber-500">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-amber-500/10">
                      <Zap className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{partner.badges.length}</p>
                      <p className="text-xs text-muted-foreground">Nhóm học</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subjects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Kỹ năng
                </CardTitle>
                <CardDescription>Content Marketing, SEO, Data Analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {partner.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary" className="text-sm px-3 py-1">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Study Style */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Thời gian học
                </CardTitle>
                <CardDescription>Đầy sớm, Học tốt khi deadline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {partner.studyStyle.map((style) => (
                    <Badge key={style} variant="outline" className="text-sm px-3 py-1">
                      {style}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Sở thích
                </CardTitle>
                <CardDescription>Tìm bạn đồng hành học môn Luyện IELTS / TOEIC</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {partner.goals.map((goal, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Availability */}
            {partner.availability && partner.availability.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Thời gian rảnh
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {partner.availability.map((time, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Thống kê */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Thống kê
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">Điểm học</span>
                  <span className="text-xl font-bold text-green-600">1.850</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">Câu hỏi đã trả lời</span>
                  <span className="text-xl font-bold text-blue-600">350</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">Bạn học</span>
                  <span className="text-xl font-bold text-purple-600">60</span>
                </div>
              </CardContent>
            </Card>

            {/* Thành tích */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Thành tích
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-xl border bg-muted/30 transition-all duration-300 hover:shadow-md hover:border-amber-400/50">
                  <h4 className="font-semibold text-sm">🏆 Top 1 Data Science</h4>
                  <p className="text-xs text-muted-foreground mt-1">Đạt giải nhất cuộc thi quốc gia</p>
                  <p className="text-xs text-muted-foreground">15/03/2024</p>
                </div>

                <div className="p-3 rounded-xl border bg-muted/30 transition-all duration-300 hover:shadow-md hover:border-blue-400/50">
                  <h4 className="font-semibold text-sm">🧠 Giải nhất Mori-talent</h4>
                  <p className="text-xs text-muted-foreground mt-1">Dự án marketing xuất sắc</p>
                  <p className="text-xs text-muted-foreground">15/03/2024</p>
                </div>

                <div className="p-3 rounded-xl border bg-muted/30 transition-all duration-300 hover:shadow-md hover:border-green-400/50">
                  <h4 className="font-semibold text-sm">💻 Top 2 Sinh viên</h4>
                  <p className="text-xs text-muted-foreground mt-1">Top 2 cuộc thi Sinh viên tạo giải pháp xã hội</p>
                  <p className="text-xs text-muted-foreground">14/12/2024</p>
                </div>
              </CardContent>
            </Card>

            {/* Hoạt động gần đây */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Hoạt động gần đây
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  <div>
                    <p className="font-medium">Đạt Top 10 Marketing In Your Eyes</p>
                    <p className="text-xs text-muted-foreground">4 tháng trước</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Languages & Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Thông tin khác</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <Languages className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Ngôn ngữ</p>
                    <p className="font-medium">{partner.languages.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Trạng thái</p>
                    <Badge className={
                      partner.status === 'available' ? 'bg-green-500/10 text-green-500' :
                      partner.status === 'busy' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-gray-500/10 text-gray-500'
                    }>
                      {partner.status === 'available' ? 'Đang rảnh' :
                       partner.status === 'busy' ? 'Đang bận' : 'Ngoại tuyến'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

