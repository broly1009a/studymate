import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICompetition extends Document {
  title: string;
  slug: string;
  description: string;
  posterImage?: string;
  organizerId: mongoose.Types.ObjectId;
  organizerName: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  subject?: string;
  rules?: string;
  prizes?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  registrationStartDate: Date;
  registrationEndDate: Date;
  startDate: Date;
  endDate: Date;
  location?: string;
  online: boolean;
  maxParticipants?: number;
  participants: mongoose.Types.ObjectId[];
  participantCount: number;
  teamSize: { min: number; max: number };
  teamCount: number;
  winners?: mongoose.Types.ObjectId[];
  status: 'upcoming' | 'ongoing' | 'completed';
  resultAnnounced: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const competitionSchema = new Schema<ICompetition>(
  {
    title: {
      type: String,
      required: [true, 'Competition title is required'],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 2000,
    },
    posterImage: {
      type: String,
      default: null,
    },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    organizerName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'mixed'],
      default: 'mixed',
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    subject: {
      type: String,
      default: '',
    },
    rules: {
      type: String,
      default: '',
    },
    prizes: {
      type: String,
      default: '',
    },
    registrationStartDate: {
      type: Date,
      required: [true, 'Registration start date is required'],
    },
    registrationEndDate: {
      type: Date,
      required: [true, 'Registration end date is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    location: {
      type: String,
      default: null,
    },
    online: {
      type: Boolean,
      default: true,
    },
    maxParticipants: {
      type: Number,
      default: null,
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
    teamSize: {
      min: {
        type: Number,
        default: 1,
      },
      max: {
        type: Number,
        default: 5,
      },
    },
    teamCount: {
      type: Number,
      default: 0,
    },
    winners: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed'],
      default: 'upcoming',
    },
    resultAnnounced: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
competitionSchema.index({ slug: 1 });
competitionSchema.index({ organizerId: 1 });
competitionSchema.index({ category: 1 });
competitionSchema.index({ status: 1 });
competitionSchema.index({ startDate: 1 });

const Competition: Model<ICompetition> =
  mongoose.models.Competition || mongoose.model<ICompetition>('Competition', competitionSchema);

export default Competition;
