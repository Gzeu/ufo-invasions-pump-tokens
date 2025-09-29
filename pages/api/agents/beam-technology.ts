import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../../lib/mongodb';
import { Reward } from '../../../lib/models/Reward';
import { ObjectId } from 'mongodb';

/**
 * UFO Beam Technology Agent
 * Generează recompense random pentru utilizatori activi
 * Implementează algoritmul de fairness pentru airdrop-uri
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  
  try {
    const db = await getDatabase();
    const usersCollection = db.collection('users');
    const rewardsCollection = db.collection('rewards');
    const statsCollection = db.collection('global_stats');

    // Check beam frequency control (max 1 per hour)
    const lastBeamCheck = await statsCollection.findOne({ type: 'last_beam' });
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    if (lastBeamCheck && lastBeamCheck.timestamp > oneHourAgo) {
      const nextBeamTime = new Date(lastBeamCheck.timestamp.getTime() + 60 * 60 * 1000);
      return res.status(429).json({ 
        message: 'Beam technology is recharging',
        nextBeamTime,
        waitMinutes: Math.ceil((nextBeamTime.getTime() - Date.now()) / (1000 * 60))
      });
    }

    // Find eligible users (active in last 24h, min 100 points)
    const eligibilityThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const eligibleUsers = await usersCollection.find({
      lastActive: { $gte: eligibilityThreshold },
      totalPoints: { $gte: 100 },
      // Exclude users who received beam in last 6 hours
      walletAddress: {
        $nin: await rewardsCollection.distinct('walletAddress', {
          type: 'airdrop',
          status: { $in: ['pending', 'completed'] },
          createdAt: { $gte: new Date(Date.now() - 6 * 60 * 60 * 1000) }
        })
      }
    }).toArray();

    if (eligibleUsers.length === 0) {
      return res.status(200).json({ 
        message: 'No eligible users for beam technology',
        beamed: 0,
        executionTime: Date.now() - startTime
      });
    }

    // Beam algorithm: select 8-20% of eligible users
    const beamPercentage = Math.random() * 0.12 + 0.08; // 8-20%
    const selectedCount = Math.max(1, Math.min(10, Math.floor(eligibleUsers.length * beamPercentage)));
    
    // Weighted selection based on activity and engagement
    const weightedUsers = eligibleUsers.map(user => {
      const activityScore = user.totalPoints / 100;
      const gameScore = (user.gamesWon / Math.max(user.totalGames, 1)) * 50;
      const socialScore = (user.twitterHandle ? 25 : 0) + (user.discordId ? 25 : 0);
      const recentActivityScore = user.lastActive > new Date(Date.now() - 2 * 60 * 60 * 1000) ? 30 : 0;
      
      return {
        ...user,
        weight: activityScore + gameScore + socialScore + recentActivityScore + Math.random() * 20
      };
    });

    // Select users with highest weights
    const selectedUsers = weightedUsers
      .sort((a, b) => b.weight - a.weight)
      .slice(0, selectedCount);

    const beamedRewards = [];
    const rewardTypes = [
      { type: 'USDT', baseAmount: 2, variance: 8 }, // $2-10
      { type: 'UFO', baseAmount: 100, variance: 400 }, // 100-500 tokens
    ];

    for (const user of selectedUsers) {
      // Random reward type selection
      const rewardConfig = rewardTypes[Math.floor(Math.random() * rewardTypes.length)];
      const amount = rewardConfig.baseAmount + Math.floor(Math.random() * rewardConfig.variance);
      
      // Bonus based on user activity
      const activityBonus = Math.floor(user.totalPoints / 1000) * (rewardConfig.type === 'USDT' ? 1 : 50);
      const finalAmount = amount + activityBonus;

      const beamReward: Reward = {
        userId: user._id!,
        walletAddress: user.walletAddress,
        type: 'airdrop',
        rewardType: rewardConfig.type as 'USDT' | 'UFO',
        amount: finalAmount,
        description: '🛸 UFO Beam Technology - You\'ve been randomly selected!',
        status: 'pending',
        scheduledFor: new Date(Date.now() + Math.random() * 2 * 60 * 60 * 1000), // Random in next 2h
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000) // 48h to claim
      };

      const result = await rewardsCollection.insertOne(beamReward);
      
      beamedRewards.push({
        id: result.insertedId,
        walletAddress: user.walletAddress,
        type: rewardConfig.type,
        amount: finalAmount,
        scheduledFor: beamReward.scheduledFor,
        weight: Math.round(user.weight)
      });
    }

    // Update beam statistics
    await statsCollection.updateOne(
      { type: 'beam_stats' },
      {
        $inc: { 
          totalBeams: beamedRewards.length,
          totalBeamAmount: beamedRewards.reduce((sum, r) => sum + r.amount, 0),
          [`totalBeam${beamedRewards[0]?.type || 'USDT'}`]: beamedRewards
            .filter(r => r.type === beamedRewards[0]?.type)
            .reduce((sum, r) => sum + r.amount, 0)
        },
        $set: { 
          lastBeamTime: new Date(),
          lastUpdated: new Date()
        }
      },
      { upsert: true }
    );

    // Update global beam timestamp
    await statsCollection.updateOne(
      { type: 'last_beam' },
      { $set: { timestamp: new Date() } },
      { upsert: true }
    );

    const executionTime = Date.now() - startTime;
    console.log(`Beam Agent: Generated ${beamedRewards.length} beam rewards for ${eligibleUsers.length} eligible users in ${executionTime}ms`);

    res.status(200).json({
      message: '🛸 UFO Beam Technology activated!',
      eligibleUsers: eligibleUsers.length,
      beamed: beamedRewards.length,
      totalAmount: beamedRewards.reduce((sum, r) => sum + r.amount, 0),
      rewards: beamedRewards,
      executionTime,
      nextBeamEligible: new Date(Date.now() + 60 * 60 * 1000),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Beam technology agent error:', error);
    res.status(500).json({ 
      error: 'Beam technology execution failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      executionTime: Date.now() - startTime
    });
  }
}