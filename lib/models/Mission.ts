import { ObjectId } from 'mongodb';

export interface Mission {
  _id?: ObjectId;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'special' | 'epic';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  reward: {
    type: 'USDT' | 'UFO' | 'NFT' | 'BADGE';
    amount: number;
    nftId?: string;
    badge?: string;
  };
  requirements: {
    type: 'play_games' | 'win_games' | 'hold_tokens' | 'social_share' | 'referral' | 'trade_volume';
    target: number;
    timeLimit?: number; // in hours
  };
  participants: number;
  completions: number;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  isRepeatable: boolean;
  maxCompletions?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserMission {
  _id?: ObjectId;
  userId: ObjectId;
  missionId: ObjectId;
  progress: number;
  isCompleted: boolean;
  completedAt?: Date;
  rewardClaimed: boolean;
  claimedAt?: Date;
  startedAt: Date;
  lastUpdated: Date;
}