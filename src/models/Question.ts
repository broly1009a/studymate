import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuestion extends Document {
  title: string;
  content: string;
  authorId: mongoose.Types.ObjectId;
  subject: string;
  tags: string[];
  views: number;
  votes: number;
  answersCount: number;
  hasAcceptedAnswer: boolean;
  status: 'open' | 'answered' | 'closed';
  votedBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    title: {
      type: String,
      required: [true, 'Question title is required'],
      maxlength: 300,
    },
    content: {
      type: String,
      required: [true, 'Question content is required'],
      maxlength: 5000,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: String,
      required: true,
      maxlength: 100,
    },
    tags: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    votes: {
      type: Number,
      default: 0,
    },
    answersCount: {
      type: Number,
      default: 0,
    },
    hasAcceptedAnswer: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['open', 'answered', 'closed'],
      default: 'open',
    },
    votedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.index({ authorId: 1 });
questionSchema.index({ subject: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ status: 1 });
questionSchema.index({ createdAt: -1 });

const Question: Model<IQuestion> =
  mongoose.models.Question || mongoose.model<IQuestion>('Question', questionSchema);

export default Question;
