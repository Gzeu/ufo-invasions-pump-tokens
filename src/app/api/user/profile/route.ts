import { NextRequest, NextResponse } from 'next/server';

// GET /api/user/profile - Obține profilul complet al user-ului
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get('address');
    
    if (!userAddress) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 });
    }

    const profile = await getUserProfile(userAddress);
    
    return NextResponse.json({ 
      success: true, 
      profile,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('User profile API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' }, 
      { status: 500 }
    );
  }
}

// PUT /api/user/profile - Actualizează profilul user-ului
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userAddress, displayName, avatar } = body;

    const updatedProfile = await updateUserProfile(userAddress, { displayName, avatar });
    
    return NextResponse.json({
      success: true,
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' }, 
      { status: 500 }
    );
  }
}

async function getUserProfile(userAddress: string) {
  // TODO: Query database pentru user profile
  return {
    address: userAddress,
    displayName: 'Space Commander',
    totalRewards: 125.50,
    nftCount: 3,
    missionsCompleted: 12,
    currentRank: 47,
    powerLevel: 5,
    badges: ['PUMP_HUNTER', 'TREND_RIDER'],
    joinedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    lastActive: Date.now() - 2 * 60 * 60 * 1000
  };
}

async function updateUserProfile(userAddress: string, updates: any) {
  // TODO: Update database cu noile date
  return { ...await getUserProfile(userAddress), ...updates };
}