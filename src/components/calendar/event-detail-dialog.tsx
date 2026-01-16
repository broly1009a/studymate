'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Tag, Pencil, Trash2, Loader2, User } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { AUTH_TOKEN_KEY } from '@/lib/constants';
import type { Event } from '@/types/event';

interface EventDetailDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventUpdated: () => void;
  onEdit?: (event: Event) => void;
  currentUserId?: string;
}

export function EventDetailDialog({
  event,
  open,
  onOpenChange,
  onEventUpdated,
  onEdit,
  currentUserId,
}: EventDetailDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();

  if (!event) return null;

  const isOrganizer = currentUserId === event.organizerId;
  console.log("event.organizerId:", event.organizerId);
  console.log("currentUserId:", currentUserId);
  console.log("isOrganizer:", isOrganizer);
  const isParticipant = event.participants.some((id: any) => id.toString() === currentUserId);
  const isFull = event.maxParticipants ? event.participantCount >= event.maxParticipants : false;

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'study-session': return 'bg-blue-500/10 text-blue-500';
      case 'exam': return 'bg-red-500/10 text-red-500';
      case 'workshop': return 'bg-yellow-500/10 text-yellow-500';
      case 'group-meeting': return 'bg-green-500/10 text-green-500';
      case 'seminar': return 'bg-purple-500/10 text-purple-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getEventTypeLabel = (type: string) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      setIsDeleting(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
      
      const response = await fetch(`/api/events/${event._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete event');
      }

      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      });

      onOpenChange(false);
      onEventUpdated();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete event',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(event);
      onOpenChange(false);
    }
  };

  const handleJoin = async () => {
    try {
      setIsJoining(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
      
      const response = await fetch(`/api/events/${event._id}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to join event');
      }

      toast({
        title: 'Success',
        description: 'Successfully joined the event',
      });

      onEventUpdated();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to join event',
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm('Are you sure you want to leave this event?')) return;

    try {
      setIsJoining(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
      
      const response = await fetch(`/api/events/${event._id}/join`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to leave event');
      }

      toast({
        title: 'Success',
        description: 'Successfully left the event',
      });

      onEventUpdated();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to leave event',
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{event.title}</DialogTitle>
              <DialogDescription className="mt-2">
                <Badge className={getEventTypeColor(event.type)}>
                  {getEventTypeLabel(event.type)}
                </Badge>
              </DialogDescription>
            </div>
            {isOrganizer && (
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleEdit}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-destructive" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Image */}
          {event.image && (
            <div className="w-full h-48 rounded-lg overflow-hidden bg-muted">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{event.description}</p>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{format(new Date(event.date), 'MMMM d, yyyy')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">{event.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{event.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Participants</p>
                <p className="font-medium">
                  {event.participantCount}
                  {event.maxParticipants && ` / ${event.maxParticipants}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Organizer</p>
                <p className="font-medium">{event.organizer}</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Footer Info */}
          <div className="text-sm text-muted-foreground pt-4 border-t">
            <p>Created: {format(new Date(event.createdAt), 'MMM d, yyyy h:mm a')}</p>
            {event.updatedAt !== event.createdAt && (
              <p>Last updated: {format(new Date(event.updatedAt), 'MMM d, yyyy h:mm a')}</p>
            )}
          </div>

          {/* Join/Leave Button */}
          {!isOrganizer && currentUserId && (
            <div className="pt-4 border-t">
              {isParticipant ? (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleLeave}
                  disabled={isJoining}
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Leaving...
                    </>
                  ) : (
                    'Leave Event'
                  )}
                </Button>
              ) : (
                <Button 
                  className="w-full"
                  onClick={handleJoin}
                  disabled={isJoining || isFull}
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Joining...
                    </>
                  ) : isFull ? (
                    'Event is Full'
                  ) : (
                    'Join Event'
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
