import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPartner extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  avatar?: string;
  age: number;
  major: string;
  university: string;
  bio: string;
  subjects: string[];
  studyHours: number;
  rating: number;
  reviewsCount: number;
  availability: string[];
  studyStyle: string[];
  goals: string[];
  timezone: string;
  languages: string[];
  matchScore?: number;
  status: 'available' | 'busy' | 'offline';
  lastActive?: Date;
  sessionsCompleted: number;
  badges: string[];
  createdAt: Date;
  updatedAt: Date;
}

const partnerSchema = new Schema<IPartner>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: 13,
      max: 100,
    },
    major: {
      type: String,
      required: [true, 'Major is required'],
      trim: true,
    },
    university: {
      type: String,
      required: [true, 'University is required'],
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      maxlength: 500,
    },
    subjects: {
      type: [String],
      default: [],
      required: true,
    },
    studyHours: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    availability: {
      type: [String],
      default: [],
    },
    studyStyle: {
      type: [String],
      default: [],
    },
    goals: {
      type: [String],
      default: [],
    },
    timezone: {
      type: String,
      default: 'GMT+7',
    },
    languages: {
      type: [String],
      default: ['Tiếng Việt'],
    },
    matchScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['available', 'busy', 'offline'],
      default: 'offline',
    },
    lastActive: {
      type: Date,
      default: null,
    },
    sessionsCompleted: {
      type: Number,
      default: 0,
    },
    badges: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
partnerSchema.index({ subjects: 1 });
partnerSchema.index({ rating: -1 });
partnerSchema.index({ matchScore: -1 });
partnerSchema.index({ status: 1 });
partnerSchema.index({ major: 1 });

const Partner: Model<IPartner> =
  mongoose.models.Partner || mongoose.model<IPartner>('Partner', partnerSchema);

export default Partner;
