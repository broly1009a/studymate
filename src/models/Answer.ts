import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnswer extends Document {
  questionId: mongoose.Types.ObjectId;
  content: string;
  authorId: mongoose.Types.ObjectId;
  votes: number;
  isAccepted: boolean;
  votedBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const answerSchema = new Schema<IAnswer>(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Answer content is required'],
      maxlength: 5000,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
    isAccepted: {
      type: Boolean,
      default: false,
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

answerSchema.index({ questionId: 1 });
answerSchema.index({ authorId: 1 });
answerSchema.index({ isAccepted: 1 });

const Answer: Model<IAnswer> = mongoose.models.Answer || mongoose.model<IAnswer>('Answer', answerSchema);

export default Answer;
