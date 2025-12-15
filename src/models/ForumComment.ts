import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IForumComment extends Document {
  parentId: mongoose.Types.ObjectId;
  parentType: 'question' | 'answer';
  content: string;
  authorId: mongoose.Types.ObjectId;
  votes: number;
  votedBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const forumCommentSchema = new Schema<IForumComment>(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'parentType',
    },
    parentType: {
      type: String,
      enum: ['question', 'answer'],
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      maxlength: 1000,
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

forumCommentSchema.index({ parentId: 1, parentType: 1 });
forumCommentSchema.index({ authorId: 1 });

const ForumComment: Model<IForumComment> =
  mongoose.models.ForumComment || mongoose.model<IForumComment>('ForumComment', forumCommentSchema);

export default ForumComment;
