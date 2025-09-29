import { ObjectId } from 'mongodb';

export interface UserProfile {
  _id?: ObjectId;
  address: string;
  displayName?: string;
  avatar?: string;
  totalRewards: number;
  nftCount: number;
  missionsCompleted: number;
  currentRank: number;
  powerLevel: number;
  experiencePoints: number;
  badges: string[];
  nftTokenIds: number[];
  preferences: {
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    favoriteCategories: string[];
    preferredChains: string[];
  };
  stats: {
    avgInvestmentSize: number;
    activityScore: number;
    totalVolume: number;
    winRate: number;
  };
  joinedAt: Date;
  lastActive: Date;
  isActive: boolean;
}

export interface UserTransaction {
  _id?: ObjectId;
  userAddress: string;
  transactionHash: string;
  type: 'BUY' | 'SELL' | 'STAKE' | 'CLAIM' | 'NFT_MINT';
  tokenAddress?: string;
  tokenSymbol?: string;
  amount: number;
  usdValue: number;
  chain: string;
  blockNumber: number;
  timestamp: Date;
  missionId?: string;
}

export class UserModel {
  static collectionName = 'users';
  
  static createIndexes() {
    // MongoDB indexes pentru performance
    return [
      { key: { address: 1 }, unique: true },
      { key: { currentRank: 1 } },
      { key: { totalRewards: -1 } },
      { key: { lastActive: -1 } },
      { key: { 'stats.activityScore': -1 } }
    ];
  }
}