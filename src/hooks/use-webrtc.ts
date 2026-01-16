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
  const pendingSignalRef = useRef<SimplePeer.SignalData | null>(null);

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
        console.log('📤 Sending offer signal to receiver');
        sendCallSignal(conversationId, currentUserId, signal);
      });

      peer.on('stream', (remoteStream) => {
        // Play remote audio
        console.log('🎵 Received remote stream - call connected!');
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
        console.log('📤 Sending answer signal to caller');
        sendCallSignal(conversationId, currentUserId, signal);
      });

      peer.on('stream', (remoteStream) => {
        // Play remote audio
        console.log('🎵 Received remote stream - call connected!');
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
      
      // If we have a pending signal (offer from caller), apply it now
      if (pendingSignalRef.current) {
        console.log('📥 Applying pending offer signal');
        peer.signal(pendingSignalRef.current);
        pendingSignalRef.current = null;
      }
      
      // Accept call - notify other user
      acceptCall(conversationId, currentUserId);
      console.log('✅ Call accepted, waiting for connection...');
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
    if (!conversationId) return;
    
    const unsubscribe = onIncomingCall((data: { callerId: string; callerName: string }) => {
      console.log('📞 Incoming call from:', data.callerName);
      if (data.callerId !== currentUserId) {
        setRemoteUserName(data.callerName);
        setCallStatus('ringing');
      }
    });

    return unsubscribe;
  }, [conversationId, currentUserId, onIncomingCall]);

  // Listen for call accepted
  useEffect(() => {
    if (!conversationId) return;
    
    const unsubscribe = onCallAccepted((data: { userId: string }) => {
      console.log('✅ Call accepted by:', data.userId);
      if (data.userId !== currentUserId && callStatus === 'calling') {
        // Call was accepted, wait for signal
        console.log('⏳ Waiting for answer signal...');
      }
    });

    return unsubscribe;
  }, [conversationId, currentUserId, callStatus, onCallAccepted]);

  // Listen for call rejected
  useEffect(() => {
    if (!conversationId) return;
    
    const unsubscribe = onCallRejected(() => {
      console.log('❌ Call rejected');
      handleEndCall();
      alert('Cuộc gọi bị từ chối');
    });

    return unsubscribe;
  }, [conversationId, onCallRejected, handleEndCall]);

  // Listen for call ended
  useEffect(() => {
    if (!conversationId) return;
    
    const unsubscribe = onCallEnded(() => {
      console.log('📞 Call ended by remote user');
      handleEndCall();
    });

    return unsubscribe;
  }, [conversationId, onCallEnded, handleEndCall]);

  // Listen for WebRTC signals
  useEffect(() => {
    if (!conversationId) return;
    
    const unsubscribe = onCallSignal((data: { userId: string; signal: SimplePeer.SignalData }) => {
      if (data.userId !== currentUserId) {
        console.log('📥 Received signal from peer:', peerRef.current ? 'Peer exists' : 'No peer yet');
        if (peerRef.current) {
          // Peer exists, apply signal immediately
          console.log('✅ Applying signal to existing peer');
          peerRef.current.signal(data.signal);
        } else {
          // Peer not created yet (we're receiving), store signal for later
          console.log('💾 Storing signal for later (pending)');
          pendingSignalRef.current = data.signal;
        }
      }
    });

    return unsubscribe;
  }, [conversationId, currentUserId, onCallSignal]);

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
