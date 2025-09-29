import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connect';
import { User, Mission, UserMission, Leaderboard } from '@/lib/mongodb/schemas';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { walletAddress, missionId, proof } = body;

    // Validate input
    if (!walletAddress || !missionId) {
      return NextResponse.json(
        { error: 'Wallet address and mission ID are required' },
        { status: 400 }
      );
    }

    // Get mission and user
    const [mission, user] = await Promise.all([
      Mission.findOne({ missionId, isActive: true }),
      User.findOne({ walletAddress })
    ]);

    if (!mission) {
      return NextResponse.json(
        { error: 'Mission not found or inactive' },
        { status: 404 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please connect wallet first.' },
        { status: 404 }
      );
    }

    // Check if already completed
    const existingProgress = await UserMission.findOne({
      walletAddress,
      missionId,
      status: { $in: ['completed', 'claimed'] }
    });

    if (existingProgress) {
      return NextResponse.json(
        { error: 'Mission already completed' },
        { status: 400 }
      );
    }

    // Create/Update user mission
    const userMission = await UserMission.findOneAndUpdate(
      { walletAddress, missionId },
      {
        userId: user._id,
        status: 'completed',
        completedAt: new Date(),
        progress: {
          current: 1,
          required: 1,
          percentage: 100
        },
        rewardsClaimed: {
          points: mission.rewards.points,
          usdt: mission.rewards.usdt || 0,
          badge: mission.rewards.badge !== 'none' ? mission.rewards.badge : undefined
        }
      },
      { upsert: true, new: true }
    );

    // Update user stats
    user.totalPoints += mission.rewards.points;
    user.missionsCompleted += 1;
    user.pendingRewards += mission.rewards.usdt || 0;
    user.totalRewardsEarned += mission.rewards.usdt || 0;
    
    // Level up logic (every 1000 points = 1 level)
    user.level = Math.floor(user.totalPoints / 1000) + 1;

    // Add badge if applicable
    if (mission.rewards.badge && mission.rewards.badge !== 'none') {
      user.badges.push({
        badgeId: `${missionId}_${Date.now()}`,
        badgeType: mission.rewards.badge,
        earnedAt: new Date(),
        metadata: {
          name: `${mission.title} Badge`,
          image: `/badges/${mission.rewards.badge}.png`,
          description: `Earned by completing: ${mission.title}`,
          rarity: mission.rewards.badge.toUpperCase()
        }
      });
    }

    await user.save();

    // Update mission completion count
    mission.currentCompletions += 1;
    await mission.save();

    // Update leaderboard
    await Leaderboard.findOneAndUpdate(
      { walletAddress },
      {
        username: user.username,
        avatar: user.avatar,
        totalPoints: user.totalPoints,
        level: user.level,
        badges: user.badges.map(b => b.badgeType),
        missionsCompleted: user.missionsCompleted,
        totalRewards: user.totalRewardsEarned,
        lastUpdated: new Date()
      },
      { upsert: true }
    );

    // Recalculate ranks async
    recalculateRanks().catch(err => console.error('Rank calculation error:', err));

    console.log(`✅ Mission completed: ${missionId} by ${walletAddress}`);

    return NextResponse.json({
      success: true,
      message: '🎉 Mission completed successfully! Rewards claimed!',
      rewards: {
        points: mission.rewards.points,
        usdt: mission.rewards.usdt || 0,
        badge: mission.rewards.badge !== 'none' ? mission.rewards.badge : null
      },
      user: {
        totalPoints: user.totalPoints,
        level: user.level,
        missionsCompleted: user.missionsCompleted,
        pendingRewards: user.pendingRewards,
        badges: user.badges
      }
    });
  } catch (error: any) {
    console.error('❌ Complete mission error:', error);
    return NextResponse.json(
      { error: 'Failed to complete mission', details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to recalculate ranks
async function recalculateRanks() {
  try {
    const leaderboard = await Leaderboard.find().sort({ totalPoints: -1 });
    
    const bulkOps = leaderboard.map((entry, index) => ({
      updateOne: {
        filter: { _id: entry._id },
        update: { rank: index + 1 }
      }
    }));

    if (bulkOps.length > 0) {
      await Leaderboard.bulkWrite(bulkOps);
      
      // Also update User ranks
      for (let i = 0; i < leaderboard.length; i++) {
        await User.findOneAndUpdate(
          { walletAddress: leaderboard[i].walletAddress },
          { rank: i + 1 }
        );
      }
    }
    
    console.log('✅ Ranks recalculated successfully');
  } catch (error) {
    console.error('❌ Rank recalculation error:', error);
  }
}