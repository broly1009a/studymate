import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
        transports: ['websocket', 'polling'],
      });
    }
    socketRef.current = socket;

    return () => {
      // Don't disconnect on unmount, keep connection alive
    };
  }, []);

  const joinConversation = (conversationId: string) => {
    socket?.emit('join-conversation', conversationId);
  };

  const leaveConversation = (conversationId: string) => {
    socket?.emit('leave-conversation', conversationId);
  };

  const startTyping = (conversationId: string, userId: string, userName: string) => {
    socket?.emit('typing-start', { conversationId, userId, userName });
  };

  const stopTyping = (conversationId: string, userId: string) => {
    socket?.emit('typing-stop', { conversationId, userId });
  };

  const onNewMessage = (callback: (data: any) => void): (() => void) => {
    socket?.on('new-message', callback);
    return () => {
      socket?.off('new-message', callback);
    };
  };

  const onUserTyping = (callback: (data: any) => void): (() => void) => {
    socket?.on('user-typing', callback);
    return () => {
      socket?.off('user-typing', callback);
    };
  };

  const onUserStopTyping = (callback: (data: any) => void): (() => void) => {
    socket?.on('user-stop-typing', callback);
    return () => {
      socket?.off('user-stop-typing', callback);
    };
  };

  return {
    socket: socketRef.current,
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
    onNewMessage,
    onUserTyping,
    onUserStopTyping,
  };
};