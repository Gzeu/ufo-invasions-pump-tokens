// GPZ-82: Core Missions API Implementation
// Direct development approach - no connection setup needed

import { NextApiRequest, NextApiResponse } from 'next';

// Mission Types Definition
export enum MissionType {
  PUMP_HUNTER = 'pump_hunter',
  SOCIAL_SCOUT = 'social_scout', 
  DIAMOND_HANDS = 'diamond_hands',
  COMMUNITY_BUILDER = 'community_builder',
  DEGEN_EXPLORER = 'degen_explorer'
}

// Mission Interface
export interface Mission {
  id: string;
  type: MissionType;
  title: string;
  description: string;
  xpReward: number;
  requirements: {
    volumeThreshold?: number;
    timeframe?: number;
    socialShares?: number;
    holdingPeriod?: number;
    referrals?: number;
  };
  isActive: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  icon: string;
  category: string;
}

// User Progress Interface
export interface UserProgress {
  wallet: string;
  missionId: string;
  progress: number; // 0-100%
  startedAt: Date;
  completedAt?: Date;
  txHash?: string;
  validated: boolean;
}

// Pump Detection Algorithm
export class PumpDetector {
  private static readonly PANCAKESWAP_API = {
    graphQL: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange',
    priceAPI: 'https://api.pancakeswap.info/api/v2/tokens',
    routerContract: '0x10ED43C718714eb63d5aA57B78B54704E256024E'
  };

  static async detectVolumeSpike(tokenAddress: string): Promise<{
    isPump: boolean;
    volumeIncrease: number;
    priceChange: number;
    liquidityRatio: number;
  }> {
    try {
      // Simulare pump detection pentru development
      // In production: integrate cu PancakeSwap GraphQL
      const mockData = {
        isPump: Math.random() > 0.7, // 30% chance pump detected
        volumeIncrease: Math.random() * 1000 + 100, // 100-1100%
        priceChange: Math.random() * 200 - 50, // -50% to +150%
        liquidityRatio: Math.random() * 20 + 5 // 5-25%
      };
      
      return mockData;
    } catch (error) {
      console.error('Pump detection error:', error);
      return {
        isPump: false,
        volumeIncrease: 0,
        priceChange: 0,
        liquidityRatio: 0
      };
    }
  }

  static async validateUserParticipation(
    wallet: string, 
    txHash: string,
    tokenAddress: string
  ): Promise<{
    participated: boolean;
    amount: number;
    timing: number; // Score based on timing
    eligibleForReward: boolean;
  }> {
    // Simulare pentru development
    // In production: verify transaction on BSC
    return {
      participated: Math.random() > 0.3,
      amount: Math.random() * 1000,
      timing: Math.random() * 100,
      eligibleForReward: Math.random() > 0.5
    };
  }
}

// Mission Templates
export const MISSION_TEMPLATES: Mission[] = [
  {
    id: 'pump_hunter_001',
    type: MissionType.PUMP_HUNTER,
    title: '🚀 UFO Pump Hunter',
    description: 'Detect and participate in a pump event with >500% volume spike',
    xpReward: 150,
    requirements: {
      volumeThreshold: 500,
      timeframe: 60 // minutes
    },
    isActive: true,
    difficulty: 'medium',
    icon: '🛸',
    category: 'Trading'
  },
  {
    id: 'social_scout_001',
    type: MissionType.SOCIAL_SCOUT,
    title: '📱 Cosmic Social Scout',
    description: 'Share UFO content and get 100+ engagements',
    xpReward: 75,
    requirements: {
      socialShares: 5,
      timeframe: 1440 // 24 hours
    },
    isActive: true,
    difficulty: 'easy',
    icon: '👽',
    category: 'Social'
  },
  {
    id: 'diamond_hands_001',
    type: MissionType.DIAMOND_HANDS,
    title: '💎 Diamond Hands Commander',
    description: 'Hold UFO tokens for 30 days without selling',
    xpReward: 300,
    requirements: {
      holdingPeriod: 30 * 24 * 60 // 30 days in minutes
    },
    isActive: true,
    difficulty: 'hard',
    icon: '💎',
    category: 'Hodling'
  },
  {
    id: 'community_builder_001',
    type: MissionType.COMMUNITY_BUILDER,
    title: '🌟 Alien Ambassador',
    description: 'Invite 5 friends to join the UFO invasion',
    xpReward: 200,
    requirements: {
      referrals: 5
    },
    isActive: true,
    difficulty: 'medium',
    icon: '🛸',
    category: 'Community'
  }
];

