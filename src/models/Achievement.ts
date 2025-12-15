import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAchievement extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  icon: string;
  category: 'study' | 'social' | 'streak' | 'milestone' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  requirement: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

const achievementSchema = new Schema<IAchievement>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Achievement title is required'],
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    icon: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['study', 'social', 'streak', 'milestone', 'special'],
      default: 'milestone',
    },
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary'],
      default: 'common',
    },
    points: {
      type: Number,
      required: true,
      min: 0,
    },
    requirement: {
      type: String,
      required: true,
      maxlength: 300,
    },
    isUnlocked: {
      type: Boolean,
      default: false,
    },
    unlockedAt: {
      type: Date,
      default: null,
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

achievementSchema.index({ userId: 1, isUnlocked: 1 });
achievementSchema.index({ userId: 1, category: 1 });
achievementSchema.index({ rarity: 1 });

const Achievement: Model<IAchievement> =
  mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', achievementSchema);

export default Achievement;
