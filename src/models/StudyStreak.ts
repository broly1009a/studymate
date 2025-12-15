import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudyStreak extends Document {
  userId: mongoose.Types.ObjectId;
  current: number;
  longest: number;
  lastStudyDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const studyStreakSchema = new Schema<IStudyStreak>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
    current: {
      type: Number,
      default: 0,
      min: 0,
    },
    longest: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastStudyDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
studyStreakSchema.index({ userId: 1 });

const StudyStreak: Model<IStudyStreak> =
  mongoose.models.StudyStreak || mongoose.model<IStudyStreak>('StudyStreak', studyStreakSchema);

export default StudyStreak;
