// GPZ-82: Real-time Leaderboard System Implementation
// Dynamic ranking și competitive gaming features

import { NextApiRequest, NextApiResponse } from 'next';

// User Ranking Interface
export interface UserRanking {
  wallet: string;
  username?: string;
  rank: number;
  score: number;
  level: number;
  xp: number;
  badges: string[];
  completedMissions: number;
  totalRewardsEarned: number;
  streak: number;
  joinedAt: Date;
  lastActiveAt: Date;
  trend: 'up' | 'down' | 'same';
  previousRank?: number;
}

// Leaderboard Stats Interface
export interface LeaderboardStats {
  totalUsers: number;
  totalMissionsCompleted: number;
  totalRewardsDistributed: number;
  averageScore: number;
  topStreakDays: number;
  mostActiveUser: string;
  lastUpdated: Date;
}

// Seasonal Competition Interface
export interface SeasonalCompetition {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  prizePool: number;
  participants: number;
  status: 'upcoming' | 'active' | 'ended';
  leaderboard: UserRanking[];
  prizes: {
    rank: number;
    prize: number;
    type: 'USDT' | 'NFT' | 'BADGE';
  }[];
}

// Score Calculation Engine
export class ScoreCalculator {
  private static readonly SCORING_WEIGHTS = {
    missionCompletion: 100,      // Base points per mission
    dailyStreak: 50,             // Points per day streak
    socialEngagement: 25,        // Points per social interaction
    holdingBonus: 10,            // Points per day holding
    referralBonus: 200,          // Points per successful referral
    levelMultiplier: 1.1,        // Multiplier per level
    speedBonus: 0.5,             // Bonus pentru fast completion
    accuracyBonus: 0.3           // Bonus pentru high accuracy
  };
  
  static calculateUserScore(
    userActivity: {
      missionsCompleted: number;
      currentStreak: number;
      socialShares: number;
      holdingDays: number;
      referrals: number;
      level: number;
      averageCompletionTime?: number;
      averageAccuracy?: number;
    }
  ): number {
    const weights = this.SCORING_WEIGHTS;
    
    // Base score calculation
    let score = 0;
    
    // Mission completion score
    score += userActivity.missionsCompleted * weights.missionCompletion;
    
    // Streak bonus (exponential growth)
    score += Math.pow(userActivity.currentStreak, 1.2) * weights.dailyStreak;
    
    // Social engagement
    score += userActivity.socialShares * weights.socialEngagement;
    
    // Holding bonus
    score += userActivity.holdingDays * weights.holdingBonus;
    
    // Referral bonus
    score += userActivity.referrals * weights.referralBonus;
    
    // Level multiplier
    score *= Math.pow(weights.levelMultiplier, userActivity.level - 1);
    
    // Performance bonuses
    if (userActivity.averageCompletionTime && userActivity.averageCompletionTime < 50) {
      score *= (1 + weights.speedBonus);
    }
    
    if (userActivity.averageAccuracy && userActivity.averageAccuracy > 90) {
      score *= (1 + weights.accuracyBonus);
    }
    
    return Math.floor(score);
  }
  
  static calculateTrend(
    currentRank: number,
    previousRank?: number
  ): 'up' | 'down' | 'same' {
    if (!previousRank) return 'same';
    
    if (currentRank < previousRank) return 'up';    // Lower rank number = higher position
    if (currentRank > previousRank) return 'down';
    return 'same';
  }
  
  static getScoreBreakdown(
    userActivity: any
  ): {
    missions: number;
    streaks: number;
    social: number;
    holding: number;
    referrals: number;
    bonuses: number;
    total: number;
  } {
    const weights = this.SCORING_WEIGHTS;
    
    const missions = userActivity.missionsCompleted * weights.missionCompletion;
    const streaks = Math.pow(userActivity.currentStreak, 1.2) * weights.dailyStreak;
    const social = userActivity.socialShares * weights.socialEngagement;
    const holding = userActivity.holdingDays * weights.holdingBonus;
    const referrals = userActivity.referrals * weights.referralBonus;
    
    const baseScore = missions + streaks + social + holding + referrals;
    const multiplier = Math.pow(weights.levelMultiplier, userActivity.level - 1);
    const bonuses = baseScore * (multiplier - 1);
    
    return {
      missions: Math.floor(missions),
      streaks: Math.floor(streaks),
      social: Math.floor(social),
      holding: Math.floor(holding),
      referrals: Math.floor(referrals),
      bonuses: Math.floor(bonuses),
      total: Math.floor(baseScore * multiplier)
    };
  }
}

