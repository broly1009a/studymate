import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  authorId: mongoose.Types.ObjectId;
  authorName: string;
  authorAvatar?: string;
  categoryId: mongoose.Types.ObjectId;
  tags: string[];
  views: number;
  likes: number;
  likedBy: mongoose.Types.ObjectId[];
  commentsCount: number;
  readTime: number;
  publishedAt?: Date;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      maxlength: 300,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      maxlength: 300,
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
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BlogCategory',
      required: [true, 'Category is required'],
    },
    tags: {
      type: [String],
      default: [],
      maxlength: 20,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
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
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    readTime: {
      type: Number,
      default: 1,
      min: 1,
    },
    publishedAt: {
      type: Date,
      default: null,
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
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ authorId: 1 });
blogPostSchema.index({ categoryId: 1 });
blogPostSchema.index({ status: 1 });
blogPostSchema.index({ featured: 1 });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ publishedAt: -1 });
blogPostSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', blogPostSchema);

export default BlogPost;
