import { ObjectId } from 'mongodb';

export interface Mission {
  _id?: ObjectId;
  id: string; // Unique mission identifier
  type: 'PUMP_HUNTER' | 'DEGEN_EXPLORER' | 'COSMIC_WHALE' | 'TRENDING_HUNTER' | 'VIRAL_SCOUT' | 'CATEGORY_SPECIALIST';
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  rewards: {
    usdt: number;
    nft: boolean;
    badge?: string;
  };
  conditions: {
    minInvestment?: number;
    targetToken?: string;
    category?: string;
    holdDuration?: number;
    chain?: string;
    minLiquidity?: number;
    socialProof?: number;
  };
  timeLimit: number; // Timestamp când expiră
  isActive: boolean;
  createdAt: Date;
  expiresAt: Date;
  aiGenerated: boolean;
  targetAudience: {
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
    minPowerLevel?: number;
    requiredBadges?: string[];
  };
}

export interface UserMission {
  _id?: ObjectId;
  missionId: string;
  userAddress: string;
  status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'FAILED';
  progress: number; // 0-100
  startedAt: Date;
  completedAt?: Date;
  proofTransactionHash?: string;
  rewardsClaimed: boolean;
  earnedRewards?: {
    usdt: number;
    nft?: {
      tokenId: number;
      type: string;
    };
    badge?: string;
  };
}

export class MissionModel {
  static collectionName = 'missions';
  static userMissionsCollection = 'user_missions';
  
  static createIndexes() {
    return [
      { key: { id: 1 }, unique: true },
      { key: { type: 1 } },
      { key: { difficulty: 1 } },
      { key: { isActive: 1, expiresAt: 1 } },
      { key: { createdAt: -1 } },
      // User missions indexes
      { key: { userAddress: 1, status: 1 } },
      { key: { missionId: 1, userAddress: 1 }, unique: true }
    ];
  }
}