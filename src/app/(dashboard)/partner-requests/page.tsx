'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Clock, Loader2, MessageCircle, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { API_URL } from '@/lib/constants';

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

  const fetchRequests = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

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
     <div className="space-y-6">
      <div className="flex items-center justify-between">
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
  );
}
