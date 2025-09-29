import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connect';
import { Mission, UserMission, User } from '@/lib/mongodb/schemas';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('wallet');
    const category = searchParams.get('category');

    // Build query
    const query: any = { isActive: true };
    if (category && category !== 'all') {
      query.category = category;
    }

    // Get missions
    const missions = await Mission.find(query).sort({ createdAt: -1 }).lean();

    // If wallet provided, get user progress
    let missionsWithProgress = missions;
    if (walletAddress) {
      const user = await User.findOne({ walletAddress });
      if (!user) {
        return NextResponse.json(
          { error: 'User not found. Please connect wallet first.' },
          { status: 404 }
        );
      }

      const userMissions = await UserMission.find({ 
        walletAddress 
      }).lean();

      const progressMap = new Map(
        userMissions.map(um => [um.missionId, um])
      );

      missionsWithProgress = missions.map(mission => {
        const userProgress = progressMap.get(mission.missionId);
        return {
          ...mission,
          userProgress: userProgress || {
            status: 'not_started',
            progress: { current: 0, required: 1, percentage: 0 }
          }
        };
      });
    }

    return NextResponse.json({
      success: true,
      missions: missionsWithProgress,
      total: missions.length,
      message: `🚀 Found ${missions.length} active missions`
    });
  } catch (error: any) {
    console.error('❌ Get missions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch missions', details: error.message },
      { status: 500 }
    );
  }
}