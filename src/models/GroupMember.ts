import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGroupMember extends Document {
  groupId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const groupMemberSchema = new Schema<IGroupMember>(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudyGroup',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member'],
      default: 'member',
    },
    joinedAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    timestamps: true,
  }
);

groupMemberSchema.index({ groupId: 1, userId: 1 }, { unique: true });
groupMemberSchema.index({ groupId: 1 });
groupMemberSchema.index({ userId: 1 });

const GroupMember: Model<IGroupMember> =
  mongoose.models.GroupMember || mongoose.model<IGroupMember>('GroupMember', groupMemberSchema);

export default GroupMember;
