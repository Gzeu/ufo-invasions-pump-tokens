import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  walletAddress: string;
  referralCode: string;
  referredBy?: string;
  badges: string[];
  totalPoints: number;
  nftsOwned: string[];
  missionsCompleted: string[];
  rewardsEarned: number;
  createdAt: Date;
  updatedAt: Date;
  lastActive: Date;
  // Social media integration
  twitterHandle?: string;
  telegramId?: string;
  discordId?: string;
  // Game stats
  totalGames: number;
  gamesWon: number;
  winRate: number;
  highestScore: number;
  // Trading stats
  totalTrades: number;
  tradingVolume: number;
  referralEarnings: number;
  airdropsClaimed: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  totalReferrals: number;
  totalMissionsCompleted: number;
  totalRewardsDistributed: number;
}

export interface UserLeaderboard {
  walletAddress: string;
  rank: number;
  totalPoints: number;
  badges: string[];
  rewardsEarned: number;
  nftsCount: number;
}