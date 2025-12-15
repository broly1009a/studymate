import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogComment extends Document {
  postId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  authorName: string;
  authorAvatar?: string;
  content: string;
  likes: number;
  likedBy: mongoose.Types.ObjectId[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const blogCommentSchema = new Schema<IBlogComment>(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BlogPost',
      required: [true, 'Post ID is required'],
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author ID is required'],
    },
    authorName: {
      type: String,
      required: [true, 'Author name is required'],
    },
    authorAvatar: {
      type: String,
      default: null,
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      maxlength: 1000,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    likedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
blogCommentSchema.index({ postId: 1 });
blogCommentSchema.index({ authorId: 1 });
blogCommentSchema.index({ postId: 1, createdAt: -1 });

const BlogComment: Model<IBlogComment> =
  mongoose.models.BlogComment || mongoose.model<IBlogComment>('BlogComment', blogCommentSchema);

export default BlogComment;
