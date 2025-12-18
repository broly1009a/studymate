'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useAuth } from '@/hooks/use-auth';
import { useSocket } from '@/hooks/use-socket';

interface Conversation {
  _id: string;
  participants: string[];
  participantNames: string[];
  lastMessage: string;
  lastMessageTime: Date;
  unreadCounts: Record<string, number>;
  isActive: boolean;
}

interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: string;
  read: boolean;
  createdAt: Date;
}

export default function MessagesPage() {
  const { user } = useAuth();
  console.log('Current User:', user);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const lastConversationIdRef = useRef<string | null>(null);
  const { joinConversation, leaveConversation, onNewMessage } = useSocket();

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/conversations?userId=${user.id}`);
      const data = await response.json();
      if (data.success) {
        setConversations(data.data);
        if (!selectedConversation && data.data.length > 0) {
          setSelectedConversation(data.data[0]);
        }
        // Join all conversations to receive realtime updates
        data.data.forEach((conv: Conversation) => {
          joinConversation(conv._id);
        });
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  }, [user?.id, joinConversation]); // Remove selectedConversation dependency

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, []);

  // Handle new message from socket
  const handleNewMessage = useCallback((data: any) => {
    // If message is for current conversation, add it to messages
    if (selectedConversation && data.message.conversationId === selectedConversation._id) {
      setMessages((prev) => [...prev, data.message]);
    }
    
    // Always update conversation list with new message and unread counts
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv._id === data.conversation._id) {
          return { 
            ...conv, 
            lastMessage: data.conversation.lastMessage, 
            lastMessageTime: data.conversation.lastMessageTime, 
            unreadCounts: data.conversation.unreadCounts 
          };
        }
        return conv;
      })
    );
  }, [selectedConversation?._id]);

  useEffect(() => {
    const unsubscribe = onNewMessage(handleNewMessage);
    return unsubscribe;
  }, [onNewMessage, handleNewMessage]);

  // Load initial data
  useEffect(() => {
    if (user?.id) {
      fetchConversations();
      setIsLoading(false);
    }
  }, [user?.id]); // Only depend on user ID

  // Mark messages as read
  const markAsRead = useCallback(async (conversationId: string) => {
    if (!user?.id) return;

    // Update UI immediately
    setConversations((prev) =>
      prev.map((conv) =>
        conv._id === conversationId
          ? { ...conv, unreadCounts: { ...conv.unreadCounts, [user.id]: 0 } }
          : conv
      )
    );

    try {
      await fetch(`/api/conversations/${conversationId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });
    } catch (error) {
      console.error('Failed to mark as read:', error);
      // Revert UI change if API fails
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === conversationId
            ? { ...conv, unreadCounts: { ...conv.unreadCounts, [user.id]: (conv.unreadCounts[user.id] || 0) + 1 } }
            : conv
        )
      );
    }
  }, [user?.id]);

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversation && selectedConversation._id !== lastConversationIdRef.current) {
      lastConversationIdRef.current = selectedConversation._id;
      fetchMessages(selectedConversation._id);
      markAsRead(selectedConversation._id);
      // No need to join here since we already joined all conversations on load
    }
  }, [selectedConversation?._id, fetchMessages, markAsRead]);

  const filteredConversations = conversations.filter((conv) =>
    conv.participantNames.some(name => name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversation._id,
          senderId: user.id,
          senderName: user.fullName,
          senderAvatar: user.avatar,
          content: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage('');
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
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
          {filteredConversations.map((conversation) => {
            const partnerName = conversation.participantNames.find(name => name !== user?.fullName) || 'Unknown';
            const unreadCount = conversation.unreadCounts[user?.id || ''] || 0;

            return (
              <div
                key={conversation._id}
                className={`flex items-center gap-3 p-3 hover:bg-accent cursor-pointer ${
                  selectedConversation?._id === conversation._id ? 'bg-accent' : ''
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="relative">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback>{partnerName[0]}</AvatarFallback>
                  </Avatar>
                  {/* TODO: Add online status if available */}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm truncate">{partnerName}</h3>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(conversation.lastMessageTime), { locale: vi, addSuffix: false })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    {unreadCount > 0 && (
                      <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Center - Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="h-16 border-b px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {selectedConversation.participantNames.find(name => name !== user?.fullName)?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">
                  {selectedConversation.participantNames.find(name => name !== user?.fullName) || 'Unknown'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {/* TODO: Add online status */}
                  Đang hoạt động
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
              const isMe = message.senderId === user?.id;
              const showAvatar = index === messages.length - 1 || messages[index + 1]?.senderId !== message.senderId;

              return (
                <div key={message._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
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
              <AvatarFallback>
                {selectedConversation.participantNames.find(name => name !== user?.fullName)?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">
              {selectedConversation.participantNames.find(name => name !== user?.fullName) || 'Unknown'}
            </h2>
            <p className="text-sm text-muted-foreground mb-1">
              Đang hoạt động
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

