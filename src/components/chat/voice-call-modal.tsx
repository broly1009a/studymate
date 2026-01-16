'use client';

import { useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CallStatus } from '@/hooks/use-webrtc';

interface VoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  callStatus: CallStatus;
  remoteUserName: string;
  isMuted: boolean;
  onAnswer?: () => void;
  onReject?: () => void;
  onEndCall: () => void;
  onToggleMute: () => void;
}

export default function VoiceCallModal({
  isOpen,
  onClose,
  callStatus,
  remoteUserName,
  isMuted,
  onAnswer,
  onReject,
  onEndCall,
  onToggleMute,
}: VoiceCallModalProps) {
  // Auto close when call ends
  useEffect(() => {
    if (callStatus === 'idle') {
      onClose();
    }
  }, [callStatus, onClose]);

  const getStatusText = () => {
    switch (callStatus) {
      case 'calling':
        return 'Đang gọi...';
      case 'ringing':
        return `${remoteUserName} đang gọi cho bạn`;
      case 'connected':
        return 'Đang trong cuộc gọi';
      case 'ended':
        return 'Cuộc gọi đã kết thúc';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (callStatus) {
      case 'calling':
        return 'text-yellow-600';
      case 'ringing':
        return 'text-blue-600';
      case 'connected':
        return 'text-green-600';
      case 'ended':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Voice Call</DialogTitle>
          <DialogDescription className={`text-lg font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          {/* Avatar placeholder */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <Phone className="w-12 h-12 text-white" />
          </div>

          {/* User name */}
          {remoteUserName && (
            <p className="text-xl font-semibold">{remoteUserName}</p>
          )}

          {/* Call duration for connected calls */}
          {callStatus === 'connected' && <CallTimer />}

          {/* Action buttons */}
          <div className="flex items-center gap-4">
            {/* Incoming call buttons */}
            {callStatus === 'ringing' && (
              <>
                <Button
                  size="lg"
                  variant="default"
                  className="rounded-full w-16 h-16 bg-green-600 hover:bg-green-700"
                  onClick={onAnswer}
                >
                  <Phone className="w-6 h-6" />
                </Button>
                <Button
                  size="lg"
                  variant="destructive"
                  className="rounded-full w-16 h-16"
                  onClick={onReject}
                >
                  <PhoneOff className="w-6 h-6" />
                </Button>
              </>
            )}

            {/* Active call buttons */}
            {(callStatus === 'calling' || callStatus === 'connected') && (
              <>
                <Button
                  size="lg"
                  variant={isMuted ? 'destructive' : 'secondary'}
                  className="rounded-full w-16 h-16"
                  onClick={onToggleMute}
                >
                  {isMuted ? (
                    <MicOff className="w-6 h-6" />
                  ) : (
                    <Mic className="w-6 h-6" />
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="destructive"
                  className="rounded-full w-16 h-16"
                  onClick={onEndCall}
                >
                  <PhoneOff className="w-6 h-6" />
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Timer component for call duration
function CallTimer() {
  const [duration, setDuration] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <p className="text-sm text-gray-500">
      {formatDuration(duration)}
    </p>
  );
}

// Import React for CallTimer
import React from 'react';
