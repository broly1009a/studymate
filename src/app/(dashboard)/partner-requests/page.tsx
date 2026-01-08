'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Clock, Loader2, MessageCircle, Trash2, User, GraduationCap, Sparkles, Search, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { API_URL } from '@/lib/constants';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { AUTH_TOKEN_KEY } from '@/lib/constants';
interface PartnerRequest {
  _id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
  subject: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export default function PartnerRequestsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('received');
  const [receivedRequests, setReceivedRequests] = useState<PartnerRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<PartnerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileCompletion, setProfileCompletion] = useState(0);

  const fetchRequests = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Fetch user profile
      const profileResponse = await fetch(`${API_URL}/profiles/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
        },
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        
        if (profileData.profile) {
          const profile = profileData.profile;
          setUserProfile(profile);
          
          // Calculate profile completion based on actual API structure
          const fields = [
            profile.bio,
            profile.education?.institution,
            profile.education?.major,
            profile.learningNeeds?.length > 0,
            profile.learningGoals?.length > 0,
            profile.skills?.length > 0,
            profile.profileImages?.length > 0,
            profile.mbtiType,
          ];
          
          const completed = fields.filter(Boolean).length;
          const completionPercentage = Math.round((completed / fields.length) * 100);
          setProfileCompletion(completionPercentage);
        }
      }

      // Fetch received requests
      const receivedResponse = await fetch(
        `${API_URL}/partner-requests?userId=${user.id}&type=received`
      );
      const receivedData = await receivedResponse.json();
      if (receivedData.success) {
        setReceivedRequests(receivedData.data);
      }

      // Fetch sent requests
      const sentResponse = await fetch(
        `${API_URL}/partner-requests?userId=${user.id}&type=sent`
      );
      const sentData = await sentResponse.json();
      if (sentData.success) {
        setSentRequests(sentData.data);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      toast.error('Không thể tải danh sách yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user?.id]);

  const handleAccept = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      const response = await fetch(`${API_URL}/partner-requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'accepted',
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to accept request');
      }

      toast.success('Đã chấp nhận yêu cầu! Bạn có thể bắt đầu nhắn tin.');
      fetchRequests();

      // Navigate to messages if conversation was created
      if (data.data?.conversation) {
        setTimeout(() => {
          router.push('/messages');
        }, 1500);
      }
    } catch (error: any) {
      toast.error(error.message || 'Không thể chấp nhận yêu cầu');
      console.error('Error accepting request:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      const response = await fetch(`${API_URL}/partner-requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'rejected',
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reject request');
      }

      toast.success('Đã từ chối yêu cầu');
      fetchRequests();
    } catch (error: any) {
      toast.error(error.message || 'Không thể từ chối yêu cầu');
      console.error('Error rejecting request:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      const response = await fetch(`${API_URL}/partner-requests/${requestId}?userId=${user?.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel request');
      }

      toast.success('Đã hủy yêu cầu');
      fetchRequests();
    } catch (error: any) {
      toast.error(error.message || 'Không thể hủy yêu cầu');
      console.error('Error cancelling request:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-300">
          <Clock className="h-3 w-3 mr-1" />
          Đang chờ
        </Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-300">
          <Check className="h-3 w-3 mr-1" />
          Đã chấp nhận
        </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-300">
          <X className="h-3 w-3 mr-1" />
          Đã từ chối
        </Badge>;
      default:
        return null;
    }
  };

  const ReceivedRequestCard = ({ request }: { request: PartnerRequest }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={request.senderAvatar} alt={request.senderName} />
              <AvatarFallback>{request.senderName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{request.senderName}</CardTitle>
              <CardDescription className="text-xs">
                {formatDistanceToNow(new Date(request.createdAt), { locale: vi, addSuffix: true })}
              </CardDescription>
            </div>
          </div>
          {getStatusBadge(request.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Môn học:</p>
          <Badge variant="secondary">{request.subject}</Badge>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Tin nhắn:</p>
          <p className="text-sm bg-muted p-3 rounded-lg">{request.message}</p>
        </div>
        {request.status === 'pending' && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => handleAccept(request._id)}
              disabled={processingId === request._id}
              className="flex-1"
            >
              {processingId === request._id ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Chấp nhận
            </Button>
            <Button
              onClick={() => handleReject(request._id)}
              disabled={processingId === request._id}
              variant="outline"
              className="flex-1"
            >
              {processingId === request._id ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <X className="h-4 w-4 mr-2" />
              )}
              Từ chối
            </Button>
          </div>
        )}
        {request.status === 'accepted' && (
          <Button
            onClick={() => router.push('/messages')}
            className="w-full"
            variant="outline"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Nhắn tin
          </Button>
        )}
      </CardContent>
    </Card>
  );

  const SentRequestCard = ({ request }: { request: PartnerRequest }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={request.receiverAvatar} alt={request.receiverName} />
              <AvatarFallback>{request.receiverName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{request.receiverName}</CardTitle>
              <CardDescription className="text-xs">
                {formatDistanceToNow(new Date(request.createdAt), { locale: vi, addSuffix: true })}
              </CardDescription>
            </div>
          </div>
          {getStatusBadge(request.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Môn học:</p>
          <Badge variant="secondary">{request.subject}</Badge>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Tin nhắn của bạn:</p>
          <p className="text-sm bg-muted p-3 rounded-lg">{request.message}</p>
        </div>
        {request.status === 'pending' && (
          <Button
            onClick={() => handleCancel(request._id)}
            disabled={processingId === request._id}
            variant="outline"
            className="w-full"
          >
            {processingId === request._id ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Hủy yêu cầu
          </Button>
        )}
        {request.status === 'accepted' && (
          <Button
            onClick={() => router.push('/messages')}
            className="w-full"
            variant="outline"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Nhắn tin
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      {/* LEFT COLUMN - Main Content (7/10) */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Yêu cầu học cùng</h1>
          <p className="text-muted-foreground">
            Quản lý các yêu cầu học cùng từ bạn học khác
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="received">
              Nhận được ({receivedRequests.filter(r => r.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="sent">
              Đã gửi ({sentRequests.filter(r => r.status === 'pending').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : receivedRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="text-6xl mb-4">📬</div>
                  <h3 className="text-lg font-semibold mb-2">Chưa có yêu cầu nào</h3>
                  <p className="text-muted-foreground">
                    Bạn chưa nhận được yêu cầu học cùng nào
                  </p>
                </CardContent>
              </Card>
            ) : (
              receivedRequests.map((request) => (
                <ReceivedRequestCard key={request._id} request={request} />
              ))
            )}
          </TabsContent>

          <TabsContent value="sent" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : sentRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="text-6xl mb-4">✉️</div>
                  <h3 className="text-lg font-semibold mb-2">Chưa gửi yêu cầu nào</h3>
                  <p className="text-muted-foreground">
                    Bạn chưa gửi yêu cầu học cùng cho ai
                  </p>
                </CardContent>
              </Card>
            ) : (
              sentRequests.map((request) => (
                <SentRequestCard key={request._id} request={request} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* RIGHT COLUMN - Sidebar (3/10) */}
      <div className="lg:col-span-3 space-y-4">
        {/* Profile Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              Hồ sơ của bạn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16">
                <AvatarImage 
                  src={userProfile?.profileImages?.[0]?.url || user?.avatar} 
                  alt={user?.fullName} 
                />
                <AvatarFallback className="bg-[#6059f7] text-white text-xl">
                  {user?.fullName?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{user?.fullName}</h3>
                <p className="text-xs text-muted-foreground truncate">
                  {userProfile?.education?.major || 'Chưa cập nhật ngành'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {userProfile?.education?.institution || 'Chưa cập nhật trường'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Độ hoàn thiện</span>
                <span className="font-semibold text-[#6059f7]">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-2" />
            </div>

            <Button asChild variant="outline" className="w-full" size="sm">
              <Link href="/profile">
                Xem hồ sơ đầy đủ
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Subjects Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Môn học quan tâm
              </span>
              <Button asChild variant="ghost" size="sm" className="h-7 px-2">
                <Link href="/profile">
                  <Edit className="h-3 w-3" />
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userProfile?.skills && userProfile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userProfile.skills.slice(0, 6).map((skill: any, index: number) => (
                  <Badge key={skill.id || index} variant="secondary" className="text-xs">
                    {typeof skill === 'string' ? skill : skill.name}
                  </Badge>
                ))}
                {userProfile.skills.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{userProfile.skills.length - 6}
                  </Badge>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-2">
                Chưa thêm môn học nào
              </p>
            )}
          </CardContent>
        </Card>

        {/* CTA Card */}
        <Card className="border-2 border-[#6059f7] bg-gradient-to-br from-[#6059f7]/5 to-[#6059f7]/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#6059f7] text-white flex items-center justify-center mx-auto">
                <Search className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Tìm bạn học ngay</h3>
                <p className="text-xs text-muted-foreground">
                  Khám phá hàng nghìn bạn học cùng chí hướng
                </p>
              </div>
              <Button asChild className="w-full" size="sm">
                <Link href="/matches">
                  <Search className="h-4 w-4 mr-2" />
                  Tìm kiếm ngay
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-amber-900">
              <Sparkles className="h-4 w-4" />
              Gợi ý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-xs text-amber-900">
              {profileCompletion < 100 && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>Hoàn thiện hồ sơ để nhận nhiều yêu cầu hơn</span>
                </li>
              )}
              {(!userProfile?.skills || userProfile.skills.length === 0) && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>Thêm môn học quan tâm để dễ tìm bạn học phù hợp</span>
                </li>
              )}
              {receivedRequests.filter(r => r.status === 'pending').length > 0 && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>Bạn có {receivedRequests.filter(r => r.status === 'pending').length} yêu cầu đang chờ phản hồi</span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>Phản hồi nhanh sẽ tăng cơ hội kết nối</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>Viết tin nhắn rõ ràng khi gửi yêu cầu</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
