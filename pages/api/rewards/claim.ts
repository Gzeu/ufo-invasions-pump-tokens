import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { rewardId, walletAddress } = req.body;

    if (!rewardId || !walletAddress) {
      return res.status(400).json({ error: 'Reward ID and wallet address required' });
    }

    const db = await getDatabase();
    const rewardsCollection = db.collection('rewards');
    const usersCollection = db.collection('users');

    // Find the reward
    const reward = await rewardsCollection.findOne({
      _id: new ObjectId(rewardId),
      walletAddress,
      status: 'pending'
    });

    if (!reward) {
      return res.status(404).json({ error: 'Reward not found or already processed' });
    }

    // Check if reward is expired
    if (reward.expiresAt && new Date() > reward.expiresAt) {
      await rewardsCollection.updateOne(
        { _id: new ObjectId(rewardId) },
        { 
          $set: { 
            status: 'expired',
            updatedAt: new Date()
          }
        }
      );
      return res.status(400).json({ error: 'Reward has expired' });
    }

    // Update reward status to processing
    await rewardsCollection.updateOne(
      { _id: new ObjectId(rewardId) },
      { 
        $set: { 
          status: 'processing',
          updatedAt: new Date()
        }
      }
    );

    try {
      // Simulate blockchain transaction
      // In production, this would interact with smart contracts
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      const blockNumber = Math.floor(Math.random() * 1000000) + 20000000;
      
      // Mark as completed
      await rewardsCollection.updateOne(
        { _id: new ObjectId(rewardId) },
        {
          $set: {
            status: 'completed',
            txHash,
            blockNumber,
            processedAt: new Date(),
            updatedAt: new Date()
          }
        }
      );

      // Update user stats
      await usersCollection.updateOne(
        { walletAddress },
        {
          $inc: { 
            rewardsEarned: reward.amount,
            totalPoints: Math.floor(reward.amount * 10) // 10 points per dollar
          },
          $set: { updatedAt: new Date() }
        }
      );

      // If mission reward, mark as claimed
      if (reward.type === 'mission' && reward.metadata?.missionId) {
        await db.collection('user_missions').updateOne(
          {
            userId: reward.userId,
            missionId: reward.metadata.missionId
          },
          {
            $set: {
              rewardClaimed: true,
              claimedAt: new Date()
            }
          }
        );
      }

      res.status(200).json({
        message: 'Reward claimed successfully!',
        txHash,
        blockNumber,
        amount: reward.amount,
        type: reward.rewardType
      });

    } catch (processError) {
      console.error('Processing error:', processError);
      
      // Mark as failed
      await rewardsCollection.updateOne(
        { _id: new ObjectId(rewardId) },
        {
          $set: {
            status: 'failed',
            error: processError instanceof Error ? processError.message : 'Processing failed',
            updatedAt: new Date()
          }
        }
      );

      res.status(500).json({ error: 'Failed to process reward claim' });
    }

  } catch (error) {
    console.error('Claim error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}