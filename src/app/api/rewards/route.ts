import { NextRequest, NextResponse } from 'next/server';

// GET /api/rewards - Obține recompensele disponibile pentru user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get('address');
    
    if (!userAddress) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 });
    }

    const rewards = await getUserRewards(userAddress);
    const claimableAmount = rewards
      .filter(r => r.status === 'CLAIMABLE')
      .reduce((sum, r) => sum + r.amount, 0);
    
    return NextResponse.json({ 
      success: true, 
      rewards,
      totalClaimable: claimableAmount,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Rewards API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rewards' }, 
      { status: 500 }
    );
  }
}

// POST /api/rewards/claim - Revendică recompensele
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userAddress, rewardIds } = body;

    // Validează că user-ul poate revendica aceste rewards
    const claimResult = await claimRewards(userAddress, rewardIds);
    
    if (!claimResult.success) {
      return NextResponse.json({ error: claimResult.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      claimedAmount: claimResult.amount,
      transactionHash: claimResult.txHash
    });
  } catch (error) {
    console.error('Rewards claim error:', error);
    return NextResponse.json(
      { error: 'Failed to claim rewards' }, 
      { status: 500 }
    );
  }
}

async function getUserRewards(userAddress: string) {
  // TODO: Query database pentru user rewards
  return [
    {
      id: 'daily_001',
      type: 'DAILY',
      amount: 5.5,
      currency: 'USDT',
      status: 'CLAIMABLE',
      description: 'Daily UFO maintenance reward'
    }
  ];
}

async function claimRewards(userAddress: string, rewardIds: string[]) {
  // TODO: Procesează claim prin smart contract
  return {
    success: true,
    amount: 25.5,
    txHash: '0x123...'
  };
}