// Real-time Updates Manager
export class LeaderboardUpdates {
  private static updateQueue: {
    wallet: string;
    scoreChange: number;
    timestamp: Date;
  }[] = [];
  
  static queueScoreUpdate(wallet: string, scoreChange: number): void {
    this.updateQueue.push({
      wallet,
      scoreChange,
      timestamp: new Date()
    });
  }
  
  static async processUpdateQueue(): Promise<{
    processed: number;
    failed: number;
    rankingChanges: {
      wallet: string;
      oldRank: number;
      newRank: number;
    }[];
  }> {
    const rankingChanges: any[] = [];
    let processed = 0;
    let failed = 0;
    
    // Process queued updates
    for (const update of this.updateQueue) {
      try {
        // Mock ranking change calculation
        const oldRank = Math.floor(Math.random() * 100) + 1;
        const newRank = Math.max(1, oldRank + (Math.random() > 0.5 ? -5 : 5));
        
        rankingChanges.push({
          wallet: update.wallet,
          oldRank,
          newRank
        });
        
        processed++;
      } catch (error) {
        console.error('Update processing error:', error);
        failed++;
      }
    }
    
    // Clear processed updates
    this.updateQueue = [];
    
    return {
      processed,
      failed,
      rankingChanges
    };
  }
  
  static async broadcastRankingChanges(
    changes: any[]
  ): Promise<void> {
    // Mock WebSocket broadcast
    // In production: emit through Socket.io
    console.log('Broadcasting ranking changes:', changes.length);
  }
}

// Competition Manager
export class CompetitionManager {
  private static readonly SEASONAL_COMPETITIONS: SeasonalCompetition[] = [
    {
      id: 'invasion_2025_q4',
      name: 'The Great UFO Invasion - Q4 2025',
      description: 'Compete for the ultimate alien supremacy and massive USDT rewards!',
      startDate: new Date('2025-10-01'),
      endDate: new Date('2025-12-31'),
      prizePool: 10000, // 10,000 USDT
      participants: 0,
      status: 'active',
      leaderboard: [],
      prizes: [
        { rank: 1, prize: 3000, type: 'USDT' },
        { rank: 2, prize: 2000, type: 'USDT' },
        { rank: 3, prize: 1500, type: 'USDT' },
        { rank: 4, prize: 1000, type: 'USDT' },
        { rank: 5, prize: 750, type: 'USDT' },
        { rank: 10, prize: 500, type: 'USDT' },
        { rank: 25, prize: 250, type: 'USDT' },
        { rank: 50, prize: 100, type: 'USDT' }
      ]
    }
  ];
  
  static getActiveCompetitions(): SeasonalCompetition[] {
    const now = new Date();
    return this.SEASONAL_COMPETITIONS.filter(
      comp => comp.status === 'active' && comp.startDate <= now && comp.endDate >= now
    );
  }
  
