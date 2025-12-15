import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGroupMessage extends Document {
  groupId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  reactions: Array<{
    emoji: string;
    userIds: mongoose.Types.ObjectId[];
  }>;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const groupMessageSchema = new Schema<IGroupMessage>(
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
    content: {
      type: String,
      required: [true, 'Message content is required'],
      maxlength: 2000,
    },
    reactions: {
      type: [
        {
          emoji: String,
          userIds: [mongoose.Schema.Types.ObjectId],
        },
      ],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

groupMessageSchema.index({ groupId: 1, createdAt: -1 });
groupMessageSchema.index({ userId: 1 });

const GroupMessage: Model<IGroupMessage> =
  mongoose.models.GroupMessage || mongoose.model<IGroupMessage>('GroupMessage', groupMessageSchema);

export default GroupMessage;
