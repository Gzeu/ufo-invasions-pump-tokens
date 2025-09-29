import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../lib/mongodb';

/**
 * Global Statistics API
 * Furnizează statistici globale pentru dashboard
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = await getDatabase();
    
    // Get all global stats
    const allStats = await db.collection('global_stats').find({}).toArray();
    const statsMap = allStats.reduce((acc, stat) => {
      acc[stat.type] = stat;
      return acc;
    }, {} as any);
    
    // Real-time calculations
    const [userCount, missionCount, rewardCount, activeUserCount] = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('missions').countDocuments({ isActive: true }),
      db.collection('rewards').countDocuments(),
      db.collection('users').countDocuments({
        lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      })
    ]);
    
    // Reward distribution stats
    const rewardStats = await db.collection('rewards').aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]).toArray();
    
    // Mission completion stats
    const missionStats = await db.collection('user_missions').aggregate([
      {
        $group: {
          _id: '$isCompleted',
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    
    const response = {
      overview: {
        totalUsers: userCount,
        activeUsers: activeUserCount,
        activeMissions: missionCount,
        totalRewards: rewardCount,
        lastUpdated: new Date().toISOString()
      },
      rewards: {
        byStatus: rewardStats.reduce((acc, stat) => {
          acc[stat._id] = {
            count: stat.count,
            totalAmount: stat.totalAmount
          };
          return acc;
        }, {} as any),
        ...statsMap.reward_stats
      },
      missions: {
        completionRate: missionStats.length > 0 ? 
          ((missionStats.find(s => s._id === true)?.count || 0) / 
           missionStats.reduce((sum, s) => sum + s.count, 0) * 100).toFixed(1) + '%' : '0%',
        ...statsMap.mission_stats
      },
      beamTechnology: statsMap.beam_stats || {
        totalBeams: 0,
        totalBeamAmount: 0,
        lastBeamTime: null
      },
      users: statsMap.user_stats || {
        totalUsers: userCount,
        activeUsers: activeUserCount
      }
    };
    
    res.status(200).json(response);

  } catch (error) {
    console.error('Stats API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}