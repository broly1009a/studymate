'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  MoreHorizontal,
  Edit,
  Send,
  Phone,
  Video,
  Info,
  Smile,
  Image as ImageIcon,
  Paperclip,
  ThumbsUp,
} from 'lucide-react';
import Link from 'next/link';
import { getConversations, getMessagesByConversationId, type Conversation } from '@/lib/mock-data/messages';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function MessagesPage() {
  const conversations = getConversations();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0] || null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const messages = selectedConversation ? getMessagesByConversationId(selectedConversation.id) : [];

  const filteredConversations = conversations.filter((conv) =>
    conv.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // TODO: Implement send message
    setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Left Sidebar - Conversations List */}
      <div className="w-80 border-r bg-background flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Chats</h1>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Edit className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Messenger"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 px-4 py-2 border-b">
          <Button variant="ghost" size="sm" className="text-primary">
            All
          </Button>
          <Button variant="ghost" size="sm">
            Unread
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/messages/messgroups">Groups</Link>
          </Button>

        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex items-center gap-3 p-3 hover:bg-accent cursor-pointer ${selectedConversation?.id === conversation.id ? 'bg-accent' : ''
                }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="relative">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={conversation.partnerAvatar} alt={conversation.partnerName} />
                  <AvatarFallback>{conversation.partnerName[0]}</AvatarFallback>
                </Avatar>
                {conversation.isOnline && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm truncate">{conversation.partnerName}</h3>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(conversation.lastMessageTime), { locale: vi, addSuffix: false })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                  {conversation.unreadCount > 0 && (
                    <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center - Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="h-16 border-b px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedConversation.partnerAvatar} alt={selectedConversation.partnerName} />
                <AvatarFallback>{selectedConversation.partnerName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{selectedConversation.partnerName}</h2>
                <p className="text-xs text-muted-foreground">
                  {selectedConversation.isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5 text-primary" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5 text-primary" />
              </Button>
              <Button variant="ghost" size="icon">
                <Info className="h-5 w-5 text-primary" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((message, index) => {
              const isMe = message.senderId === 'me';
              const showAvatar = index === messages.length - 1 || messages[index + 1]?.senderId !== message.senderId;

              return (
                <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                  {!isMe && (
                    <Avatar className={`h-7 w-7 ${showAvatar ? '' : 'invisible'}`}>
                      <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                      <AvatarFallback>{message.senderName[0]}</AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`max-w-[60%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div
                      className={`px-4 py-2 rounded-2xl ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {message.reactions.map((reaction, idx) => (
                          <span key={idx} className="text-xs bg-background border rounded-full px-2 py-0.5">
                            {reaction.emoji}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {isMe && <div className="w-7" />}
                </div>
              );
            })}
          </div>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ImageIcon className="h-5 w-5 text-primary" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Paperclip className="h-5 w-5 text-primary" />
              </Button>

              <div className="flex-1 relative">
                <Input
                  placeholder="Aa"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="rounded-full pr-10"
                />
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full">
                  <Smile className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>

              {newMessage.trim() ? (
                <Button size="icon" className="rounded-full" onClick={handleSendMessage}>
                  <Send className="h-5 w-5" />
                </Button>
              ) : (
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ThumbsUp className="h-5 w-5 text-primary" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Chọn một cuộc trò chuyện để bắt đầu</p>
        </div>
      )}

      {/* Right Sidebar - Chat Info */}
      {selectedConversation && (
        <div className="w-80 border-l bg-background p-4 overflow-y-auto">
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar className="h-24 w-24 mb-3">
              <AvatarImage src={selectedConversation.partnerAvatar} alt={selectedConversation.partnerName} />
              <AvatarFallback>{selectedConversation.partnerName[0]}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{selectedConversation.partnerName}</h2>
            <p className="text-sm text-muted-foreground mb-1">
              {selectedConversation.isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
            </p>
            <Badge variant="secondary" className="text-xs">
              🔒 End-to-end encrypted
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="flex justify-around">
              <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-1">
                  <span className="text-lg">👤</span>
                </div>
                <span className="text-xs">Profile</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-1">
                  <span className="text-lg">🔔</span>
                </div>
                <span className="text-xs">Mute</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-1">
                  <span className="text-lg">🔍</span>
                </div>
                <span className="text-xs">Search</span>
              </Button>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Chat Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer">
                  <span className="text-lg">📱</span>
                  <span>Customise chat</span>
                </div>
                <div className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer">
                  <span className="text-lg">🎨</span>
                  <span>Media and files</span>
                </div>
                <div className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer">
                  <span className="text-lg">📁</span>
                  <span>Files</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Privacy and support</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Notifications: On</p>
                <p>Ignore messages: Off</p>
                <p>Block messages: Off</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

