import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  type: 'study-session' | 'group-meeting' | 'exam' | 'workshop' | 'seminar';
  date: Date;
  time: string;
  location: string;
  image?: string;
  organizer: string;
  organizerId: mongoose.Types.ObjectId;
  tags: string[];
  participants: mongoose.Types.ObjectId[];
  participantCount: number;
  maxParticipants?: number;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 1000,
    },
    type: {
      type: String,
      enum: ['study-session', 'group-meeting', 'exam', 'workshop', 'seminar'],
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    organizer: {
      type: String,
      required: true,
    },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    participantCount: {
      type: Number,
      default: 0,
    },
    maxParticipants: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
eventSchema.index({ date: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ createdAt: -1 });

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);

export default Event;
