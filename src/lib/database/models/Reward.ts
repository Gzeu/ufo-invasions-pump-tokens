import { ObjectId } from 'mongodb';

export interface Reward {
  _id?: ObjectId;
  id: string;
  userAddress: string;
  type: 'MISSION' | 'DAILY' | 'STREAK' | 'BONUS' | 'NFT_REWARD' | 'LEADERBOARD';
  title: string;
  description: string;
  amount: number;
  currency: 'USDT' | 'BNB' | 'ETH';
  status: 'PENDING' | 'CLAIMABLE' | 'CLAIMED';
  source: {
    missionId?: string;
    nftTokenId?: number;
    leaderboardRank?: number;
    streakDays?: number;
  };
  unlocksAt?: Date;
  claimedAt?: Date;
  transactionHash?: string;
  nftReward?: {
    type: string;
    rarity: string;
    tokenId?: number;
  };
  createdAt: Date;
  expiresAt?: Date;
}

export interface RewardPool {
  _id?: ObjectId;
  totalUsdt: number;
  dailyDistribution: number;
  lastDistribution: Date;
  distributedToday: number;
  reservedForClaims: number;
  emergencyFund: number;
  poolHistory: {
    date: Date;
    deposited: number;
    distributed: number;
    balance: number;
  }[];
}

export class RewardModel {
  static collectionName = 'rewards';
  static poolCollection = 'reward_pools';
  
  static createIndexes() {
    return [
      { key: { id: 1 }, unique: true },
      { key: { userAddress: 1, status: 1 } },
      { key: { type: 1 } },
      { key: { status: 1, unlocksAt: 1 } },
      { key: { createdAt: -1 } },
      { key: { expiresAt: 1 } }
    ];
  }
}