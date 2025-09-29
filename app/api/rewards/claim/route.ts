import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connect';
import { User, UserMission } from '@/lib/mongodb/schemas';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { walletAddress, missionId } = body;

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

    if (missionId) {
      // Claim specific mission reward
      const userMission = await UserMission.findOne({
        walletAddress,
        missionId,
        status: 'completed'
      });

      if (!userMission) {
        return NextResponse.json(
          { error: 'Mission not completed or already claimed' },
          { status: 400 }
        );
      }

      // Update status
      userMission.status = 'claimed';
      userMission.claimedAt = new Date();
      await userMission.save();

      return NextResponse.json({
        success: true,
        message: '🎉 Mission rewards claimed successfully!',
        claimed: {
          usdt: userMission.rewardsClaimed.usdt,
          points: userMission.rewardsClaimed.points,
          badge: userMission.rewardsClaimed.badge
        }
      });
    } else {
      // Claim all pending rewards
      const rewardAmount = user.pendingRewards;
      
      if (rewardAmount <= 0) {
        return NextResponse.json(
          { error: 'No pending rewards to claim' },
          { status: 400 }
        );
      }

      user.claimedRewards += rewardAmount;
      user.pendingRewards = 0;
      await user.save();

      return NextResponse.json({
        success: true,
        message: '🎉 All pending rewards claimed successfully!',
        claimed: {
          usdt: rewardAmount,
          points: 0
        },
        user: {
          totalRewardsEarned: user.totalRewardsEarned,
          pendingRewards: user.pendingRewards,
          claimedRewards: user.claimedRewards
        }
      });
    }
  } catch (error: any) {
    console.error('❌ Claim rewards error:', error);
    return NextResponse.json(
      { error: 'Failed to claim rewards', details: error.message },
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
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get pending mission rewards
    const pendingMissions = await UserMission.find({
      walletAddress,
      status: 'completed'
    }).lean();

    return NextResponse.json({
      success: true,
      rewards: {
        pending: user.pendingRewards,
        claimed: user.claimedRewards,
        total: user.totalRewardsEarned
      },
      pendingMissions: pendingMissions.length,
      user: {
        totalPoints: user.totalPoints,
        level: user.level,
        badges: user.badges
      },
      message: `💰 Found ${user.pendingRewards} USDT pending rewards`
    });
  } catch (error: any) {
    console.error('❌ Get rewards error:', error);
    return NextResponse.json(
      { error: 'Failed to get rewards', details: error.message },
      { status: 500 }
    );
  }
}