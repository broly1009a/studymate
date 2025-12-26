import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  slug: string;
  description: string;
  avatar?: string;
  coverImage?: string;
  creatorId: mongoose.Types.ObjectId;
  creatorName: string;
  admins: mongoose.Types.ObjectId[];
  members: mongoose.Types.ObjectId[];
  members_count: number;
  subject: string;
  category: string;
  isPublic: boolean;
  rules?: string;
  resources: string[];
  status: 'active' | 'inactive' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const groupSchema = new Schema<IGroup>(
  {
    name: {
      type: String,
      required: [true, 'Group name is required'],
      trim: true,
      maxlength: 100,
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
      maxlength: 1000,
    },
    avatar: {
      type: String,
      default: null,
    },
    coverImage: {
      type: String,
      default: null,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    creatorName: {
      type: String,
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
    members_count: {
      type: Number,
      default: 0,
    },
    subject: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: '',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    rules: {
      type: String,
      default: '',
    },
    resources: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
groupSchema.index({ creatorId: 1 });
groupSchema.index({ subject: 1 });
groupSchema.index({ isPublic: 1 });

const Group: Model<IGroup> = mongoose.models.Group || mongoose.model<IGroup>('Group', groupSchema);

export default Group;
