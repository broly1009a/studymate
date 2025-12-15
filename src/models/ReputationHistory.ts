import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReputationHistory extends Document {
  userId: mongoose.Types.ObjectId;
  points: number;
  reason: string;
  type: 'earned' | 'lost';
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reputationHistorySchema = new Schema<IReputationHistory>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    points: {
      type: Number,
      required: true,
      min: 0,
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      maxlength: 200,
    },
    type: {
      type: String,
      enum: ['earned', 'lost'],
      default: 'earned',
    },
    date: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  {
    timestamps: true,
  }
);

reputationHistorySchema.index({ userId: 1, date: -1 });

const ReputationHistory: Model<IReputationHistory> =
  mongoose.models.ReputationHistory ||
  mongoose.model<IReputationHistory>('ReputationHistory', reputationHistorySchema);

export default ReputationHistory;
