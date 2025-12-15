import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  read: boolean;
  readAt?: Date;
  reactions: {
    emoji: string;
    userId: mongoose.Types.ObjectId;
    userName: string;
  }[];
  editedAt?: Date;
  editHistory?: {
    content: string;
    editedAt: Date;
  }[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderAvatar: {
      type: String,
      default: null,
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      maxlength: 5000,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'file'],
      default: 'text',
    },
    fileUrl: {
      type: String,
      default: null,
    },
    fileName: {
      type: String,
      default: null,
    },
    fileSize: {
      type: Number,
      default: null,
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    reactions: {
      type: [
        {
          emoji: String,
          userId: mongoose.Schema.Types.ObjectId,
          userName: String,
        },
      ],
      default: [],
    },
    editedAt: {
      type: Date,
      default: null,
    },
    editHistory: {
      type: [
        {
          content: String,
          editedAt: Date,
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

// Indexes
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ read: 1 });

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);

export default Message;
