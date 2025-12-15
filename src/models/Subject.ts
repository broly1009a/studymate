import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubject extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  color: string;
  icon: string;
  totalHours: number;
  sessionsCount: number;
  averageSessionLength: number;
  lastStudied?: Date;
  topics: string[];
  goalHours: number;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

const subjectSchema = new Schema<ISubject>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
      maxlength: 100,
    },
    color: {
      type: String,
      default: '#3b82f6',
      match: /^#(?:[0-9a-fA-F]{3}){1,2}$/,
    },
    icon: {
      type: String,
      default: '📚',
    },
    totalHours: {
      type: Number,
      default: 0,
    },
    sessionsCount: {
      type: Number,
      default: 0,
    },
    averageSessionLength: {
      type: Number,
      default: 0,
    },
    lastStudied: {
      type: Date,
      default: null,
    },
    topics: {
      type: [String],
      default: [],
    },
    goalHours: {
      type: Number,
      default: 0,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
subjectSchema.index({ userId: 1 });
subjectSchema.index({ name: 1 });

const Subject: Model<ISubject> =
  mongoose.models.Subject || mongoose.model<ISubject>('Subject', subjectSchema);

export default Subject;
