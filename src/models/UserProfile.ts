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
  // Matching data - Nhóm 3: Nhu cầu & mục tiêu
  learningNeeds?: string[]; // Nhu cầu học tập
  learningGoals?: string[]; // Mục tiêu học tập
  studyHabits?: string[]; // Thói quen học tập
  mbtiType?: string; // MBTI personality type
  // Matching data - Nhóm 4: Kỹ năng, thành tựu
  gpa?: string; // GPA range
  awards?: string[]; // Giải thưởng
  certificates?: string[]; // Chứng chỉ
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
    // Matching data - Nhóm 3: Nhu cầu & mục tiêu
    learningNeeds: {
      type: [String],
      default: [],
    },
    learningGoals: {
      type: [String],
      default: [],
    },
    studyHabits: {
      type: [String],
      default: [],
    },
    mbtiType: {
      type: String,
      enum: [
        'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
        'ISTP', 'ISFP', 'INFP', 'INTP',
        'ESTP', 'ESFP', 'ENFP', 'ENTP',
        'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
      ],
      default: null,
    },
    // Matching data - Nhóm 4: Kỹ năng, thành tựu
    gpa: {
      type: String,
      enum: ['<2.5', '2.5-3.0', '3.0-3.5', '3.5-4.0'],
      default: null,
    },
    awards: {
      type: [String],
      default: [],
    },
    certificates: {
      type: [String],
      default: [],
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
