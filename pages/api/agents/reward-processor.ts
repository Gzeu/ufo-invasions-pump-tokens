import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../../lib/mongodb';
import { Reward } from '../../../lib/models/Reward';
import { ObjectId } from 'mongodb';

/**
 * Reward Processing Agent
 * Procesează recompensele pending și le distribue automat
 * Optimizat pentru Vercel serverless cu timeout de 30s
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  const maxExecutionTime = 25000; // 25s safety margin pentru Vercel
  
  try {
    const db = await getDatabase();
    const rewardsCollection = db.collection<Reward>('rewards');
    const usersCollection = db.collection('users');

    // Find pending rewards (prioritize by creation date)
    const pendingRewards = await rewardsCollection
      .find({ 
        status: 'pending',
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: { $gt: new Date() } }
        ]
      })
      .sort({ createdAt: 1 })
      .limit(25) // Process max 25 rewards per execution
      .toArray();

    if (pendingRewards.length === 0) {
      return res.status(200).json({ 
        message: 'No pending rewards to process',
        processed: 0,
        executionTime: Date.now() - startTime
      });
    }

    const processedRewards = [];
    const failedRewards = [];
    
    for (const reward of pendingRewards) {
      // Check execution time limit
      if (Date.now() - startTime > maxExecutionTime) {
        console.log('Execution time limit reached, stopping processing');
        break;
      }
      
      try {
        // Update status to processing
        await rewardsCollection.updateOne(
          { _id: reward._id },
          { 
            $set: { 
              status: 'processing',
              updatedAt: new Date()
            }
          }
        );

        // Simulate blockchain transaction based on reward type
        let txHash: string;
        let blockNumber: number;
        
        switch (reward.rewardType) {
          case 'USDT':
            // Simulate USDT transfer
            txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
            blockNumber = Math.floor(Math.random() * 1000) + 20000000;
            break;
            
          case 'UFO':
            // Simulate UFO token transfer
            txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
            blockNumber = Math.floor(Math.random() * 1000) + 20000000;
            break;
            
          case 'NFT':
            // Simulate NFT mint/transfer
            txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
            blockNumber = Math.floor(Math.random() * 1000) + 20000000;
            
            // Add NFT to user's collection
            if (reward.metadata?.nftTokenId) {
              await usersCollection.updateOne(
                { _id: reward.userId },
                { $addToSet: { nftsOwned: reward.metadata.nftTokenId } }
              );
            }
            break;
            
          case 'BADGE':
            // Award badge directly
            if (reward.metadata?.badge) {
              await usersCollection.updateOne(
                { _id: reward.userId },
                { $addToSet: { badges: reward.metadata.badge } }
              );
            }
            txHash = 'badge_awarded';
            blockNumber = 0;
            break;
            
          default:
            throw new Error(`Unknown reward type: ${reward.rewardType}`);
        }

        // Mark reward as completed
        await rewardsCollection.updateOne(
          { _id: reward._id },
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

        // Update user statistics
        if (reward.rewardType !== 'BADGE') {
          await usersCollection.updateOne(
            { _id: reward.userId },
            {
              $inc: { 
                rewardsEarned: reward.amount,
                totalPoints: Math.floor(reward.amount * (reward.rewardType === 'USDT' ? 10 : 1))
              },
              $set: { 
                updatedAt: new Date(),
                lastActive: new Date()
              }
            }
          );
        }

        processedRewards.push({
          id: reward._id,
          walletAddress: reward.walletAddress,
          type: reward.rewardType,
          amount: reward.amount,
          txHash,
          blockNumber
        });

        // Small delay to prevent overwhelming the DB
        await new Promise(resolve => setTimeout(resolve, 50));

      } catch (error) {
        console.error(`Failed to process reward ${reward._id}:`, error);
        
        // Mark as failed
        await rewardsCollection.updateOne(
          { _id: reward._id },
          {
            $set: {
              status: 'failed',
              error: error instanceof Error ? error.message : 'Processing failed',
              updatedAt: new Date()
            }
          }
        );
        
        failedRewards.push({
          id: reward._id,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const executionTime = Date.now() - startTime;
    console.log(`Reward Agent: Processed ${processedRewards.length}/${pendingRewards.length} rewards in ${executionTime}ms`);

    res.status(200).json({
      message: 'Reward processing completed',
      processed: processedRewards.length,
      failed: failedRewards.length,
      total: pendingRewards.length,
      processedRewards,
      failedRewards,
      executionTime,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Reward processor agent error:', error);
    res.status(500).json({ 
      error: 'Reward processor execution failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      executionTime: Date.now() - startTime
    });
  }
}