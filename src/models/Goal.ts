import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGoal extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: 'study_hours' | 'sessions' | 'subject_mastery' | 'streak' | 'custom';
  category: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'failed' | 'paused';
  priority: 'low' | 'medium' | 'high';
  subjectId?: mongoose.Types.ObjectId;
  subjectName?: string;
  color?: string;
  icon?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const goalSchema = new Schema<IGoal>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    type: {
      type: String,
      enum: ['study_hours', 'sessions', 'subject_mastery', 'streak', 'custom'],
      default: 'custom',
    },
    category: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly', 'custom'],
      default: 'weekly',
    },
    targetValue: {
      type: Number,
      required: true,
      min: 0,
    },
    currentValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      maxlength: 50,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'failed', 'paused'],
      default: 'active',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      default: null,
    },
    subjectName: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: '#3b82f6',
    },
    icon: {
      type: String,
      default: '🎯',
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

goalSchema.index({ userId: 1, status: 1 });
goalSchema.index({ userId: 1, category: 1 });
goalSchema.index({ userId: 1, endDate: 1 });

const Goal: Model<IGoal> = mongoose.models.Goal || mongoose.model<IGoal>('Goal', goalSchema);

export default Goal;
