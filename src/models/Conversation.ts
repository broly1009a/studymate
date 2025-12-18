import mongoose, { Schema, Document, Model } from 'mongoose';
import './User'; // Ensure User model is registered

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  participantNames: string[];
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCounts: Map<string, number>;
  subject?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      required: true,
      validate: {
        validator: function (v: mongoose.Types.ObjectId[]) {
          return v.length === 2;
        },
        message: 'A conversation must have exactly 2 participants',
      },
    },
    participantNames: {
      type: [String],
      required: true,
    },
    lastMessage: {
      type: String,
      default: null,
    },
    lastMessageTime: {
      type: Date,
      default: null,
    },
    unreadCounts: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    subject: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });
conversationSchema.index({ 'unreadCounts': 1 });

const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>('Conversation', conversationSchema);

export default Conversation;
