'use client';

import { use, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getGroupById, getGroupMessages } from '@/lib/mock-data/groups';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { vi } from '@/lib/i18n/vi';

export default function GroupChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const group = getGroupById(id);
  const messages = group ? getGroupMessages(group.id) : [];
  const [newMessage, setNewMessage] = useState('');

  if (!group) {
    return <div className="w-full">Không tìm thấy nhóm</div>;
  }

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setNewMessage('');
  };

  return (
    <div className="w-full">
      <Link href={`/groups/${id}`}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Group
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{group.name} - Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto space-y-4 p-4 border rounded-lg mb-4">
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-3">
                  <Image
                    src={msg.userAvatar}
                    alt={msg.userName}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{msg.userName}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

