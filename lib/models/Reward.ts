import { ObjectId } from 'mongodb';

export interface Reward {
  _id?: ObjectId;
  userId: ObjectId;
  walletAddress: string;
  type: 'mission' | 'game' | 'referral' | 'airdrop' | 'special';
  rewardType: 'USDT' | 'UFO' | 'NFT' | 'BADGE';
  amount: number;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired';
  txHash?: string;
  blockNumber?: number;
  error?: string;
  metadata?: {
    missionId?: ObjectId;
    gameId?: string;
    referralId?: ObjectId;
    nftTokenId?: string;
    badge?: string;
  };
  scheduledFor?: Date;
  processedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RewardStats {
  totalRewards: number;
  totalAmount: number;
  pendingRewards: number;
  completedToday: number;
  totalUSDT: number;
  totalUFO: number;
  totalNFTs: number;
}