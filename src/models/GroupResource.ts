import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGroupResource extends Document {
  groupId: mongoose.Types.ObjectId;
  name: string;
  type: 'file' | 'folder' | 'link';
  fileUrl?: string;
  fileSize?: number;
  parentId?: mongoose.Types.ObjectId;
  uploaderId: mongoose.Types.ObjectId;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const groupResourceSchema = new Schema<IGroupResource>(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudyGroup',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Resource name is required'],
      maxlength: 200,
    },
    type: {
      type: String,
      enum: ['file', 'folder', 'link'],
      default: 'file',
    },
    fileUrl: {
      type: String,
      default: null,
    },
    fileSize: {
      type: Number,
      default: null,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GroupResource',
      default: null,
    },
    uploaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

groupResourceSchema.index({ groupId: 1 });
groupResourceSchema.index({ uploaderId: 1 });

const GroupResource: Model<IGroupResource> =
  mongoose.models.GroupResource ||
  mongoose.model<IGroupResource>('GroupResource', groupResourceSchema);

export default GroupResource;
