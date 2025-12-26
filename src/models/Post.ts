import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  authorId: mongoose.Types.ObjectId;
  authorName: string;
  authorAvatar?: string;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  likesBy: mongoose.Types.ObjectId[];
  commentsCount: number;
  readTime: number;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: 500,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    coverImage: {
      type: String,
      default: null,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorAvatar: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likesBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
postSchema.index({ authorId: 1 });
postSchema.index({ category: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ status: 1 });
postSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', postSchema);

export default Post;
