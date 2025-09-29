import { ObjectId } from 'mongodb';

export interface LeaderboardEntry {
  _id?: ObjectId;
  userAddress: string;
  displayName: string;
  rank: number;
  totalRewards: number;
  missionsCompleted: number;
  powerLevel: number;
  badges: string[];
  nftCount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'alltime';
  periodStart: Date;
  periodEnd: Date;
  lastUpdated: Date;
}

export interface LeaderboardSnapshot {
  _id?: ObjectId;
  period: 'daily' | 'weekly' | 'monthly';
  periodStart: Date;
  periodEnd: Date;
  entries: LeaderboardEntry[];
  totalParticipants: number;
  averageRewards: number;
  createdAt: Date;
}

export class LeaderboardModel {
  static collectionName = 'leaderboard';
  static snapshotsCollection = 'leaderboard_snapshots';
  
  static createIndexes() {
    return [
      { key: { userAddress: 1, period: 1 }, unique: true },
      { key: { period: 1, rank: 1 } },
      { key: { totalRewards: -1 } },
      { key: { periodStart: 1, periodEnd: 1 } },
      { key: { lastUpdated: -1 } }
    ];
  }
}