import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogCategory extends Document {
  name: string;
  slug: string;
  description: string;
  postCount: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const blogCategorySchema = new Schema<IBlogCategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 500,
    },
    postCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    color: {
      type: String,
      default: 'blue',
      enum: ['blue', 'purple', 'green', 'orange', 'red', 'pink', 'yellow', 'cyan'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
blogCategorySchema.index({ name: 1 });

const BlogCategory: Model<IBlogCategory> =
  mongoose.models.BlogCategory || mongoose.model<IBlogCategory>('BlogCategory', blogCategorySchema);

export default BlogCategory;
