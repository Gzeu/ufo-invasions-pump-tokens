import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connect';
import { User } from '@/lib/mongodb/schemas';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { walletAddress } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await User.findOne({ walletAddress });
    
    if (!user) {
      user = await User.create({
        walletAddress,
        username: `Explorer_${walletAddress.slice(0, 6)}`,
        totalPoints: 0,
        level: 1,
        rank: 0,
        badges: [],
        missionsCompleted: 0,
        totalRewardsEarned: 0,
        pendingRewards: 0,
        claimedRewards: 0
      });

      console.log('✅ New cosmic explorer joined:', walletAddress);
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    return NextResponse.json({
      success: true,
      message: '🛸 Wallet connected successfully! Welcome to UFO Invasions!',
      user: {
        walletAddress: user.walletAddress,
        username: user.username,
        avatar: user.avatar,
        totalPoints: user.totalPoints,
        level: user.level,
        rank: user.rank,
        badges: user.badges,
        missionsCompleted: user.missionsCompleted,
        totalRewardsEarned: user.totalRewardsEarned,
        pendingRewards: user.pendingRewards,
        claimedRewards: user.claimedRewards,
        joinedAt: user.joinedAt
      }
    });
  } catch (error: any) {
    console.error('❌ Connect error:', error);
    return NextResponse.json(
      { error: 'Failed to connect wallet', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('wallet');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ walletAddress });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please connect wallet first.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        walletAddress: user.walletAddress,
        username: user.username,
        avatar: user.avatar,
        totalPoints: user.totalPoints,
        level: user.level,
        rank: user.rank,
        badges: user.badges,
        missionsCompleted: user.missionsCompleted,
        totalRewardsEarned: user.totalRewardsEarned,
        pendingRewards: user.pendingRewards,
        claimedRewards: user.claimedRewards,
        joinedAt: user.joinedAt
      }
    });
  } catch (error: any) {
    console.error('❌ Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user', details: error.message },
      { status: 500 }
    );
  }
}