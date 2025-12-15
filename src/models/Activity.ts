import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['study_session', 'question_answered', 'badge_earned', 'goal_completed', 'partner_connected', 'group_joined', 'post_created', 'comment_posted'],
    },
    title: {
      type: String,
      required: [true, 'Activity title is required'],
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    timestamp: {
      type: Date,
      required: true,
      default: () => new Date(),
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

activitySchema.index({ userId: 1, timestamp: -1 });
activitySchema.index({ type: 1 });

const Activity: Model<IActivity> =
  mongoose.models.Activity || mongoose.model<IActivity>('Activity', activitySchema);

export default Activity;
