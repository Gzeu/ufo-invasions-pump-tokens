import { NextRequest, NextResponse } from 'next/server';

// GET /api/leaderboard - Obține ranking-ul global
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || 'weekly';
    const limit = parseInt(searchParams.get('limit') || '50');
    const userAddress = searchParams.get('userAddress');
    
    const leaderboard = await getLeaderboardData(timeframe, limit, userAddress);
    
    return NextResponse.json({ 
      success: true, 
      leaderboard,
      timeframe,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' }, 
      { status: 500 }
    );
  }
}

async function getLeaderboardData(timeframe: string, limit: number, userAddress?: string) {
  // TODO: Query database pentru leaderboard cu filtru de timp
  return {
    entries: [
      {
        rank: 1,
        address: '0x742d35Cc7d7346C1B56e95893b8e8D30c242B932',
        displayName: 'CosmicWhale.eth',
        totalRewards: 2847.50,
        missionsCompleted: 156,
        powerLevel: 25
      }
    ],
    userRank: userAddress ? 47 : null,
    totalParticipants: 1247
  };
}