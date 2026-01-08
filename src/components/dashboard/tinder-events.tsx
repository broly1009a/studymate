'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X, Heart, Info, Calendar, MapPin, Users, Clock, User } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi as viLocale } from 'date-fns/locale/vi';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';
import { API_URL, AUTH_TOKEN_KEY } from '@/lib/constants';

interface TinderEvent {
  _id?: string; // MongoDB ID
  id?: string;  // Generic ID (fallback)
  title: string;
  description: string;
  type: 'study-session' | 'group-meeting' | 'exam' | 'workshop' | 'seminar' | 'deadline';
  date: string;
  time: string;
  location?: string;
  participants?: number;
  maxParticipants?: number;
  image: string;
  organizer: string;
  tags: string[];
}

interface TinderEventsProps {
  events: TinderEvent[];
}

const typeColors = {
  'study-session': 'bg-blue-100 text-blue-800 border-blue-300',
  'group-meeting': 'bg-purple-100 text-purple-800 border-purple-300',
  'exam': 'bg-red-100 text-red-800 border-red-300',
  'workshop': 'bg-green-100 text-green-800 border-green-300',
  'seminar': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  'deadline': 'bg-yellow-100 text-yellow-800 border-yellow-300',
};

const typeLabels = {
  'study-session': 'Phiên học',
  'group-meeting': 'Họp nhóm',
  'exam': 'Thi cử',
  'workshop': 'Workshop',
  'seminar': 'Hội thảo',
  'deadline': 'Hạn chót',
};

