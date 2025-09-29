import mongoose, { Schema, Model } from 'mongoose';

// User Interface
interface IUser {
  walletAddress: string;
  username: string;
  avatar: string;
  totalPoints: number;
  level: number;
  rank: number;
  badges: Array<{
    badgeId: string;
    badgeType: 'bronze' | 'silver' | 'gold' | 'platinum' | 'cosmic';
    earnedAt: Date;
    metadata: {
      name: string;
      image: string;
      description: string;
      rarity: string;
    };
  }>;
  totalRewardsEarned: number;
  pendingRewards: number;
  claimedRewards: number;
  missionsCompleted: number;
  lastActive: Date;
  joinedAt: Date;
}

// Mission Interface
interface IMission {
  missionId: string;
  title: string;
  description: string;
  category: 'social' | 'trading' | 'community' | 'special';
  requirements: {
    type: string;
    target: any;
    verification: string;
  };
  rewards: {
    points: number;
    usdt: number;
    badge: 'none' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'cosmic';
  };
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  maxCompletions: number;
  currentCompletions: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  estimatedTime: string;
}

// UserMission Interface
interface IUserMission {
  userId: mongoose.Types.ObjectId;
  missionId: string;
  walletAddress: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'claimed';
  progress: {
    current: number;
    required: number;
    percentage: number;
  };
  completedAt?: Date;
  claimedAt?: Date;
  rewardsClaimed: {
    points: number;
    usdt: number;
    badge?: string;
  };
}

// Leaderboard Interface
interface ILeaderboard {
  walletAddress: string;
  username: string;
  avatar: string;
  totalPoints: number;
  level: number;
  rank: number;
  badges: string[];
  missionsCompleted: number;
  totalRewards: number;
  lastUpdated: Date;
}

// User Schema
const UserSchema = new Schema<IUser>({
  walletAddress: { type: String, required: true, unique: true, index: true },
  username: { type: String, default: 'Cosmic Explorer' },
  avatar: { type: String, default: '/avatars/default-ufo.png' },
  totalPoints: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  rank: { type: Number, default: 0 },
  badges: [{
    badgeId: String,
    badgeType: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum', 'cosmic'] },
    earnedAt: { type: Date, default: Date.now },
    metadata: {
      name: String,
      image: String,
      description: String,
      rarity: String
    }
  }],
  totalRewardsEarned: { type: Number, default: 0 },
  pendingRewards: { type: Number, default: 0 },
  claimedRewards: { type: Number, default: 0 },
  missionsCompleted: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  joinedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Mission Schema
const MissionSchema = new Schema<IMission>({
  missionId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['social', 'trading', 'community', 'special'],
    required: true 
  },
  requirements: {
    type: { type: String },
    target: Schema.Types.Mixed,
    verification: { type: String }
  },
  rewards: {
    points: { type: Number, required: true },
    usdt: { type: Number, default: 0 },
    badge: {
      type: String,
      enum: ['none', 'bronze', 'silver', 'gold', 'platinum', 'cosmic'],
      default: 'none'
    }
  },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  maxCompletions: { type: Number, default: 0 },
  currentCompletions: { type: Number, default: 0 },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard', 'legendary'],
    default: 'easy'
  },
  estimatedTime: { type: String, default: '5 min' }
}, { timestamps: true });

// UserMission Schema
const UserMissionSchema = new Schema<IUserMission>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  missionId: { type: String, required: true },
  walletAddress: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['not_started', 'in_progress', 'completed', 'claimed'],
    default: 'not_started'
  },
  progress: {
    current: { type: Number, default: 0 },
    required: { type: Number, default: 1 },
    percentage: { type: Number, default: 0 }
  },
  completedAt: { type: Date },
  claimedAt: { type: Date },
  rewardsClaimed: {
    points: { type: Number, default: 0 },
    usdt: { type: Number, default: 0 },
    badge: { type: String }
  }
}, { timestamps: true });

// Leaderboard Schema
const LeaderboardSchema = new Schema<ILeaderboard>({
  walletAddress: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  avatar: { type: String },
  totalPoints: { type: Number, required: true, index: true },
  level: { type: Number, required: true },
  rank: { type: Number, required: true, index: true },
  badges: [{ type: String }],
  missionsCompleted: { type: Number, required: true },
  totalRewards: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Create indexes
UserMissionSchema.index({ walletAddress: 1, missionId: 1 }, { unique: true });
LeaderboardSchema.index({ totalPoints: -1, rank: 1 });

// Export models
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Mission: Model<IMission> = mongoose.models.Mission || mongoose.model<IMission>('Mission', MissionSchema);
export const UserMission: Model<IUserMission> = mongoose.models.UserMission || mongoose.model<IUserMission>('UserMission', UserMissionSchema);
export const Leaderboard: Model<ILeaderboard> = mongoose.models.Leaderboard || mongoose.model<ILeaderboard>('Leaderboard', LeaderboardSchema);

// Export interfaces
export type { IUser, IMission, IUserMission, ILeaderboard };