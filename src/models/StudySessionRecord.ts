import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudySessionRecord extends Document {
  userId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  subjectName: string;
  topic: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  status: 'completed' | 'ongoing' | 'paused' | 'abandoned';
  notes: string;
  focusScore: number; // 0-100
  breaks: number;
  pomodoroCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<IStudySessionRecord>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    subjectName: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      maxlength: 200,
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
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['completed', 'ongoing', 'paused', 'abandoned'],
      default: 'ongoing',
    },
    notes: {
      type: String,
      default: '',
      maxlength: 2000,
    },
    focusScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    breaks: {
      type: Number,
      default: 0,
      min: 0,
    },
    pomodoroCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
sessionSchema.index({ userId: 1, startTime: -1 });
sessionSchema.index({ subjectId: 1 });
sessionSchema.index({ status: 1 });
sessionSchema.index({ startTime: -1 });

const StudySessionRecord: Model<IStudySessionRecord> =
  mongoose.models.StudySessionRecord ||
  mongoose.model<IStudySessionRecord>('StudySessionRecord', sessionSchema);

export default StudySessionRecord;
