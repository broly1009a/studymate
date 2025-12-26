import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserProfile extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  fullName: string;
  avatar?: string;
  coverPhoto?: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  education: {
    level?: string;
    institution?: string;
    major?: string;
    graduationYear?: number;
  };
  reputation: number;
  createdAt: Date;
  updatedAt: Date;
}

const userProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    coverPhoto: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: '',
      maxlength: 500,
    },
    phone: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
    website: {
      type: String,
      default: null,
    },
    education: {
      level: {
        type: String,
        enum: ['high_school', 'undergraduate', 'graduate', 'other'],
        default: null,
      },
      institution: String,
      major: String,
      graduationYear: Number,
    },
    reputation: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

userProfileSchema.index({ username: 1 });

const UserProfile: Model<IUserProfile> =
  mongoose.models.UserProfile || mongoose.model<IUserProfile>('UserProfile', userProfileSchema);

export default UserProfile;
