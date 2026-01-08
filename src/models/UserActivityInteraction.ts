import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserActivityInteraction extends Document {
  userId: mongoose.Types.ObjectId;
  activityId: mongoose.Types.ObjectId;
  activityType: 'event' | 'competition' | 'group_event';
  action: 'viewed' | 'interested' | 'joined' | 'skipped' | 'left';
  source: 'tinder-swipe' | 'direct-register' | 'rsvp' | 'calendar' | 'search';
  metadata?: {
    swipeDirection?: 'left' | 'right';
    registrationData?: any;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userActivityInteractionSchema = new Schema<IUserActivityInteraction>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    activityType: {
      type: String,
      enum: ['event', 'competition', 'group_event'],
      required: true,
    },
    action: {
      type: String,
      enum: ['viewed', 'interested', 'joined', 'skipped', 'left'],
      required: true,
    },
    source: {
      type: String,
      enum: ['tinder-swipe', 'direct-register', 'rsvp', 'calendar', 'search'],
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
userActivityInteractionSchema.index({ userId: 1, activityId: 1, action: 1 });
userActivityInteractionSchema.index({ userId: 1, activityType: 1, action: 1 });
userActivityInteractionSchema.index({ activityId: 1, activityType: 1 });
userActivityInteractionSchema.index({ createdAt: -1 });

// Prevent duplicate interactions (same user, same activity, same action)
userActivityInteractionSchema.index(
  { userId: 1, activityId: 1, activityType: 1, action: 1 },
  { unique: true, sparse: true }
);

const UserActivityInteraction: Model<IUserActivityInteraction> =
  mongoose.models.UserActivityInteraction ||
  mongoose.model<IUserActivityInteraction>('UserActivityInteraction', userActivityInteractionSchema);

export default UserActivityInteraction;
