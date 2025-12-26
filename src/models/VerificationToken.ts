import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVerificationToken extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  token: string;
  type: 'email' | 'password-reset';
  expiresAt: Date;
  createdAt: Date;
}

const verificationTokenSchema = new Schema<IVerificationToken>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    token: {
      type: String,
      required: [true, 'Token is required'],
      unique: true,
    },
    type: {
      type: String,
      enum: ['email', 'password-reset'],
      default: 'email',
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index - MongoDB will auto-delete expired documents
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
verificationTokenSchema.index({ userId: 1, type: 1 });
verificationTokenSchema.index({ email: 1 });

const VerificationToken: Model<IVerificationToken> =
  mongoose.models.VerificationToken ||
  mongoose.model<IVerificationToken>('VerificationToken', verificationTokenSchema);

export default VerificationToken;
