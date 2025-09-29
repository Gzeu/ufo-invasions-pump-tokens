import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connect';
import { Leaderboard, User } from '@/lib/mongodb/schemas';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const walletAddress = searchParams.get('wallet');

    // Get top users
    const topUsers = await Leaderboard.find()
      .sort({ totalPoints: -1, missionsCompleted: -1 })
      .limit(limit)
      .lean();

    // Get user rank if wallet provided
    let userRank = null;
    if (walletAddress) {
      userRank = await Leaderboard.findOne({ walletAddress }).lean();
      
      // If user not in leaderboard yet, get from User collection
      if (!userRank) {
        const user = await User.findOne({ walletAddress });
        if (user) {
          userRank = {
            walletAddress: user.walletAddress,
            username: user.username,
            avatar: user.avatar,
            totalPoints: user.totalPoints,
            level: user.level,
            rank: user.rank || 999999,
            badges: user.badges.map(b => b.badgeType),
            missionsCompleted: user.missionsCompleted,
            totalRewards: user.totalRewardsEarned,
            lastUpdated: new Date()
          };
        }
      }
    }

    // Calculate stats
    const totalUsers = await User.countDocuments();
    const totalPoints = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPoints' } } }
    ]);
    const totalMissions = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$missionsCompleted' } } }
    ]);

    return NextResponse.json({
      success: true,
      leaderboard: topUsers,
      userRank,
      stats: {
        totalUsers,
        totalPointsDistributed: totalPoints[0]?.total || 0,
        totalMissionsCompleted: totalMissions[0]?.total || 0,
        averageLevel: totalUsers > 0 ? Math.round((totalPoints[0]?.total || 0) / 1000 / totalUsers) : 0
      },
      total: topUsers.length,
      message: `🏆 Leaderboard updated with ${topUsers.length} cosmic explorers`
    });
  } catch (error: any) {
    console.error('❌ Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard', details: error.message },
      { status: 500 }
    );
  }
}

// Update leaderboard rankings
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    // Recalculate all rankings from User collection
    const users = await User.find({ totalPoints: { $gt: 0 } })
      .sort({ totalPoints: -1, missionsCompleted: -1 })
      .lean();

    // Update leaderboard collection
    const bulkOps = users.map((user, index) => ({
      updateOne: {
        filter: { walletAddress: user.walletAddress },
        update: {
          username: user.username,
          avatar: user.avatar,
          totalPoints: user.totalPoints,
          level: user.level,
          rank: index + 1,
          badges: user.badges.map((b: any) => b.badgeType),
          missionsCompleted: user.missionsCompleted,
          totalRewards: user.totalRewardsEarned,
          lastUpdated: new Date()
        },
        upsert: true
      }
    }));

    if (bulkOps.length > 0) {
      await Leaderboard.bulkWrite(bulkOps);
    }

    // Also update User ranks
    const userBulkOps = users.map((user, index) => ({
      updateOne: {
        filter: { walletAddress: user.walletAddress },
        update: { rank: index + 1 }
      }
    }));

    if (userBulkOps.length > 0) {
      await User.bulkWrite(userBulkOps);
    }

    console.log(`✅ Updated rankings for ${users.length} users`);

    return NextResponse.json({
      success: true,
      message: '🏆 Leaderboard updated successfully',
      updated: users.length
    });
  } catch (error: any) {
    console.error('❌ Update leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to update leaderboard', details: error.message },
      { status: 500 }
    );
  }
}