// XP Calculation System
export class XPCalculator {
  static calculateMissionXP(
    baseMission: Mission,
    performance: {
      completionTime?: number;
      accuracy?: number;
      bonus?: number;
    }
  ): number {
    let xp = baseMission.xpReward;
    
    // Time bonus (faster completion = more XP)
    if (performance.completionTime) {
      const timeBonus = Math.max(0, (100 - performance.completionTime) / 100);
      xp += Math.floor(xp * timeBonus * 0.2);
    }
    
    // Accuracy bonus
    if (performance.accuracy) {
      const accuracyBonus = performance.accuracy / 100;
      xp += Math.floor(xp * accuracyBonus * 0.15);
    }
    
    // Special bonuses
    if (performance.bonus) {
      xp += performance.bonus;
    }
    
    return Math.floor(xp);
  }
  
  static calculateLevel(totalXP: number): {
    level: number;
    currentLevelXP: number;
    nextLevelXP: number;
    progress: number;
  } {
    // Progressive XP requirements: level^2 * 100
    let level = 1;
    let totalRequired = 0;
    
    while (totalXP >= totalRequired + (level * level * 100)) {
      totalRequired += level * level * 100;
      level++;
    }
    
    const currentLevelXP = totalXP - totalRequired;
    const nextLevelXP = level * level * 100;
    const progress = (currentLevelXP / nextLevelXP) * 100;
    
    return {
      level,
      currentLevelXP,
      nextLevelXP,
      progress: Math.min(100, Math.max(0, progress))
    };
  }
}

// API Handlers
export class MissionsAPI {
  // GET /api/missions - Lista toate misiunile
  static async getAllMissions(): Promise<Mission[]> {
    // In production: fetch from database
    return MISSION_TEMPLATES.filter(mission => mission.isActive);
  }
  
  // GET /api/missions/user/:wallet - Misiuni pentru user specific
  static async getUserMissions(wallet: string): Promise<{
    available: Mission[];
    inProgress: UserProgress[];
    completed: UserProgress[];
  }> {
    // Mock data pentru development
    const available = MISSION_TEMPLATES.filter(m => m.isActive);
    const inProgress: UserProgress[] = [
      {
        wallet,
        missionId: 'pump_hunter_001',
        progress: 65,
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
        validated: false
      }
    ];
    const completed: UserProgress[] = [
      {
        wallet,
        missionId: 'social_scout_001',
        progress: 100,
        startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        txHash: '0x1234...abcd',
        validated: true
      }
    ];
    
    return { available, inProgress, completed };
  }
  
  // POST /api/missions/complete - Completare misiune
  static async completeMission(
    wallet: string,
    missionId: string,
    evidence?: {
      txHash?: string;
      socialLinks?: string[];
      proofData?: any;
    }
  ): Promise<{
    success: boolean;
    xpEarned?: number;
    newLevel?: number;
    error?: string;
  }> {
    try {
      const mission = MISSION_TEMPLATES.find(m => m.id === missionId);
      if (!mission) {
        return { success: false, error: 'Mission not found' };
      }
      
      // Validate mission completion
      let isValid = false;
      
      switch (mission.type) {
        case MissionType.PUMP_HUNTER:
          if (evidence?.txHash) {
            const validation = await PumpDetector.validateUserParticipation(
              wallet, 
              evidence.txHash, 
              '0x...' // token address
            );
            isValid = validation.eligibleForReward;
          }
          break;
          
        case MissionType.SOCIAL_SCOUT:
          isValid = evidence?.socialLinks && evidence.socialLinks.length >= (mission.requirements.socialShares || 1);
          break;
          
        default:
          isValid = true; // Mock validation
      }
      
      if (!isValid) {
        return { success: false, error: 'Mission requirements not met' };
      }
      
      // Calculate XP earned
      const xpEarned = XPCalculator.calculateMissionXP(mission, {
        completionTime: Math.random() * 100,
        accuracy: 85 + Math.random() * 15
      });
      
      // Mock current user XP and calculate new level
      const currentXP = Math.floor(Math.random() * 1000) + 500;
      const newTotalXP = currentXP + xpEarned;
      const levelData = XPCalculator.calculateLevel(newTotalXP);
      
      return {
        success: true,
        xpEarned,
        newLevel: levelData.level
      };
      
    } catch (error) {
      console.error('Mission completion error:', error);
      return { success: false, error: 'Internal server error' };
    }
  }
  
  // POST /api/missions/validate - Validare progres misiune
  static async validateProgress(
    wallet: string,
    missionId: string
  ): Promise<{
    progress: number;
    isComplete: boolean;
    nextStep?: string;
  }> {
    // Mock validation pentru development
    const progress = Math.floor(Math.random() * 100);
    
    return {
      progress,
      isComplete: progress >= 100,
      nextStep: progress < 100 ? 'Continue with the mission requirements' : undefined
    };
  }
}

// Export pentru utilizare în API routes
export default {
  MissionType,
  PumpDetector,
  XPCalculator,
  MissionsAPI,
  MISSION_TEMPLATES
};
