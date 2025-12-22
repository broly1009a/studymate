import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGroupEvent extends Document {
  groupId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  type: 'study_session' | 'meeting' | 'workshop' | 'social';
  creatorId: mongoose.Types.ObjectId;
  attendees: Array<{
    userId: mongoose.Types.ObjectId;
    status: 'going' | 'maybe' | 'not_going' | 'no_response';
  }>;
  isVirtual?: boolean;
  meetingLink?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const groupEventSchema = new Schema<IGroupEvent>(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudyGroup',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Event title is required'],
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required'],
    },
    location: {
      type: String,
      required: true,
      maxlength: 200,
    },
    type: {
      type: String,
      enum: ['study_session', 'meeting', 'workshop', 'social'],
      default: 'study_session',
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attendees: {
      type: [
        {
          userId: mongoose.Schema.Types.ObjectId,
          status: {
            type: String,
            enum: ['going', 'maybe', 'not_going', 'no_response'],
            default: 'no_response',
          },
        },
      ],
      default: [],
    },
    isVirtual: {
      type: Boolean,
      default: false,
    },
    meetingLink: {
      type: String,
      default: '',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

groupEventSchema.index({ groupId: 1, startTime: -1 });
groupEventSchema.index({ creatorId: 1 });

const GroupEvent: Model<IGroupEvent> =
  mongoose.models.GroupEvent || mongoose.model<IGroupEvent>('GroupEvent', groupEventSchema);

export default GroupEvent;
