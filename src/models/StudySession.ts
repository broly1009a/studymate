import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudySession extends Document {
  title: string;
  description: string;
  creatorId: mongoose.Types.ObjectId;
  creatorName: string;
  creatorAvatar?: string;
  subject: string;
  topic: string;
  goal?: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  location?: string;
  online: boolean;
  meetLink?: string;
  maxParticipants: number;
  participants: mongoose.Types.ObjectId[];
  participants_count: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  notes?: string;
  resources: string[];
  createdAt: Date;
  updatedAt: Date;
}

const studySessionSchema = new Schema<IStudySession>(
  {
    title: {
      type: String,
      required: [true, 'Session title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 1000,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    creatorName: {
      type: String,
      required: true,
    },
    creatorAvatar: {
      type: String,
      default: null,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
    },
    goal: {
      type: String,
      default: '',
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required'],
    },
    duration: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      default: null,
    },
    online: {
      type: Boolean,
      default: true,
    },
    meetLink: {
      type: String,
      default: null,
    },
    maxParticipants: {
      type: Number,
      default: 10,
    },
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    participants_count: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    notes: {
      type: String,
      default: '',
    },
    resources: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
studySessionSchema.index({ creatorId: 1 });
studySessionSchema.index({ subject: 1 });
studySessionSchema.index({ startTime: 1 });
studySessionSchema.index({ status: 1 });

const StudySession: Model<IStudySession> =
  mongoose.models.StudySession || mongoose.model<IStudySession>('StudySession', studySessionSchema);

export default StudySession;