  static getCompetitionLeaderboard(
    competitionId: string,
    limit: number = 100
  ): UserRanking[] {
    // Mock competition leaderboard
    const mockLeaderboard: UserRanking[] = Array.from({ length: limit }, (_, index) => ({
      wallet: `0x${Math.random().toString(16).substring(2, 42)}`,
      username: `AlienCommander${index + 1}`,
      rank: index + 1,
      score: Math.floor(Math.random() * 10000) + 1000,
      level: Math.floor(Math.random() * 20) + 1,
      xp: Math.floor(Math.random() * 5000),
      badges: [`badge_${Math.floor(Math.random() * 8) + 1}`],
      completedMissions: Math.floor(Math.random() * 50),
      totalRewardsEarned: Math.floor(Math.random() * 500),
      streak: Math.floor(Math.random() * 30),
      joinedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      lastActiveAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      trend: ['up', 'down', 'same'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'same',
      previousRank: index > 0 ? index + Math.floor(Math.random() * 6) - 3 : undefined
    }));
    
    return mockLeaderboard.sort((a, b) => b.score - a.score);
  }
}

// Leaderboard API Implementation
export class LeaderboardAPI {
  // GET /api/leaderboard/global - Ranking global cu paginare
  static async getGlobalLeaderboard(
    page: number = 1,
    limit: number = 50
  ): Promise<{
    leaderboard: UserRanking[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    stats: LeaderboardStats;
  }> {
    // Mock global leaderboard
    const totalUsers = 1247;
    const startIndex = (page - 1) * limit;
    
    const leaderboard: UserRanking[] = Array.from({ length: limit }, (_, index) => {
      const rank = startIndex + index + 1;
      return {
        wallet: `0x${Math.random().toString(16).substring(2, 42)}`,
        username: `UFOCommander${rank}`,
        rank,
        score: Math.max(100, 15000 - (rank * 10) + Math.random() * 200),
        level: Math.max(1, 25 - Math.floor(rank / 10)),
        xp: Math.floor(Math.random() * 5000),
        badges: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, 
          (_, i) => `badge_${i + 1}`),
        completedMissions: Math.max(1, 100 - Math.floor(rank / 5)),
        totalRewardsEarned: Math.floor(Math.random() * 1000),
        streak: Math.floor(Math.random() * 30),
        joinedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
        lastActiveAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        trend: ['up', 'down', 'same'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'same',
        previousRank: rank + (Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : -(Math.floor(Math.random() * 5) + 1))
      };
    });
    
    const stats: LeaderboardStats = {
      totalUsers,
      totalMissionsCompleted: 15847,
      totalRewardsDistributed: 125000,
      averageScore: 2450,
      topStreakDays: 45,
      mostActiveUser: 'UFOCommander1',
      lastUpdated: new Date()
    };
    
    return {
      leaderboard,
      pagination: {
        page,
        limit,
        total: totalUsers,
        hasNext: startIndex + limit < totalUsers,
        hasPrev: page > 1
      },
      stats
    };
  }
  
  // GET /api/leaderboard/user/:wallet - Poziție user specific
  static async getUserRanking(wallet: string): Promise<{
    ranking: UserRanking;
    scoreBreakdown: any;
    nearbyUsers: UserRanking[];
    achievements: {
      recentBadges: string[];
      milestones: string[];
      nextGoals: string[];
    };
  }> {
    // Mock user ranking
    const rank = Math.floor(Math.random() * 500) + 1;
    const score = Math.max(100, 10000 - (rank * 15) + Math.random() * 300);
    
    const ranking: UserRanking = {
      wallet,
      username: `AlienHunter${Math.floor(Math.random() * 1000)}`,
      rank,
      score,
      level: Math.floor(score / 500) + 1,
      xp: Math.floor(Math.random() * 5000),
      badges: ['rookie_hunter', 'social_scout', 'diamond_hands'],
      completedMissions: Math.floor(Math.random() * 50) + 10,
      totalRewardsEarned: Math.floor(Math.random() * 800) + 100,
      streak: Math.floor(Math.random() * 25) + 1,
      joinedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      lastActiveAt: new Date(),
      trend: 'up',
      previousRank: rank + 3
    };
    
    // Score breakdown
    const scoreBreakdown = ScoreCalculator.getScoreBreakdown({
      missionsCompleted: ranking.completedMissions,
      currentStreak: ranking.streak,
      socialShares: 25,
      holdingDays: 45,
      referrals: 3,
      level: ranking.level
    });
    
    // Nearby users (±5 ranks)
    const nearbyUsers: UserRanking[] = Array.from({ length: 10 }, (_, i) => {
      const nearbyRank = Math.max(1, rank - 5 + i);
      return {
        wallet: `0x${Math.random().toString(16).substring(2, 42)}`,
        username: `User${nearbyRank}`,
        rank: nearbyRank,
        score: Math.max(100, score + (rank - nearbyRank) * 20),
        level: Math.floor(Math.random() * 20) + 1,
        xp: Math.floor(Math.random() * 5000),
        badges: [],
        completedMissions: Math.floor(Math.random() * 50),
        totalRewardsEarned: Math.floor(Math.random() * 500),
        streak: Math.floor(Math.random() * 20),
        joinedAt: new Date(),
        lastActiveAt: new Date(),
        trend: 'same'
      };
    });
    
    const achievements = {
      recentBadges: ['pump_detector', 'streak_master'],
      milestones: ['100 missions completed', 'Top 100 ranking achieved'],
      nextGoals: ['Reach level 15', 'Complete 5 more missions', 'Maintain 30-day streak']
    };
    
    return {
      ranking,
      scoreBreakdown,
      nearbyUsers,
      achievements
    };
  }
  
  // POST /api/leaderboard/update - Update score utilizator
  static async updateUserScore(
    wallet: string,
    scoreChange: number,
    reason: string
  ): Promise<{
    success: boolean;
    newScore: number;
    newRank: number;
    rankChange: number;
    error?: string;
  }> {
    try {
      // Queue update pentru real-time processing
      LeaderboardUpdates.queueScoreUpdate(wallet, scoreChange);
      
      // Mock new score calculation
      const currentScore = Math.floor(Math.random() * 5000) + 1000;
      const newScore = Math.max(0, currentScore + scoreChange);
      const oldRank = Math.floor(Math.random() * 100) + 1;
      const newRank = Math.max(1, oldRank - Math.floor(scoreChange / 100));
      const rankChange = oldRank - newRank;
      
      return {
        success: true,
        newScore,
        newRank,
        rankChange
      };
      
    } catch (error) {
      console.error('Score update error:', error);
      return {
        success: false,
        newScore: 0,
        newRank: 0,
        rankChange: 0,
        error: 'Failed to update score'
      };
    }
  }
  
  // GET /api/leaderboard/stats - Statistici generale
  static async getLeaderboardStats(): Promise<LeaderboardStats & {
    topPerformers: UserRanking[];
    recentActivities: {
      type: string;
      user: string;
      description: string;
      timestamp: Date;
    }[];
    trends: {
      dailyActiveUsers: number;
      missionsCompletedToday: number;
      rewardsDistributedToday: number;
    };
  }> {
    const baseStats: LeaderboardStats = {
      totalUsers: 1247,
      totalMissionsCompleted: 15847,
      totalRewardsDistributed: 125000,
      averageScore: 2450,
      topStreakDays: 45,
      mostActiveUser: 'UFOCommander1',
      lastUpdated: new Date()
    };
    
    const topPerformers = (await this.getGlobalLeaderboard(1, 10)).leaderboard;
    
    const recentActivities = [
      {
        type: 'mission_completed',
        user: 'AlienHunter42',
        description: 'Completed UFO Pump Hunter mission',
        timestamp: new Date(Date.now() - 5 * 60 * 1000)
      },
      {
        type: 'rank_changed',
        user: 'CosmicTrader',
        description: 'Moved up 5 positions to rank #23',
        timestamp: new Date(Date.now() - 15 * 60 * 1000)
      },
      {
        type: 'reward_claimed',
        user: 'DiamondHands99',
        description: 'Claimed 25 USDT reward',
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      }
    ];
    
    const trends = {
      dailyActiveUsers: 456,
      missionsCompletedToday: 234,
      rewardsDistributedToday: 1850
    };
    
    return {
      ...baseStats,
      topPerformers,
      recentActivities,
      trends
    };
  }
}

// Export pentru utilizare în API routes
export default {
  ScoreCalculator,
  LeaderboardUpdates,
  CompetitionManager,
  LeaderboardAPI
};
