import { NextRequest, NextResponse } from 'next/server';

// Mission Types
type MissionType = 'PUMP_HUNTER' | 'SOCIAL_SCOUT' | 'DIAMOND_HANDS' | 'DEGEN_EXPLORER';

interface Mission {
  id: string;
  type: MissionType;
  title: string;
  description: string;
  requirements: {
    action: string;
    target?: string;
    amount?: number;
    duration?: number;
  };
  rewards: {
    xp: number;
    usdt: number;
    badge?: string;
  };
  progress: {
    current: number;
    target: number;
    completed: boolean;
  };
  deadline: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Legendary';
}

// AI-Powered Mission Generator
class MissionGenerator {
  generatePersonalizedMissions(walletAddress: string): Mission[] {
    const missions: Mission[] = [
      {
        id: `mission_${walletAddress}_pump_1`,
        type: 'PUMP_HUNTER',
        title: '🚀 Spot the Next 100x Gem',
        description: 'Find and buy a token that pumps 50% within 24 hours',
        requirements: {
          action: 'swap',
          amount: 0.1,
          duration: 24 * 60 * 60
        },
        rewards: {
          xp: 500,
          usdt: 15,
          badge: 'Pump Detector'
        },
        progress: {
          current: Math.floor(Math.random() * 1),
          target: 1,
          completed: Math.random() > 0.7
        },
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        difficulty: 'Medium'
      },
      {
        id: `mission_${walletAddress}_social_1`,
        type: 'SOCIAL_SCOUT',
        title: '📢 Cosmic Influencer',
        description: 'Share UFO Invasions on Twitter and get 10+ likes',
        requirements: {
          action: 'social_share',
          target: 'twitter',
          amount: 10
        },
        rewards: {
          xp: 200,
          usdt: 5
        },
        progress: {
          current: Math.floor(Math.random() * 10),
          target: 10,
          completed: Math.random() > 0.6
        },
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        difficulty: 'Easy'
      },
      {
        id: `mission_${walletAddress}_diamond_1`,
        type: 'DIAMOND_HANDS',
        title: '💎 Diamond Pilot Achievement',
        description: 'Hold UFO tokens for 7 days without selling',
        requirements: {
          action: 'hold',
          duration: 7 * 24 * 60 * 60
        },
        rewards: {
          xp: 1000,
          usdt: 25,
          badge: 'Diamond Hands'
        },
        progress: {
          current: Math.floor(Math.random() * 7),
          target: 7,
          completed: Math.random() > 0.8
        },
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        difficulty: 'Hard'
      }
    ];

    return missions;
  }
}

const missionGenerator = new MissionGenerator();

// GET /api/missions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('address') || 'demo';
    
    const missions = missionGenerator.generatePersonalizedMissions(walletAddress);

    return NextResponse.json({
      success: true,
      missions,
      total: missions.length,
      wallet: walletAddress,
      generated_at: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch missions' }, { status: 500 });
  }
}

// POST /api/missions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { missionId, walletAddress } = body;

    const rewards = {
      xp: Math.floor(Math.random() * 1000) + 100,
      usdt: Math.floor(Math.random() * 50) + 5,
      badge: Math.random() > 0.8 ? 'Achievement Unlocked' : null
    };

    return NextResponse.json({
      success: true,
      missionId,
      rewards,
      completed: true,
      message: '🎉 Mission completed! UFO beam incoming...',
      completed_at: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to complete mission' }, { status: 500 });
  }
}