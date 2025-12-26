import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INote extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  subject: string;
  tags: string[];
  folderId?: mongoose.Types.ObjectId | null;
  isPinned: boolean;
  isFavorite: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Note title is required'],
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: [true, 'Note content is required'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: 100,
    },
    tags: {
      type: [String],
      default: [],
      maxlength: 20,
    },
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NoteFolder',
      default: null,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
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
noteSchema.index({ userId: 1 });
noteSchema.index({ userId: 1, isDeleted: 1 });
noteSchema.index({ userId: 1, folderId: 1 });
noteSchema.index({ userId: 1, isPinned: 1, updatedAt: -1 });
noteSchema.index({ userId: 1, isFavorite: 1 });
noteSchema.index({ title: 'text', content: 'text', subject: 'text', tags: 'text' });
noteSchema.index({ createdAt: -1 });

const Note: Model<INote> =
  mongoose.models.Note || mongoose.model<INote>('Note', noteSchema);

export default Note;
