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

  const emitMessagesRead = (conversationId: string, userId: string) => {
    socket?.emit('messages-read', { conversationId, userId });
  };

  const onMessagesRead = (callback: (data: any) => void): (() => void) => {
    socket?.on('messages-marked-read', callback);
    return () => {
      socket?.off('messages-marked-read', callback);
    };
  };

  // Voice Call Events
  const initiateCall = (conversationId: string, callerId: string, callerName: string) => {
    socket?.emit('initiate-call', { conversationId, callerId, callerName });
  };

  const acceptCall = (conversationId: string, userId: string) => {
    socket?.emit('accept-call', { conversationId, userId });
  };

  const rejectCall = (conversationId: string, userId: string) => {
    socket?.emit('reject-call', { conversationId, userId });
  };

  const endCall = (conversationId: string, userId: string) => {
    socket?.emit('end-call', { conversationId, userId });
  };

  const sendCallSignal = (conversationId: string, userId: string, signal: any) => {
    socket?.emit('call-signal', { conversationId, userId, signal });
  };

  const onIncomingCall = (callback: (data: any) => void): (() => void) => {
    socket?.on('incoming-call', callback);
    return () => {
      socket?.off('incoming-call', callback);
    };
  };

  const onCallAccepted = (callback: (data: any) => void): (() => void) => {
    socket?.on('call-accepted', callback);
    return () => {
      socket?.off('call-accepted', callback);
    };
  };

  const onCallRejected = (callback: (data: any) => void): (() => void) => {
    socket?.on('call-rejected', callback);
    return () => {
      socket?.off('call-rejected', callback);
    };
  };

  const onCallEnded = (callback: (data: any) => void): (() => void) => {
    socket?.on('call-ended', callback);
    return () => {
      socket?.off('call-ended', callback);
    };
  };

  const onCallSignal = (callback: (data: any) => void): (() => void) => {
    socket?.on('call-signal', callback);
    return () => {
      socket?.off('call-signal', callback);
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
    emitMessagesRead,
    onMessagesRead,
    // Voice Call
    initiateCall,
    acceptCall,
    rejectCall,
    endCall,
    sendCallSignal,
    onIncomingCall,
    onCallAccepted,
    onCallRejected,
    onCallEnded,
    onCallSignal,
  };
};