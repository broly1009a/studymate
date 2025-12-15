import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INoteFolder extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  color: string;
  noteCount: number;
  description?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const noteFolderSchema = new Schema<INoteFolder>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Folder name is required'],
      trim: true,
      maxlength: 100,
    },
    color: {
      type: String,
      default: 'blue',
      enum: ['blue', 'green', 'purple', 'red', 'orange', 'pink', 'cyan', 'yellow'],
    },
    noteCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      default: null,
      maxlength: 200,
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
noteFolderSchema.index({ userId: 1 });
noteFolderSchema.index({ userId: 1, isDeleted: 1 });
noteFolderSchema.index({ createdAt: -1 });

const NoteFolder: Model<INoteFolder> =
  mongoose.models.NoteFolder || mongoose.model<INoteFolder>('NoteFolder', noteFolderSchema);

export default NoteFolder;
