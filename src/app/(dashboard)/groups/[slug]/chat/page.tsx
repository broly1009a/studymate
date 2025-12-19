'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { vi } from '@/lib/i18n/vi';
import { toast } from 'sonner';

export default function GroupChatPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [group, setGroup] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatData = async () => {
      const token = localStorage.getItem('studymate_auth_token');
      if (!token) {
        toast.error('Please login to access group chat');
        return;
      }

      try {
        setLoading(true);
        const groupRes = await fetch(`/api/groups/${slug}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const groupData = await groupRes.json();

        if (groupData.success) {
          setGroup(groupData.data);

          const messagesRes = await fetch(`/api/groups/${slug}/messages`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const messagesData = await messagesRes.json();

          if (messagesData.success) setMessages(messagesData.data);
        }
      } catch (error) {
        console.error('Failed to fetch chat data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, [slug]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !group) return;

    const token = localStorage.getItem('studymate_auth_token');
    if (!token) {
      toast.error('Please login to send messages');
      return;
    }

    try {
      const response = await fetch(`/api/groups/${slug}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newMessage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, data.data]);
        setNewMessage('');
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-muted-foreground">Group not found</h2>
        <p className="text-muted-foreground mt-2">The group you're looking for doesn't exist.</p>
        <Link href="/groups">
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Groups
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/groups/${slug}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Group
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{group.name} - Chat</h1>
            <p className="text-sm text-muted-foreground">
              {group.members_count} members
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle>Group Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message: any) => (
                <div key={message._id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {(message.sender?.fullName || 'Anonymous').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {message.sender?.fullName || 'Anonymous'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{message.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}