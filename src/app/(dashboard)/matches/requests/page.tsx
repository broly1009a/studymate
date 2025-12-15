'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getPartnerRequests } from '@/lib/mock-data/partners';
import { Check, X, Send, Inbox } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from '@/lib/i18n/vi';

export default function PartnerRequestsPage() {
  const [filter, setFilter] = useState<'all' | 'received' | 'sent'>('all');
  const requests = getPartnerRequests(filter === 'all' ? undefined : filter);

  const handleAccept = (requestId: string, partnerName: string) => {
    toast.success(`Đã chấp nhận yêu cầu từ ${partnerName}`);
  };

  const handleReject = (requestId: string, partnerName: string) => {
    toast.success(`Đã từ chối yêu cầu từ ${partnerName}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500';
      case 'accepted': return 'bg-green-500/10 text-green-500';
      case 'rejected': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Partner Requests</h1>
        <p className="text-muted-foreground mt-2">Manage your study partner requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {requests.filter(r => r.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {requests.filter(r => r.status === 'accepted').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'received' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('received')}
        >
          <Inbox className="h-4 w-4 mr-2" />
          Received
        </Button>
        <Button
          variant={filter === 'sent' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('sent')}
        >
          <Send className="h-4 w-4 mr-2" />
          Sent
        </Button>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Inbox className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Requests</h3>
              <p className="text-muted-foreground mb-4">
                {filter === 'received' 
                  ? "You haven't received any requests yet"
                  : filter === 'sent'
                  ? "You haven't sent any requests yet"
                  : "No requests to display"}
              </p>
              <Link href="/matches">
                <Button>Find Study Partners</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          requests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Link href={`/matches/${request.partnerId}`}>
                    <Image
                      src={request.partnerAvatar}
                      alt={request.partnerName}
                      width={64}
                      height={64}
                      className="rounded-full hover:opacity-80 transition-opacity"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/matches/${request.partnerId}`}>
                          <CardTitle className="text-lg hover:underline">
                            {request.partnerName}
                          </CardTitle>
                        </Link>
                        <CardDescription className="mt-1">
                          {request.type === 'received' ? 'Sent you a request' : 'You sent a request'}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                        <Badge variant="outline">{request.subject}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 bg-muted/50 p-3 rounded-lg">
                      "{request.message}"
                    </p>
                    <div className="text-xs text-muted-foreground mt-2">
                      {format(new Date(request.createdAt), 'MMM d, yyyy • h:mm a')}
                    </div>
                  </div>
                </div>
              </CardHeader>
              {request.status === 'pending' && request.type === 'received' && (
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAccept(request.id, request.partnerName)}
                      className="flex-1"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleReject(request.id, request.partnerName)}
                      variant="outline"
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

