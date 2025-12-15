import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDashboardWidget extends Document {
  userId: mongoose.Types.ObjectId;
  widgetType:
    | 'study-streak'
    | 'study-time'
    | 'goals'
    | 'achievements'
    | 'recent-activity'
    | 'upcoming-events'
    | 'study-partners'
    | 'groups'
    | 'quick-stats'
    | 'calendar';
  title: string;
  position: number;
  size: 'small' | 'medium' | 'large';
  isVisible: boolean;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const dashboardWidgetSchema = new Schema<IDashboardWidget>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    widgetType: {
      type: String,
      enum: [
        'study-streak',
        'study-time',
        'goals',
        'achievements',
        'recent-activity',
        'upcoming-events',
        'study-partners',
        'groups',
        'quick-stats',
        'calendar',
      ],
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Widget title is required'],
      maxlength: 100,
    },
    position: {
      type: Number,
      required: true,
      min: 0,
    },
    size: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium',
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    settings: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
dashboardWidgetSchema.index({ userId: 1 });
dashboardWidgetSchema.index({ userId: 1, position: 1 });

const DashboardWidget: Model<IDashboardWidget> =
  mongoose.models.DashboardWidget ||
  mongoose.model<IDashboardWidget>('DashboardWidget', dashboardWidgetSchema);

export default DashboardWidget;
