'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react';
import { CallStatus } from '@/hooks/use-video-call';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  callStatus: CallStatus;
  remoteUserName: string;
  currentUserName: string;
  isMuted: boolean;
  isVideoOff: boolean;
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
  onAnswer: () => void;
  onReject: () => void;
  onEnd: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
}

const CallTimer = ({ startTime }: { startTime: number }) => {
  const [elapsed, setElapsed] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <div className="text-sm text-gray-400">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
};

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  onClose,
  callStatus,
  remoteUserName,
  currentUserName,
  isMuted,
  isVideoOff,
  localVideoRef,
  remoteVideoRef,
  onAnswer,
  onReject,
  onEnd,
  onToggleMute,
  onToggleVideo,
}) => {
  const [callStartTime, setCallStartTime] = useState<number>(0);

  useEffect(() => {
    if (callStatus === 'connected' && callStartTime === 0) {
      setCallStartTime(Date.now());
    } else if (callStatus === 'ended' || callStatus === 'idle') {
      setCallStartTime(0);
    }
  }, [callStatus, callStartTime]);

  const getStatusText = () => {
    switch (callStatus) {
      case 'calling':
        return 'Đang gọi...';
      case 'ringing':
        return 'Cuộc gọi đến...';
      case 'connected':
        return 'Đang kết nối';
      case 'ended':
        return 'Cuộc gọi đã kết thúc';
      default:
        return '';
    }
  };

  const displayName = callStatus === 'calling' ? remoteUserName : 
                      callStatus === 'ringing' ? remoteUserName : 
                      remoteUserName || currentUserName;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl bg-gray-900 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {getStatusText()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Remote & Local Video Container */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
            {/* Remote Video - Full size */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${callStatus !== 'connected' ? 'hidden' : ''}`}
            />

            {/* When not connected, show avatar */}
            {callStatus !== 'connected' && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-4xl bg-blue-600">
                    {displayName?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <p className="text-2xl font-semibold mb-2">{displayName}</p>
              </div>
            )}

            {/* Call timer overlay when connected */}
            {callStatus === 'connected' && callStartTime > 0 && (
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-3 py-2 rounded-lg">
                <CallTimer startTime={callStartTime} />
              </div>
            )}

            {/* Local Video - Picture in Picture (bottom right) */}
            <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-700">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
              />
              
              {/* Local user avatar when video is off */}
              {isVideoOff && (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-xl bg-blue-600">
                      {currentUserName?.[0]?.toUpperCase() || 'Y'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              
              <div className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                Bạn
              </div>
            </div>
          </div>

          {/* Call Controls */}
          <div className="flex items-center justify-center gap-4">
            {/* Ringing - Show Answer/Reject */}
            {callStatus === 'ringing' && (
              <>
                <Button
                  size="lg"
                  onClick={onReject}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16"
                >
                  <PhoneOff className="w-6 h-6" />
                </Button>
                <Button
                  size="lg"
                  onClick={onAnswer}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full w-16 h-16"
                >
                  <Video className="w-6 h-6" />
                </Button>
              </>
            )}

            {/* Calling or Connected - Show Mute/Video/End */}
            {(callStatus === 'calling' || callStatus === 'connected') && (
              <>
                {/* Mute/Unmute */}
                <Button
                  size="lg"
                  onClick={onToggleMute}
                  className={`rounded-full w-14 h-14 ${
                    isMuted 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>

                {/* Video On/Off */}
                <Button
                  size="lg"
                  onClick={onToggleVideo}
                  className={`rounded-full w-14 h-14 ${
                    isVideoOff 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </Button>

                {/* End Call */}
                <Button
                  size="lg"
                  onClick={onEnd}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16"
                >
                  <PhoneOff className="w-6 h-6" />
                </Button>
              </>
            )}

            {/* Ended - Show close button */}
            {callStatus === 'ended' && (
              <Button
                size="lg"
                onClick={onClose}
                className="bg-gray-700 hover:bg-gray-600"
              >
                Đóng
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
