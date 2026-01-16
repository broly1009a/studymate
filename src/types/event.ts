export interface Event {
  _id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  organizer: string;
  organizerId: string;
  tags: string[];
  participants: string[];
  participantCount: number;
  maxParticipants?: number;
  createdAt: string;
  updatedAt: string;
}

export type EventType = 'study-session' | 'exam' | 'workshop' | 'group-meeting' | 'seminar' | 'project' | 'assignment';

export interface CreateEventData {
  title: string;
  description: string;
  type: EventType;
  date: string;
  time: string;
  location: string;
  image?: string;
  tags: string[];
  maxParticipants?: number;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  _id: string;
}