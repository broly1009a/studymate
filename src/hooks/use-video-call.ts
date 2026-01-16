'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import SimplePeer from 'simple-peer';
import { useSocket } from './use-socket';

interface UseVideoCallProps {
  conversationId: string;
  currentUserId: string;
  currentUserName: string;
}

export type CallStatus = 'idle' | 'calling' | 'ringing' | 'connected' | 'ended';

export const useVideoCall = ({ conversationId, currentUserId, currentUserName }: UseVideoCallProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [remoteUserName, setRemoteUserName] = useState('');
  
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pendingSignalRef = useRef<SimplePeer.SignalData | null>(null);
  const isEndingCallRef = useRef(false);

  const {
    socket,
    initiateVideoCall,
    acceptVideoCall,
    rejectVideoCall,
    endVideoCall,
    sendVideoCallSignal,
    onIncomingVideoCall,
    onVideoCallAccepted,
    onVideoCallRejected,
    onVideoCallEnded,
    onVideoCallSignal,
  } = useSocket();

  // Start video call - người gọi
  const startVideoCall = useCallback(async () => {
    try {
      // Get user media (camera + microphone)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      localStreamRef.current = stream;

      // Display local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection (initiator)
      const peer = new SimplePeer({
        initiator: true,
        trickle: false,
        stream: stream,
      });

      peer.on('signal', (signal) => {
        console.log('📤 Sending video offer signal');
        sendVideoCallSignal(conversationId, currentUserId, signal);
      });

      peer.on('stream', (remoteStream) => {
        console.log('🎥 Received remote video stream');
        remoteStreamRef.current = remoteStream;
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
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
      initiateVideoCall(conversationId, currentUserId, currentUserName);
    } catch (error) {
      console.error('Failed to start video call:', error);
      alert('Không thể truy cập camera/microphone. Vui lòng cho phép quyền truy cập.');
    }
  }, [conversationId, currentUserId, currentUserName, initiateVideoCall, sendVideoCallSignal]);

  // Reject call
  const handleRejectCall = useCallback(() => {
    rejectVideoCall(conversationId, currentUserId);
    setCallStatus('idle');
    setRemoteUserName('');
  }, [conversationId, currentUserId, rejectVideoCall]);

  // End call
  const handleEndCall = useCallback(() => {
    if (isEndingCallRef.current) {
      console.log('⚠️ Already ending call, skipping...');
      return;
    }
    
    isEndingCallRef.current = true;
    console.log('🔴 Ending video call...');
    
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Clear local video
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    // Clear remote video
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // Destroy peer connection
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    // Notify other user
    endVideoCall(conversationId, currentUserId);
    
    setCallStatus('ended');
    setTimeout(() => {
      setCallStatus('idle');
      setRemoteUserName('');
      isEndingCallRef.current = false;
    }, 2000);
  }, [conversationId, currentUserId, endVideoCall]);

  // Answer video call - người nhận
  const answerVideoCall = useCallback(async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      localStreamRef.current = stream;

      // Display local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection (not initiator)
      const peer = new SimplePeer({
        initiator: false,
        trickle: false,
        stream: stream,
      });

      peer.on('signal', (signal) => {
        console.log('📤 Sending video answer signal');
        sendVideoCallSignal(conversationId, currentUserId, signal);
      });

      peer.on('stream', (remoteStream) => {
        console.log('🎥 Received remote video stream');
        remoteStreamRef.current = remoteStream;
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
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
        console.log('📥 Applying pending video offer signal');
        peer.signal(pendingSignalRef.current);
        pendingSignalRef.current = null;
      }
      
      // Accept call
      acceptVideoCall(conversationId, currentUserId);
      console.log('✅ Video call accepted, waiting for connection...');
    } catch (error) {
      console.error('Failed to answer video call:', error);
      alert('Không thể truy cập camera/microphone. Vui lòng cho phép quyền truy cập.');
      handleRejectCall();
    }
  }, [conversationId, currentUserId, acceptVideoCall, sendVideoCallSignal, handleRejectCall]);

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

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  }, []);

  // Listen for incoming call
  useEffect(() => {
    if (!conversationId) return;
    
    const unsubscribe = onIncomingVideoCall((data: { callerId: string; callerName: string }) => {
      console.log('📞 Incoming video call from:', data.callerName);
      if (data.callerId !== currentUserId) {
        setRemoteUserName(data.callerName);
        setCallStatus('ringing');
      }
    });

    return unsubscribe;
  }, [conversationId, currentUserId, onIncomingVideoCall]);

  // Listen for call accepted
  useEffect(() => {
    if (!conversationId) return;
    
    const unsubscribe = onVideoCallAccepted((data: { userId: string }) => {
      console.log('✅ Video call accepted by:', data.userId);
      if (data.userId !== currentUserId && callStatus === 'calling') {
        console.log('⏳ Waiting for video answer signal...');
      }
    });

    return unsubscribe;
  }, [conversationId, currentUserId, callStatus, onVideoCallAccepted]);

  // Listen for call rejected
  useEffect(() => {
    if (!conversationId) return;
    
    const unsubscribe = onVideoCallRejected(() => {
      console.log('❌ Video call rejected');
      handleEndCall();
      alert('Cuộc gọi video bị từ chối');
    });

    return unsubscribe;
  }, [conversationId, onVideoCallRejected, handleEndCall]);

  // Listen for call ended
  useEffect(() => {
    if (!conversationId) return;
    
    const unsubscribe = onVideoCallEnded(() => {
      console.log('📞 Video call ended by remote user');
      handleEndCall();
    });

    return unsubscribe;
  }, [conversationId, onVideoCallEnded, handleEndCall]);

  // Listen for WebRTC signals
  useEffect(() => {
    if (!conversationId) return;
    
    const unsubscribe = onVideoCallSignal((data: { userId: string; signal: SimplePeer.SignalData }) => {
      if (data.userId !== currentUserId) {
        console.log('📥 Received video signal from peer:', peerRef.current ? 'Peer exists' : 'No peer yet');
        if (peerRef.current) {
          console.log('✅ Applying signal to existing peer');
          peerRef.current.signal(data.signal);
        } else {
          console.log('💾 Storing signal for later (pending)');
          pendingSignalRef.current = data.signal;
        }
      }
    });

    return unsubscribe;
  }, [conversationId, currentUserId, onVideoCallSignal]);

  return {
    callStatus,
    isMuted,
    isVideoOff,
    remoteUserName,
    localVideoRef,
    remoteVideoRef,
    startVideoCall,
    answerVideoCall,
    rejectCall: handleRejectCall,
    endCall: handleEndCall,
    toggleMute,
    toggleVideo,
  };
};
