import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../../lib/mongodb';
import { Mission } from '../../../lib/models/Mission';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDatabase();
  const missionsCollection = db.collection<Mission>('missions');

  try {
    switch (req.method) {
      case 'GET':
        const { category, difficulty, active, userId } = req.query;
        
        const filter: any = {};
        if (category) filter.category = category;
        if (difficulty) filter.difficulty = difficulty;
        if (active !== undefined) filter.isActive = active === 'true';
        
        const missions = await missionsCollection
          .find(filter)
          .sort({ createdAt: -1 })
          .toArray();
        
        // If userId provided, get user's progress for each mission
        if (userId) {
          const userMissionsCollection = db.collection('user_missions');
          const userMissions = await userMissionsCollection
            .find({ userId: userId })
            .toArray();
          
          const missionsWithProgress = missions.map(mission => {
            const userMission = userMissions.find(
              um => um.missionId.toString() === mission._id?.toString()
            );
            return {
              ...mission,
              userProgress: userMission ? {
                progress: userMission.progress,
                isCompleted: userMission.isCompleted,
                rewardClaimed: userMission.rewardClaimed
              } : null
            };
          });
          
          return res.status(200).json({ missions: missionsWithProgress });
        }
        
        res.status(200).json({ missions });
        break;

      case 'POST':
        // Admin only - create new mission
        const missionData: Mission = {
          ...req.body,
          participants: 0,
          completions: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const result = await missionsCollection.insertOne(missionData);
        res.status(201).json({ 
          message: 'Mission created successfully',
          mission: { ...missionData, _id: result.insertedId }
        });
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Missions API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}