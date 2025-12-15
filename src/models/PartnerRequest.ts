import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPartnerRequest extends Document {
  senderId: mongoose.Types.ObjectId;
  senderName: string;
  senderAvatar?: string;
  receiverId: mongoose.Types.ObjectId;
  receiverName: string;
  receiverAvatar?: string;
  subject: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const partnerRequestSchema = new Schema<IPartnerRequest>(
  {
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
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverName: {
      type: String,
      required: true,
    },
    receiverAvatar: {
      type: String,
      default: null,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      maxlength: 100,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
partnerRequestSchema.index({ senderId: 1 });
partnerRequestSchema.index({ receiverId: 1 });
partnerRequestSchema.index({ status: 1 });
partnerRequestSchema.index({ createdAt: -1 });

const PartnerRequest: Model<IPartnerRequest> =
  mongoose.models.PartnerRequest ||
  mongoose.model<IPartnerRequest>('PartnerRequest', partnerRequestSchema);

export default PartnerRequest;
