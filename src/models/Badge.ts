import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBadge extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  icon: string;
  category: 'study' | 'community' | 'achievement' | 'social';
  locked: boolean;
  earnedAt?: Date;
  progress?: number;
  requirement?: string;
  createdAt: Date;
  updatedAt: Date;
}

const badgeSchema = new Schema<IBadge>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Badge name is required'],
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 300,
    },
    icon: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['study', 'community', 'achievement', 'social'],
      default: 'achievement',
    },
    locked: {
      type: Boolean,
      default: true,
    },
    earnedAt: {
      type: Date,
      default: null,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    requirement: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

badgeSchema.index({ userId: 1 });
badgeSchema.index({ category: 1 });

const Badge: Model<IBadge> = mongoose.models.Badge || mongoose.model<IBadge>('Badge', badgeSchema);

export default Badge;
