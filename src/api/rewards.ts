// GPZ-82: Rewards System Implementation
// USDT integration and reward distribution logic

import { NextApiRequest, NextApiResponse } from 'next';

// Reward Types
export enum RewardType {
  MISSION_COMPLETION = 'mission_completion',
  DAILY_LOGIN = 'daily_login',
  STREAK_BONUS = 'streak_bonus',
  REFERRAL_BONUS = 'referral_bonus',
  LEADERBOARD_PRIZE = 'leaderboard_prize',
  SPECIAL_EVENT = 'special_event',
  AIRDROP = 'airdrop'
}

// Reward Interface
export interface Reward {
  id: string;
  wallet: string;
  type: RewardType;
  amount: number; // USDT amount
  source: string; // mission_id, event_id, etc.
  description: string;
  status: 'pending' | 'claimed' | 'expired';
  createdAt: Date;
  claimedAt?: Date;
  txHash?: string;
  expiresAt?: Date;
}

// Claim History Interface
export interface ClaimHistory {
  wallet: string;
  totalClaimed: number;
  lastClaimAt: Date;
  claimCount: number;
  claims: {
    date: Date;
    amount: number;
    txHash: string;
    type: RewardType;
  }[];
}

// USDT Contract Integration
export class USDTIntegration {
  private static readonly USDT_CONTRACT = {
    address: '0x55d398326f99059fF775485246999027B3197955', // BSC Mainnet USDT
    testnet: '0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684', // BSC Testnet USDT
    decimals: 18
  };
  
  private static readonly REWARD_POOL_WALLET = process.env.REWARD_POOL_WALLET || '0x...';
  
  static async getPoolBalance(): Promise<{
    balance: number;
    formattedBalance: string;
    isLowBalance: boolean;
  }> {
    try {
      // Mock data pentru development
      // In production: query USDT contract balance
      const balance = Math.random() * 10000 + 1000; // 1000-11000 USDT
      
      return {
        balance,
        formattedBalance: `${balance.toFixed(2)} USDT`,
        isLowBalance: balance < 1000
      };
    } catch (error) {
      console.error('Pool balance check error:', error);
      return {
        balance: 0,
        formattedBalance: '0.00 USDT',
        isLowBalance: true
      };
    }
  }
  
  static async distributeReward(
    recipientWallet: string,
    amount: number,
    rewardId: string
  ): Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
  }> {
    try {
      // Simulare pentru development
      // In production: interact with USDT contract
      const success = Math.random() > 0.1; // 90% success rate
      
      if (success) {
        const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
        return {
          success: true,
          txHash: mockTxHash
        };
      } else {
        return {
          success: false,
          error: 'Insufficient pool balance or network error'
        };
      }
    } catch (error) {
      console.error('Reward distribution error:', error);
      return {
        success: false,
        error: 'Transaction failed'
      };
    }
  }
  
  static async validateTransaction(txHash: string): Promise<{
    isValid: boolean;
    amount?: number;
    recipient?: string;
    timestamp?: Date;
  }> {
    try {
      // Mock validation pentru development
      // In production: query BSC transaction
      return {
        isValid: Math.random() > 0.05, // 95% validation success
        amount: Math.random() * 100 + 10,
        recipient: '0x' + Math.random().toString(16).substring(2, 42),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Transaction validation error:', error);
      return { isValid: false };
    }
  }
}

// Reward Calculator
export class RewardCalculator {
  private static readonly REWARD_RATES = {
    [RewardType.MISSION_COMPLETION]: {
      easy: 5,     // 5 USDT
      medium: 12,  // 12 USDT
      hard: 25,    // 25 USDT
      legendary: 50 // 50 USDT
    },
    [RewardType.DAILY_LOGIN]: 2,      // 2 USDT
    [RewardType.STREAK_BONUS]: 10,    // 10 USDT per week streak
    [RewardType.REFERRAL_BONUS]: 15,  // 15 USDT per referral
    [RewardType.LEADERBOARD_PRIZE]: {
      rank1: 100,   // 100 USDT
      rank2: 75,    // 75 USDT
      rank3: 50,    // 50 USDT
      top10: 25,    // 25 USDT
      top50: 10     // 10 USDT
    }
  };
  
