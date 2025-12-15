import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudyGroup extends Document {
  name: string;
  description: string;
  avatar?: string;
  coverImage?: string;
  category: string;
  subjects: string[];
  visibility: 'public' | 'private';
  owner: mongoose.Types.ObjectId;
  admins: mongoose.Types.ObjectId[];
  members: mongoose.Types.ObjectId[];
  memberCount: number;
  maxMembers?: number;
  rules?: string;
  createdAt: Date;
  updatedAt: Date;
}

const studyGroupSchema = new Schema<IStudyGroup>(
  {
    name: {
      type: String,
      required: [true, 'Group name is required'],
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, 'Group description is required'],
      maxlength: 2000,
    },
    avatar: {
      type: String,
      default: null,
    },
    coverImage: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      required: true,
      maxlength: 100,
    },
    subjects: {
      type: [String],
      default: [],
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    admins: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    memberCount: {
      type: Number,
      default: 1,
    },
    maxMembers: {
      type: Number,
      default: null,
    },
    rules: {
      type: String,
      default: '',
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

studyGroupSchema.index({ owner: 1 });
studyGroupSchema.index({ category: 1 });
studyGroupSchema.index({ subjects: 1 });
studyGroupSchema.index({ visibility: 1 });

const StudyGroup: Model<IStudyGroup> =
  mongoose.models.StudyGroup || mongoose.model<IStudyGroup>('StudyGroup', studyGroupSchema);

export default StudyGroup;
