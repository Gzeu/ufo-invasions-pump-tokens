// GPZ-84: Next.js API Routes for Missions System
// Integration cu core missions logic din src/api/missions.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { MissionsAPI, Mission, UserProgress, MissionType } from '../../api/missions';

// API Route Handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;
  
  try {
    switch (method) {
      case 'GET':
        return await handleGetMissions(req, res);
        
      case 'POST':
        return await handlePostMissions(req, res);
        
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({
          error: 'Method Not Allowed',
          message: `Method ${method} not allowed on /api/missions`
        });
    }
  } catch (error: any) {
    console.error('Missions API error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process missions request'
    });
  }
}

// GET Handler - Lista missions sau user-specific missions
async function handleGetMissions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { wallet, type, difficulty, active } = req.query;
  
  try {
    // User-specific missions
    if (wallet && typeof wallet === 'string') {
      const userMissions = await MissionsAPI.getUserMissions(wallet);
      
      return res.status(200).json({
        success: true,
        data: {
          wallet,
          available: userMissions.available,
          inProgress: userMissions.inProgress,
          completed: userMissions.completed,
          summary: {
            availableCount: userMissions.available.length,
            inProgressCount: userMissions.inProgress.length,
            completedCount: userMissions.completed.length,
            totalXpEarned: userMissions.completed.reduce((sum, mission) => {
              // Calculate XP pentru completed missions
              const missionTemplate = userMissions.available.find(m => m.id === mission.missionId);
              return sum + (missionTemplate?.xpReward || 0);
            }, 0)
          }
        },
        timestamp: new Date().toISOString()
      });
    }
    
    // General missions list cu filtering
    const allMissions = await MissionsAPI.getAllMissions();
    let filteredMissions = allMissions;
    
    // Filter by type
    if (type && Object.values(MissionType).includes(type as MissionType)) {
      filteredMissions = filteredMissions.filter(mission => mission.type === type);
    }
    
    // Filter by difficulty
    if (difficulty) {
      filteredMissions = filteredMissions.filter(mission => mission.difficulty === difficulty);
    }
    
    // Filter by active status
    if (active !== undefined) {
      const isActive = active === 'true';
      filteredMissions = filteredMissions.filter(mission => mission.isActive === isActive);
    }
    
    // Group missions by category
    const missionsByCategory = filteredMissions.reduce((groups, mission) => {
      const category = mission.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(mission);
      return groups;
    }, {} as { [key: string]: Mission[] });
    
    return res.status(200).json({
      success: true,
      data: {
        missions: filteredMissions,
        categories: missionsByCategory,
        summary: {
          total: filteredMissions.length,
          byDifficulty: {
            easy: filteredMissions.filter(m => m.difficulty === 'easy').length,
            medium: filteredMissions.filter(m => m.difficulty === 'medium').length,
            hard: filteredMissions.filter(m => m.difficulty === 'hard').length,
            legendary: filteredMissions.filter(m => m.difficulty === 'legendary').length
          },
          byType: {
            [MissionType.PUMP_HUNTER]: filteredMissions.filter(m => m.type === MissionType.PUMP_HUNTER).length,
            [MissionType.SOCIAL_SCOUT]: filteredMissions.filter(m => m.type === MissionType.SOCIAL_SCOUT).length,
            [MissionType.DIAMOND_HANDS]: filteredMissions.filter(m => m.type === MissionType.DIAMOND_HANDS).length,
            [MissionType.COMMUNITY_BUILDER]: filteredMissions.filter(m => m.type === MissionType.COMMUNITY_BUILDER).length,
            [MissionType.DEGEN_EXPLORER]: filteredMissions.filter(m => m.type === MissionType.DEGEN_EXPLORER).length
          }
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Get missions error:', error);
    return res.status(500).json({
      error: 'Failed to fetch missions',
      message: error.message
    });
  }
}

// POST Handler - Mission completion sau validation
async function handlePostMissions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { action } = req.query;
  const body = req.body;
  
  try {
    switch (action) {
      case 'complete':
        return await handleCompleteMission(req, res, body);
        
      case 'validate':
        return await handleValidateProgress(req, res, body);
        
      case 'start':
        return await handleStartMission(req, res, body);
        
      default:
        return res.status(400).json({
          error: 'Invalid Action',
          message: 'Action must be: complete, validate, or start'
        });
    }
  } catch (error: any) {
    console.error('POST missions error:', error);
    return res.status(500).json({
      error: 'Failed to process mission action',
      message: error.message
    });
  }
}

// Complete Mission Handler
async function handleCompleteMission(
  req: NextApiRequest,
  res: NextApiResponse,
  body: {
    wallet: string;
    missionId: string;
    evidence?: {
      txHash?: string;
      socialLinks?: string[];
      proofData?: any;
    };
  }
) {
  const { wallet, missionId, evidence } = body;
  
  // Validation
  if (!wallet || !missionId) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'wallet and missionId are required'
    });
  }
  
  // Validate wallet address format
  if (!ethers.isAddress(wallet)) {
    return res.status(400).json({
      error: 'Invalid wallet address',
      message: 'wallet must be a valid Ethereum address'
    });
  }
  
  try {
    const result = await MissionsAPI.completeMission(wallet, missionId, evidence);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        message: 'Mission completion validation failed'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        missionId,
        wallet,
        xpEarned: result.xpEarned,
        newLevel: result.newLevel,
        completedAt: new Date().toISOString(),
        message: `Mission completed successfully! Earned ${result.xpEarned} XP.`
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Mission completion failed',
      message: error.message
    });
  }
}

// Validate Progress Handler
async function handleValidateProgress(
  req: NextApiRequest,
  res: NextApiResponse,
  body: {
    wallet: string;
    missionId: string;
  }
) {
  const { wallet, missionId } = body;
  
  if (!wallet || !missionId) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'wallet and missionId are required'
    });
  }
  
  try {
    const validation = await MissionsAPI.validateProgress(wallet, missionId);
    
    return res.status(200).json({
      success: true,
      data: {
        missionId,
        wallet,
        progress: validation.progress,
        isComplete: validation.isComplete,
        nextStep: validation.nextStep,
        validatedAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Progress validation failed',
      message: error.message
    });
  }
}

// Start Mission Handler
async function handleStartMission(
  req: NextApiRequest,
  res: NextApiResponse,
  body: {
    wallet: string;
    missionId: string;
  }
) {
  const { wallet, missionId } = body;
  
  if (!wallet || !missionId) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'wallet and missionId are required'
    });
  }
  
  try {
    // Mock mission start
    const startedMission: UserProgress = {
      wallet,
      missionId,
      progress: 0,
      startedAt: new Date(),
      validated: false
    };
    
    return res.status(200).json({
      success: true,
      data: {
        mission: startedMission,
        message: 'Mission started successfully!',
        startedAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to start mission',
      message: error.message
    });
  }
}

// Export pentru testing
export {
  handleGetMissions,
  handlePostMissions,
  handleCompleteMission,
  handleValidateProgress,
  handleStartMission
};
