import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../../lib/mongodb';
import { Reward } from '../../../lib/models/Reward';
import { ObjectId } from 'mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDatabase();
  const rewardsCollection = db.collection<Reward>('rewards');

  try {
    switch (req.method) {
      case 'GET':
        const { walletAddress, status, type, limit = 50 } = req.query;
        
        const filter: any = {};
        if (walletAddress) filter.walletAddress = walletAddress;
        if (status) filter.status = status;
        if (type) filter.type = type;
        
        const rewards = await rewardsCollection
          .find(filter)
          .sort({ createdAt: -1 })
          .limit(parseInt(limit as string))
          .toArray();
        
        // Calculate summary stats
        const stats = await rewardsCollection.aggregate([
          { $match: filter },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
              totalAmount: { $sum: '$amount' }
            }
          }
        ]).toArray();
        
        res.status(200).json({ 
          rewards,
          stats: stats.reduce((acc, stat) => {
            acc[stat._id] = {
              count: stat.count,
              totalAmount: stat.totalAmount
            };
            return acc;
          }, {} as any)
        });
        break;

      case 'POST':
        // Create new reward
        const rewardData: Reward = {
          ...req.body,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const result = await rewardsCollection.insertOne(rewardData);
        res.status(201).json({ 
          message: 'Reward created successfully',
          reward: { ...rewardData, _id: result.insertedId }
        });
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Rewards API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}