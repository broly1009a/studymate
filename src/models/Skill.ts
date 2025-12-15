import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISkill extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
  endorsements: number;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkill>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      maxlength: 100,
    },
    category: {
      type: String,
      required: true,
      maxlength: 100,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner',
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
      min: 0,
    },
    endorsements: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

skillSchema.index({ userId: 1 });
skillSchema.index({ category: 1 });

const Skill: Model<ISkill> = mongoose.models.Skill || mongoose.model<ISkill>('Skill', skillSchema);

export default Skill;