  static calculateMissionReward(
    difficulty: 'easy' | 'medium' | 'hard' | 'legendary',
    performance: {
      completionTime?: number;
      accuracy?: number;
      bonus?: boolean;
    }
  ): number {
    let baseReward = this.REWARD_RATES[RewardType.MISSION_COMPLETION][difficulty];
    
    // Performance multipliers
    if (performance.completionTime && performance.completionTime < 50) {
      baseReward *= 1.2; // 20% bonus pentru completion rapid
    }
    
    if (performance.accuracy && performance.accuracy > 90) {
      baseReward *= 1.15; // 15% bonus pentru accuracy ridicat
    }
    
    if (performance.bonus) {
      baseReward *= 1.5; // 50% bonus pentru special events
    }
    
    return Math.floor(baseReward * 100) / 100; // Round to 2 decimals
  }
  
  static calculateStreakBonus(streakDays: number): number {
    const weeklyStreaks = Math.floor(streakDays / 7);
    return weeklyStreaks * this.REWARD_RATES[RewardType.STREAK_BONUS];
  }
  
  static calculateLeaderboardPrize(rank: number, totalParticipants: number): number {
    const rates = this.REWARD_RATES[RewardType.LEADERBOARD_PRIZE];
    
    if (rank === 1) return rates.rank1;
    if (rank === 2) return rates.rank2;
    if (rank === 3) return rates.rank3;
    if (rank <= 10) return rates.top10;
    if (rank <= 50) return rates.top50;
    
    return 0;
  }
}

// Beam Animation Airdrop System
export class BeamAirdropSystem {
  private static readonly AIRDROP_POOLS = {
    daily: 500,    // 500 USDT daily pool
    weekly: 2000,  // 2000 USDT weekly pool
    monthly: 10000 // 10000 USDT monthly pool
  };
  
  static async triggerRandomAirdrop(): Promise<{
    triggered: boolean;
    recipients?: string[];
    amountPerUser?: number;
    totalDistributed?: number;
    beamAnimation?: boolean;
  }> {
    // Random airdrop trigger (1% chance per call)
    const shouldTrigger = Math.random() < 0.01;
    
    if (!shouldTrigger) {
      return { triggered: false };
    }
    
    // Select random active users (mock)
    const mockUsers = [
      '0x1234...5678',
      '0xabcd...efgh',
      '0x9876...5432'
    ];
    
    const recipients = mockUsers.slice(0, Math.floor(Math.random() * 3) + 1);
    const amountPerUser = Math.floor(Math.random() * 50) + 10; // 10-60 USDT
    
    return {
      triggered: true,
      recipients,
      amountPerUser,
      totalDistributed: recipients.length * amountPerUser,
      beamAnimation: true
    };
  }
  
  static generateBeamEffect(): {
    animation: string;
    duration: number;
    sound: boolean;
    particles: number;
  } {
    return {
      animation: 'ufo-beam-down',
      duration: 3000, // 3 seconds
      sound: true,
      particles: Math.floor(Math.random() * 20) + 10
    };
  }
}

// Rewards API Implementation
export class RewardsAPI {
  // GET /api/rewards/pending - Recompense pending pentru user
  static async getPendingRewards(wallet: string): Promise<{
    rewards: Reward[];
    totalPending: number;
    count: number;
  }> {
    // Mock pending rewards
    const mockRewards: Reward[] = [
      {
        id: 'reward_001',
        wallet,
        type: RewardType.MISSION_COMPLETION,
        amount: 25.50,
        source: 'pump_hunter_001',
        description: 'UFO Pump Hunter Mission Completed',
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days
      },
      {
        id: 'reward_002',
        wallet,
        type: RewardType.DAILY_LOGIN,
        amount: 2.00,
        source: 'daily_login',
        description: 'Daily Login Bonus',
        status: 'pending',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6h ago
        expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 day
      }
    ];
    
    const totalPending = mockRewards.reduce((sum, reward) => sum + reward.amount, 0);
    
    return {
      rewards: mockRewards,
      totalPending,
      count: mockRewards.length
    };
  }
  
