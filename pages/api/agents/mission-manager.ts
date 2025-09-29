import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../../lib/mongodb';
import { UserMission, Mission } from '../../../lib/models/Mission';
import { ObjectId } from 'mongodb';

/**
 * Mission Management Agent
 * Verifică progresul misiunilor și generează recompense
 * Serverless function optimizată pentru Vercel free tier
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
    const userMissionsCollection = db.collection<UserMission>('user_missions');
    const missionsCollection = db.collection<Mission>('missions');
    const usersCollection = db.collection('users');
    const rewardsCollection = db.collection('rewards');

    // Find active user missions that need processing
    const activeMissions = await userMissionsCollection.aggregate([
      {
        $match: {
          isCompleted: false,
          lastUpdated: { $lt: new Date(Date.now() - 5 * 60 * 1000) } // Updated more than 5min ago
        }
      },
      { $limit: 30 }, // Process max 30 for performance
      {
        $lookup: {
          from: 'missions',
          localField: 'missionId',
          foreignField: '_id',
          as: 'mission'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$mission' },
      { $unwind: '$user' }
    ]).toArray();

    if (activeMissions.length === 0) {
      return res.status(200).json({ 
        message: 'No active missions to process',
        processed: 0,
        executionTime: Date.now() - startTime
      });
    }

    const processedMissions = [];
    const completedMissions = [];
    
    for (const item of activeMissions) {
      try {
        const userMission = item as any;
        const mission = userMission.mission;
        const user = userMission.user;

        let newProgress = userMission.progress;
        let isCompleted = false;

        // Calculate progress based on mission type
        switch (mission.requirements.type) {
          case 'play_games':
            newProgress = Math.min((user.totalGames / mission.requirements.target) * 100, 100);
            isCompleted = user.totalGames >= mission.requirements.target;
            break;
            
          case 'win_games':
            newProgress = Math.min((user.gamesWon / mission.requirements.target) * 100, 100);
            isCompleted = user.gamesWon >= mission.requirements.target;
            break;
            
          case 'hold_tokens':
            // Simulate token holding check (in production, check blockchain)
            const holdDuration = Math.floor(
              (Date.now() - userMission.startedAt.getTime()) / (1000 * 60 * 60)
            );
            newProgress = Math.min((holdDuration / mission.requirements.timeLimit!) * 100, 100);
            isCompleted = holdDuration >= mission.requirements.timeLimit!;
            break;
            
          case 'social_share':
            // Check if user has social media connected
            if (user.twitterHandle || user.discordId) {
              newProgress = 100;
              isCompleted = true;
            }
            break;
            
          case 'referral':
            const referralCount = Math.floor(user.referralEarnings / 10);
            newProgress = Math.min((referralCount / mission.requirements.target) * 100, 100);
            isCompleted = referralCount >= mission.requirements.target;
            break;
            
          case 'trade_volume':
            newProgress = Math.min((user.tradingVolume / mission.requirements.target) * 100, 100);
            isCompleted = user.tradingVolume >= mission.requirements.target;
            break;
        }

        // Update mission progress
        const updateData: any = {
          progress: Math.round(newProgress),
          lastUpdated: new Date()
        };

        if (isCompleted && !userMission.isCompleted) {
          updateData.isCompleted = true;
          updateData.completedAt = new Date();

          // Create mission reward
          const rewardAmount = mission.reward.amount;
          await rewardsCollection.insertOne({
            userId: userMission.userId,
            walletAddress: user.walletAddress,
            type: 'mission',
            rewardType: mission.reward.type,
            amount: rewardAmount,
            description: `Mission completed: ${mission.title}`,
            status: 'pending',
            metadata: {
              missionId: mission._id
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          });

          // Update mission completion stats
          await missionsCollection.updateOne(
            { _id: mission._id },
            { $inc: { completions: 1 } }
          );

          // Award badge if specified
          if (mission.reward.badge) {
            await usersCollection.updateOne(
              { _id: userMission.userId },
              { 
                $addToSet: { badges: mission.reward.badge },
                $set: { updatedAt: new Date() }
              }
            );
          }

          completedMissions.push({
            missionId: mission._id,
            userId: userMission.userId,
            title: mission.title,
            reward: mission.reward,
            walletAddress: user.walletAddress
          });
        }

        await userMissionsCollection.updateOne(
          { _id: userMission._id },
          { $set: updateData }
        );

        processedMissions.push({
          missionId: mission._id,
          userId: userMission.userId,
          oldProgress: userMission.progress,
          newProgress: Math.round(newProgress),
          completed: isCompleted
        });

      } catch (error) {
        console.error(`Failed to process mission ${userMission._id}:`, error);
      }
    }

    const executionTime = Date.now() - startTime;
    console.log(`Mission Agent: Processed ${processedMissions.length} missions, completed ${completedMissions.length} in ${executionTime}ms`);

    res.status(200).json({
      message: 'Mission processing completed',
      processed: processedMissions.length,
      completed: completedMissions.length,
      completedMissions,
      executionTime,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Mission agent error:', error);
    res.status(500).json({ 
      error: 'Mission agent execution failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      executionTime: Date.now() - startTime
    });
  }
}