'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import SimplePeer from 'simple-peer';
import { useSocket } from './use-socket';

interface UseWebRTCProps {
  conversationId: string;
  currentUserId: string;
  currentUserName: string;
}

export type CallStatus = 'idle' | 'calling' | 'ringing' | 'connected' | 'ended';

export const useWebRTC = ({ conversationId, currentUserId, currentUserName }: UseWebRTCProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [remoteUserName, setRemoteUserName] = useState('');
  
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  const {
    socket,
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
  } = useSocket();

  // Initialize remote audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      remoteAudioRef.current = new Audio();
      remoteAudioRef.current.autoplay = true;
    }
  }, []);

  // Start call - người gọi
  const startCall = useCallback(async () => {
    try {
      // Get user media (microphone)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: false, 
        audio: true 
      });
      localStreamRef.current = stream;

      // Create peer connection (initiator)
      const peer = new SimplePeer({
        initiator: true,
        trickle: false,
        stream: stream,
      });

      peer.on('signal', (signal) => {
        // Send offer to remote peer
        sendCallSignal(conversationId, currentUserId, signal);
      });

      peer.on('stream', (remoteStream) => {
        // Play remote audio
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remoteStream;
        }
        setCallStatus('connected');
      });

      peer.on('error', (err) => {
        console.error('Peer error:', err);
        handleEndCall();
      });

      peerRef.current = peer;
      setCallStatus('calling');
      
      // Notify remote user
      initiateCall(conversationId, currentUserId, currentUserName);
    } catch (error) {
      console.error('Failed to start call:', error);
      alert('Không thể truy cập microphone. Vui lòng cho phép quyền truy cập.');
    }
  }, [conversationId, currentUserId, currentUserName, initiateCall, sendCallSignal]);

  // Answer call - người nhận
  const answerCall = useCallback(async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: false, 
        audio: true 
      });
      localStreamRef.current = stream;

      // Create peer connection (not initiator)
      const peer = new SimplePeer({
        initiator: false,
        trickle: false,
        stream: stream,
      });

      peer.on('signal', (signal) => {
        // Send answer to caller
        sendCallSignal(conversationId, currentUserId, signal);
      });

      peer.on('stream', (remoteStream) => {
        // Play remote audio
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remoteStream;
        }
        setCallStatus('connected');
      });

      peer.on('error', (err) => {
        console.error('Peer error:', err);
        handleEndCall();
      });

      peerRef.current = peer;
      
      // Accept call
      acceptCall(conversationId, currentUserId);
      setCallStatus('connected');
    } catch (error) {
      console.error('Failed to answer call:', error);
      alert('Không thể truy cập microphone. Vui lòng cho phép quyền truy cập.');
      handleRejectCall();
    }
  }, [conversationId, currentUserId, acceptCall, sendCallSignal]);

  // Reject call
  const handleRejectCall = useCallback(() => {
    rejectCall(conversationId, currentUserId);
    setCallStatus('idle');
    setRemoteUserName('');
  }, [conversationId, currentUserId, rejectCall]);

  // End call
  const handleEndCall = useCallback(() => {
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Stop remote audio
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }

    // Destroy peer connection
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    // Notify other user
    endCall(conversationId, currentUserId);
    
    setCallStatus('ended');
    setTimeout(() => {
      setCallStatus('idle');
      setRemoteUserName('');
    }, 2000);
  }, [conversationId, currentUserId, endCall]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, []);

  // Listen for incoming call
  useEffect(() => {
    const unsubscribe = onIncomingCall((data: { callerId: string; callerName: string }) => {
      if (data.callerId !== currentUserId) {
        setRemoteUserName(data.callerName);
        setCallStatus('ringing');
      }
    });

    return unsubscribe;
  }, [currentUserId, onIncomingCall]);

  // Listen for call accepted
  useEffect(() => {
    const unsubscribe = onCallAccepted((data: { userId: string }) => {
      if (data.userId !== currentUserId && callStatus === 'calling') {
        // Call was accepted, wait for signal
      }
    });

    return unsubscribe;
  }, [currentUserId, callStatus, onCallAccepted]);

  // Listen for call rejected
  useEffect(() => {
    const unsubscribe = onCallRejected(() => {
      handleEndCall();
      alert('Cuộc gọi bị từ chối');
    });

    return unsubscribe;
  }, [onCallRejected, handleEndCall]);

  // Listen for call ended
  useEffect(() => {
    const unsubscribe = onCallEnded(() => {
      handleEndCall();
    });

    return unsubscribe;
  }, [onCallEnded, handleEndCall]);

  // Listen for WebRTC signals
  useEffect(() => {
    const unsubscribe = onCallSignal((data: { userId: string; signal: SimplePeer.SignalData }) => {
      if (data.userId !== currentUserId && peerRef.current) {
        peerRef.current.signal(data.signal);
      }
    });

    return unsubscribe;
  }, [currentUserId, onCallSignal]);

  return {
    callStatus,
    isMuted,
    remoteUserName,
    startCall,
    answerCall,
    rejectCall: handleRejectCall,
    endCall: handleEndCall,
    toggleMute,
  };
};