  // POST /api/rewards/claim - Claim recompense
  static async claimReward(
    wallet: string,
    rewardId: string
  ): Promise<{
    success: boolean;
    txHash?: string;
    amount?: number;
    error?: string;
    beamEffect?: any;
  }> {
    try {
      // Find reward (mock)
      const pendingRewards = await this.getPendingRewards(wallet);
      const reward = pendingRewards.rewards.find(r => r.id === rewardId);
      
      if (!reward) {
        return { success: false, error: 'Reward not found' };
      }
      
      if (reward.status !== 'pending') {
        return { success: false, error: 'Reward already claimed or expired' };
      }
      
      // Check pool balance
      const poolBalance = await USDTIntegration.getPoolBalance();
      if (poolBalance.balance < reward.amount) {
        return { success: false, error: 'Insufficient pool balance' };
      }
      
      // Distribute reward
      const distribution = await USDTIntegration.distributeReward(
        wallet,
        reward.amount,
        rewardId
      );
      
      if (!distribution.success) {
        return { success: false, error: distribution.error };
      }
      
      // Generate beam effect pentru visual feedback
      const beamEffect = BeamAirdropSystem.generateBeamEffect();
      
      return {
        success: true,
        txHash: distribution.txHash,
        amount: reward.amount,
        beamEffect
      };
      
    } catch (error) {
      console.error('Claim reward error:', error);
      return { success: false, error: 'Internal server error' };
    }
  }
  
  // GET /api/rewards/history - Istoric recompense
  static async getClaimHistory(wallet: string): Promise<ClaimHistory> {
    // Mock claim history
    const mockHistory: ClaimHistory = {
      wallet,
      totalClaimed: 156.75,
      lastClaimAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      claimCount: 8,
      claims: [
        {
          date: new Date(Date.now() - 24 * 60 * 60 * 1000),
          amount: 12.00,
          txHash: '0xabc...def',
          type: RewardType.MISSION_COMPLETION
        },
        {
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          amount: 50.00,
          txHash: '0x123...789',
          type: RewardType.LEADERBOARD_PRIZE
        }
      ]
    };
    
    return mockHistory;
  }
  
  // POST /api/rewards/distribute - Distribuție automată (admin)
  static async distributeRewards(
    distributions: {
      wallet: string;
      amount: number;
      type: RewardType;
      source: string;
      description: string;
    }[]
  ): Promise<{
    success: boolean;
    processed: number;
    failed: number;
    results: any[];
  }> {
    const results = [];
    let processed = 0;
    let failed = 0;
    
    for (const dist of distributions) {
      try {
        const result = await USDTIntegration.distributeReward(
          dist.wallet,
          dist.amount,
          `batch_${Date.now()}_${Math.random()}`
        );
        
        if (result.success) {
          processed++;
        } else {
          failed++;
        }
        
        results.push({
          wallet: dist.wallet,
          amount: dist.amount,
          success: result.success,
          txHash: result.txHash,
          error: result.error
        });
        
      } catch (error) {
        failed++;
        results.push({
          wallet: dist.wallet,
          amount: dist.amount,
          success: false,
          error: 'Processing error'
        });
      }
    }
    
    return {
      success: failed === 0,
      processed,
      failed,
      results
    };
  }
}

// Export pentru utilizare în API routes
export default {
  RewardType,
  USDTIntegration,
  RewardCalculator,
  BeamAirdropSystem,
  RewardsAPI
};
