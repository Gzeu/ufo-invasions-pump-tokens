import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../lib/mongodb';
import { UserLeaderboard } from '../../lib/models/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { period = 'all-time', limit = 100, category = 'overall' } = req.query;
    const db = await getDatabase();
    const usersCollection = db.collection('users');

    let dateFilter = {};
    const now = new Date();
    
    // Apply time filter based on period
    switch (period) {
      case 'daily':
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        dateFilter = { lastActive: { $gte: startOfDay } };
        break;
      case 'weekly':
        const startOfWeek = new Date(now.setDate(now.getDate() - 7));
        dateFilter = { lastActive: { $gte: startOfWeek } };
        break;
      case 'monthly':
        const startOfMonth = new Date(now.setMonth(now.getMonth() - 1));
        dateFilter = { lastActive: { $gte: startOfMonth } };
        break;
    }

    // Build aggregation pipeline based on category
    let sortField = 'totalPoints';
    let additionalFields = {};
    
    switch (category) {
      case 'games':
        sortField = 'gamesWon';
        additionalFields = {
          gamesWon: 1,
          totalGames: 1,
          winRate: 1,
          highestScore: 1
        };
        break;
      case 'trading':
        sortField = 'tradingVolume';
        additionalFields = {
          tradingVolume: 1,
          totalTrades: 1
        };
        break;
      case 'referrals':
        sortField = 'referralEarnings';
        additionalFields = {
          referralEarnings: 1
        };
        break;
      case 'rewards':
        sortField = 'rewardsEarned';
        additionalFields = {
          rewardsEarned: 1
        };
        break;
    }

    const pipeline = [
      { $match: dateFilter },
      {
        $addFields: {
          username: {
            $concat: [
              { $substr: ['$walletAddress', 0, 6] },
              '...',
              { $substr: ['$walletAddress', -4, 4] }
            ]
          },
          nftsCount: { $size: { $ifNull: ['$nftsOwned', []] } },
          missionsCount: { $size: { $ifNull: ['$missionsCompleted', []] } }
        }
      },
      {
        $project: {
          walletAddress: 1,
          username: 1,
          totalPoints: 1,
          badges: 1,
          rewardsEarned: 1,
          nftsCount: 1,
          missionsCount: 1,
          lastActive: 1,
          ...additionalFields
        }
      },
      { $sort: { [sortField]: -1, totalPoints: -1, lastActive: -1 } },
      { $limit: parseInt(limit as string) }
    ];

    const leaderboardData = await usersCollection.aggregate(pipeline).toArray();
    
    // Add ranks
    const leaderboard: (UserLeaderboard & any)[] = leaderboardData.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    // Get additional stats
    const totalParticipants = await usersCollection.countDocuments(dateFilter);
    const statsResult = await usersCollection.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          averagePoints: { $avg: '$totalPoints' },
          totalRewards: { $sum: '$rewardsEarned' },
          totalGames: { $sum: '$totalGames' },
          totalTrades: { $sum: '$totalTrades' }
        }
      }
    ]).toArray();
    
    const stats = statsResult[0] || {
      averagePoints: 0,
      totalRewards: 0,
      totalGames: 0,
      totalTrades: 0
    };

    res.status(200).json({
      period,
      category,
      leaderboard,
      totalParticipants,
      stats: {
        averagePoints: Math.round(stats.averagePoints),
        totalRewards: stats.totalRewards,
        totalGames: stats.totalGames,
        totalTrades: stats.totalTrades
      },
      lastUpdated: new Date()
    });

  } catch (error) {
    console.error('Leaderboard API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}