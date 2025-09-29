import { NextRequest, NextResponse } from 'next/server';
import { MissionAI } from '@/agent/core/MissionAI';

// GET /api/missions - Obține misiunile active pentru user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get('address');
    
    if (!userAddress) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 });
    }

    const missionAI = new MissionAI({
      coinGecko: process.env.COINGECKO_API_KEY || '',
      dexScreener: process.env.DEXSCREENER_API_KEY || '',
      twitter: process.env.TWITTER_API_KEY || ''
    });

    const missions = await missionAI.generatePersonalizedMissions(userAddress);
    
    return NextResponse.json({ 
      success: true, 
      missions,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Missions API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate missions' }, 
      { status: 500 }
    );
  }
}

// POST /api/missions - Completează o misiune
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { missionId, userAddress, transactionHash, proof } = body;

    // Verifică proof-of-completion (transaction hash, etc.)
    const isValid = await validateMissionCompletion(missionId, transactionHash, proof);
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid mission proof' }, { status: 400 });
    }

    // Marchează misiunea ca completată și calculează recompensele
    const rewards = await completeMission(missionId, userAddress);
    
    return NextResponse.json({
      success: true,
      rewards,
      missionCompleted: true
    });
  } catch (error) {
    console.error('Mission completion error:', error);
    return NextResponse.json(
      { error: 'Failed to complete mission' }, 
      { status: 500 }
    );
  }
}

async function validateMissionCompletion(missionId: string, txHash: string, proof: any): Promise<boolean> {
  // TODO: Implementare validare blockchain transaction
  // Verifică că tranzacția există și îndeplinește criteriile misiunii
  return true;
}

async function completeMission(missionId: string, userAddress: string) {
  // TODO: Update database și calculează recompensele
  return {
    usdt: 15,
    nft: false,
    badge: 'MISSION_COMPLETE'
  };
}