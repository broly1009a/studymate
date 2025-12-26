'use client';

import { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/hooks/use-socket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { API_URL } from '@/lib/constants';
interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  createdAt: string;
}

interface ChatRealtimeProps {
  conversationId: string;
  currentUserId: string;
  currentUserName: string;
}

export default function ChatRealtime({
  conversationId,
  currentUserId,
  currentUserName,
}: ChatRealtimeProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
    onNewMessage,
    onUserTyping,
    onUserStopTyping,
  } = useSocket();

  useEffect(() => {
    // Join conversation
    joinConversation(conversationId);

    // Load initial messages
    fetchMessages();

    // Listen for new messages
    const unsubscribeNewMessage = onNewMessage((data) => {
      setMessages((prev) => [...prev, data.message]);
    });

    // Listen for typing
    const unsubscribeTyping = onUserTyping((data) => {
      if (data.userId !== currentUserId) {
        setIsTyping(true);
      }
    });

    const unsubscribeStopTyping = onUserStopTyping((data) => {
      if (data.userId !== currentUserId) {
        setIsTyping(false);
      }
    });

    return () => {
      leaveConversation(conversationId);
      unsubscribeNewMessage();
      unsubscribeTyping();
      unsubscribeStopTyping();
    };
  }, [conversationId, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/messages?conversationId=${conversationId}`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          senderId: currentUserId,
          senderName: currentUserName,
          content: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        stopTyping(conversationId, currentUserId);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTyping = () => {
    startTyping(conversationId, currentUserId, currentUserName);
    // Auto stop typing after 3 seconds
    setTimeout(() => stopTyping(conversationId, currentUserId), 3000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${
                message.senderId === currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === currentUserId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm font-medium">{message.senderName}</p>
                <p>{message.content}</p>
                <p className="text-xs opacity-70">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-200 px-4 py-2 rounded-lg">
                <p className="text-sm text-gray-500">Someone is typing...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleTyping}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={!newMessage.trim()}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}