export function TinderEvents({ events }: TinderEventsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const currentEvent = events[currentIndex];

  const trackInteraction = async (action: 'interested' | 'skipped') => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        console.warn('No authentication token found');
        return;
      }

      // Support both _id (MongoDB) and id formats
      const eventId = currentEvent._id || currentEvent.id;
      if (!eventId) {
        console.error('Event ID not found');
        return;
      }

      const response = await fetch(`${API_URL}/activity-interactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          activityId: eventId,
          activityType: 'event',
          action: action,
          source: 'tinder-swipe',
          metadata: {
            swipeDirection: action === 'interested' ? 'right' : 'left',
            eventType: currentEvent.type,
            eventTitle: currentEvent.title,
          },
        }),
      });

      const result = await response.json();
      
      if (!result.success) {
        console.error('Failed to track interaction:', result.message);
      } else {
        console.log('Interaction tracked successfully:', action);
      }
    } catch (error) {
      console.error('Failed to track interaction:', error);
      // Don't block the UI flow even if tracking fails
    }
  };

  const handleSwipe = async (liked: boolean) => {
    setDirection(liked ? 'right' : 'left');
    
    // Track the interaction (don't wait for it)
    trackInteraction(liked ? 'interested' : 'skipped');
    
    setTimeout(() => {
      if (liked) {
        toast.success(`Đã lưu quan tâm: ${currentEvent.title}`, {
          description: 'Xem tại trang "Sự kiện quan tâm"',
        });
      } else {
        toast.info('Đã bỏ qua sự kiện');
      }
      
      if (currentIndex < events.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setDirection(null);
      } else {
        toast.info('Đã xem hết tất cả sự kiện!', {
          description: 'Quay lại sau để khám phá thêm',
        });
      }
    }, 300);
  };

  if (!currentEvent) {
    return (
      <Card className="w-full max-w-5xl mx-auto">
        <CardContent className="py-12 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Không có sự kiện mới</h3>
          <p className="text-muted-foreground">
            Hãy quay lại sau để khám phá thêm sự kiện!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Card Stack */}
      <div className="relative h-[700px] mb-6">
        {/* Next card preview */}
        {currentIndex < events.length - 1 && (
          <Card className="absolute inset-0 scale-95 opacity-50 pointer-events-none">
            <div className="relative h-full">
              <Image
                src={events[currentIndex + 1].image}
                alt={events[currentIndex + 1].title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </Card>
        )}

        {/* Current card */}
        <Card
          key={currentEvent._id || currentEvent.id} 
          className={`absolute inset-0 transition-all duration-300 overflow-hidden ${
            direction === 'left' ? '-translate-x-full rotate-[-20deg] opacity-0' :
            direction === 'right' ? 'translate-x-full rotate-[20deg] opacity-0' :
            'translate-x-0 rotate-0 opacity-100'
          }`}
        >
          <div className="relative h-full w-full">
            {/* Image - Full Background */}
            <Image
              src={currentEvent.image}
              alt={currentEvent.title}
              fill
              className="object-cover"
            />

            {/* Type Badge */}
            <Badge
              className={`absolute top-4 right-4 ${typeColors[currentEvent.type]} border-2 z-10`}
            >
              {typeLabels[currentEvent.type]}
            </Badge>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
              <h2 className="text-2xl font-bold mb-2">{currentEvent.title}</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(currentEvent.date), 'dd/MM/yyyy')}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{currentEvent.time}</span>
                </div>
                
                {currentEvent.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{currentEvent.location}</span>
                  </div>
                )}
                
                {currentEvent.participants !== undefined && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>
                      {currentEvent.participants}
                      {currentEvent.maxParticipants && `/${currentEvent.maxParticipants}`} người tham gia
                    </span>
                  </div>
                )}
              </div>

              <p className="text-sm mb-4 line-clamp-2">{currentEvent.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {currentEvent.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        <Button
          size="lg"
          variant="outline"
          className="h-16 w-16 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-50"
          onClick={() => handleSwipe(false)}
        >
          <X className="h-8 w-8" />
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="h-14 w-14 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50"
          onClick={() => setShowInfo(true)}
        >
          <Info className="h-6 w-6" />
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="h-16 w-16 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-50"
          onClick={() => handleSwipe(true)}
        >
          <Heart className="h-8 w-8" />
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        {currentIndex + 1} / {events.length} sự kiện
      </div>

      {/* Progress Bar */}
      <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / events.length) * 100}%` }}
        />
      </div>
      {/* View Interested Events Link */}
      <div className="mt-4 text-center">
        <a 
          href="/events/interested" 
          className="text-sm text-[#6059f7] hover:underline inline-flex items-center gap-2"
        >
          <Heart className="h-4 w-4" />
          Xem sự kiện đã quan tâm
        </a>
      </div>

      {/* Info Dialog */}
      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{currentEvent.title}</DialogTitle>
            <DialogDescription>
              <Badge className={`${typeColors[currentEvent.type]} border-2 mt-2`}>
                {typeLabels[currentEvent.type]}
              </Badge>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Event Image */}
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={currentEvent.image}
                alt={currentEvent.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Event Details */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Ngày & Giờ</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(currentEvent.date), 'EEEE, dd/MM/yyyy', { locale: viLocale })} - {currentEvent.time}
                  </p>
                </div>
              </div>

              {currentEvent.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Địa điểm</p>
                    <p className="text-sm text-muted-foreground">{currentEvent.location}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Người tổ chức</p>
                  <p className="text-sm text-muted-foreground">{currentEvent.organizer}</p>
                </div>
              </div>

              {currentEvent.participants !== undefined && (
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Số lượng tham gia</p>
                    <p className="text-sm text-muted-foreground">
                      {currentEvent.participants}
                      {currentEvent.maxParticipants && ` / ${currentEvent.maxParticipants}`} người
                      {currentEvent.maxParticipants && currentEvent.participants >= currentEvent.maxParticipants && 
                        <span className="text-red-500 ml-2">(Đã đầy)</span>
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="font-medium mb-2">Mô tả</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentEvent.description}
              </p>
            </div>

            {/* Tags */}
            {currentEvent.tags.length > 0 && (
              <div>
                <p className="font-medium mb-2">Chủ đề</p>
                <div className="flex flex-wrap gap-2">
                  {currentEvent.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setShowInfo(false);
                  handleSwipe(true);
                }}
              >
                <Heart className="h-4 w-4 mr-2" />
                Quan tâm
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowInfo(false);
                  handleSwipe(false);
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Bỏ qua
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

