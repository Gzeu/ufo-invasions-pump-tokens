import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../../lib/mongodb';
import { UserMission } from '../../../lib/models/Mission';
import { ObjectId } from 'mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, missionId } = req.body;

    if (!userId || !missionId) {
      return res.status(400).json({ error: 'User ID and Mission ID required' });
    }

    const db = await getDatabase();
    const userMissionsCollection = db.collection<UserMission>('user_missions');
    const missionsCollection = db.collection('missions');

    // Check if mission exists and is active
    const mission = await missionsCollection.findOne({ 
      _id: new ObjectId(missionId),
      isActive: true 
    });
    
    if (!mission) {
      return res.status(404).json({ error: 'Mission not found or inactive' });
    }

    // Check if user already participating
    const existingParticipation = await userMissionsCollection.findOne({
      userId: new ObjectId(userId),
      missionId: new ObjectId(missionId)
    });

    if (existingParticipation) {
      return res.status(200).json({ 
        message: 'Already participating', 
        participation: existingParticipation 
      });
    }

    // Create participation record
    const userMission: UserMission = {
      userId: new ObjectId(userId),
      missionId: new ObjectId(missionId),
      progress: 0,
      isCompleted: false,
      rewardClaimed: false,
      startedAt: new Date(),
      lastUpdated: new Date()
    };

    const result = await userMissionsCollection.insertOne(userMission);
    
    // Increment mission participants count
    await missionsCollection.updateOne(
      { _id: new ObjectId(missionId) },
      { $inc: { participants: 1 } }
    );

    res.status(201).json({ 
      message: 'Mission participation started',
      participation: { ...userMission, _id: result.insertedId }
    });

  } catch (error) {
    console.error('Mission participation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}