import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITeamMember {
  userId: mongoose.Types.ObjectId;
  userName: string;
  userAvatar?: string;
  role: 'leader' | 'member';
  joinedAt: Date;
}

export interface ICompetitionTeam extends Document {
  competitionId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  members: ITeamMember[];
  memberCount: number;
  maxMembers: number;
  lookingForMembers: boolean;
  skillsNeeded: string[];
  createdAt: Date;
  updatedAt: Date;
}

const teamMemberSchema = new Schema<ITeamMember>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userAvatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['leader', 'member'],
      default: 'member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const competitionTeamSchema = new Schema<ICompetitionTeam>(
  {
    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
      required: [true, 'Competition ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, 'Team description is required'],
      maxlength: 500,
    },
    members: [teamMemberSchema],
    memberCount: {
      type: Number,
      default: 1,
    },
    maxMembers: {
      type: Number,
      default: 5,
      min: 1,
      max: 10,
    },
    lookingForMembers: {
      type: Boolean,
      default: false,
    },
    skillsNeeded: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
competitionTeamSchema.index({ competitionId: 1 });
competitionTeamSchema.index({ competitionId: 1, lookingForMembers: 1 });
competitionTeamSchema.index({ 'members.userId': 1 });
competitionTeamSchema.index({ createdAt: -1 });

// Virtual for available slots
competitionTeamSchema.virtual('availableSlots').get(function () {
  return this.maxMembers - this.memberCount;
});

const CompetitionTeam: Model<ICompetitionTeam> =
  mongoose.models.CompetitionTeam || mongoose.model<ICompetitionTeam>('CompetitionTeam', competitionTeamSchema);

export default CompetitionTeam;
