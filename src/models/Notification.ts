import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type:
    | 'message'
    | 'partner-request'
    | 'group-invitation'
    | 'achievement'
    | 'comment'
    | 'like'
    | 'mention'
    | 'event-reminder';
  title: string;
  description: string;
  relatedId?: mongoose.Types.ObjectId;
  relatedType?: 'user' | 'post' | 'group' | 'event' | 'message';
  isRead: boolean;
  readAt?: Date;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    type: {
      type: String,
      enum: [
        'message',
        'partner-request',
        'group-invitation',
        'achievement',
        'comment',
        'like',
        'mention',
        'event-reminder',
      ],
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      maxlength: 150,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 500,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    relatedType: {
      type: String,
      enum: ['user', 'post', 'group', 'event', 'message'],
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    link: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ userId: 1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // 30 days TTL

const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;
