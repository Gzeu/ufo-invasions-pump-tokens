import { connectDB } from '../lib/mongodb/connect';
import { Mission } from '../lib/mongodb/schemas';

const missions = [
  {
    missionId: 'mission_follow_twitter',
    title: '🐦 Follow UFO Invasions on Twitter',
    description: 'Join our cosmic community and stay updated with the latest missions! Follow @UFOInvasions for exclusive updates.',
    category: 'social' as const,
    requirements: {
      type: 'follow',
      target: '@UFOInvasions',
      verification: 'manual'
    },
    rewards: {
      points: 100,
      usdt: 0.5,
      badge: 'bronze' as const
    },
    difficulty: 'easy' as const,
    estimatedTime: '1 min',
    isActive: true,
    maxCompletions: 0, // unlimited
    currentCompletions: 0
  },
  {
    missionId: 'mission_join_telegram',
    title: '💬 Join Telegram Community',
    description: 'Connect with fellow space explorers in our Telegram group! Share strategies and get real-time updates.',
    category: 'social' as const,
    requirements: {
      type: 'join',
      target: 't.me/UFOInvasions',
      verification: 'manual'
    },
    rewards: {
      points: 150,
      usdt: 0.75,
      badge: 'bronze' as const
    },
    difficulty: 'easy' as const,
    estimatedTime: '2 min',
    isActive: true,
    maxCompletions: 0,
    currentCompletions: 0
  },
  {
    missionId: 'mission_first_trade',
    title: '💰 Complete Your First Trade',
    description: 'Trade any token worth $10+ on PancakeSwap to unlock cosmic trading rewards and prove your degen status!',
    category: 'trading' as const,
    requirements: {
      type: 'trade',
      target: { minValue: 10, platform: 'PancakeSwap' },
      verification: 'automatic'
    },
    rewards: {
      points: 500,
      usdt: 2,
      badge: 'silver' as const
    },
    difficulty: 'medium' as const,
    estimatedTime: '10 min',
    isActive: true,
    maxCompletions: 1, // once per user
    currentCompletions: 0
  },
  {
    missionId: 'mission_hold_token',
    title: '💎 Diamond Hands - Hold $UFO',
    description: 'Hold $UFO tokens for 7 days to prove your loyalty and unlock diamond status! True believers get rewarded.',
    category: 'trading' as const,
    requirements: {
      type: 'hold',
      target: { token: '$UFO', days: 7, minAmount: 100 },
      verification: 'automatic'
    },
    rewards: {
      points: 1000,
      usdt: 5,
      badge: 'gold' as const
    },
    difficulty: 'hard' as const,
    estimatedTime: '7 days',
    isActive: true,
    maxCompletions: 0,
    currentCompletions: 0
  },
  {
    missionId: 'mission_refer_friend',
    title: '👥 Refer a Friend',
    description: 'Invite friends to join the cosmic invasion and earn referral rewards! Spread the UFO revolution.',
    category: 'community' as const,
    requirements: {
      type: 'refer',
      target: { count: 1, mustComplete: 'onboarding' },
      verification: 'automatic'
    },
    rewards: {
      points: 300,
      usdt: 1.5,
      badge: 'bronze' as const
    },
    difficulty: 'medium' as const,
    estimatedTime: '5 min',
    isActive: true,
    maxCompletions: 10, // max 10 referrals
    currentCompletions: 0
  },
  {
    missionId: 'mission_cosmic_master',
    title: '🌟 Cosmic Master - Complete 10 Missions',
    description: 'Prove your dedication by completing 10 different missions! Become a true cosmic explorer and unlock legendary status.',
    category: 'special' as const,
    requirements: {
      type: 'milestone',
      target: { missions: 10, unique: true },
      verification: 'automatic'
    },
    rewards: {
      points: 2000,
      usdt: 10,
      badge: 'platinum' as const
    },
    difficulty: 'legendary' as const,
    estimatedTime: 'Variable',
    isActive: true,
    maxCompletions: 1,
    currentCompletions: 0
  },
  {
    missionId: 'mission_daily_checkin',
    title: '📅 Daily Check-in',
    description: 'Visit the platform daily to earn bonus points and maintain your cosmic connection! Consistency is key.',
    category: 'community' as const,
    requirements: {
      type: 'checkin',
      target: { daily: true, streak: false },
      verification: 'automatic'
    },
    rewards: {
      points: 50,
      usdt: 0.1,
      badge: 'none' as const
    },
    difficulty: 'easy' as const,
    estimatedTime: '10 sec',
    isActive: true,
    maxCompletions: 0, // unlimited daily
    currentCompletions: 0
  },
  {
    missionId: 'mission_share_invasion',
    title: '🔄 Share the Invasion',
    description: 'Share UFO Invasions with your followers and spread the cosmic revolution! Help others discover the platform.',
    category: 'social' as const,
    requirements: {
      type: 'share',
      target: { platform: 'any', hashtags: ['#UFOInvasions', '#DeFi', '#BSC'] },
      verification: 'manual'
    },
    rewards: {
      points: 200,
      usdt: 1,
      badge: 'bronze' as const
    },
    difficulty: 'easy' as const,
    estimatedTime: '3 min',
    isActive: true,
    maxCompletions: 5, // max 5 shares per user
    currentCompletions: 0
  }
];

async function seedMissions() {
  try {
    await connectDB();
    console.log('🌱 Seeding UFO Invasions missions...');

    // Clear existing missions for fresh start
    await Mission.deleteMany({});
    console.log('✅ Cleared existing missions');

    // Insert new missions
    let seedCount = 0;
    for (const mission of missions) {
      try {
        const result = await Mission.findOneAndUpdate(
          { missionId: mission.missionId },
          {
            ...mission,
            startDate: new Date(),
            endDate: undefined // No end date for now
          },
          { upsert: true, new: true }
        );
        
        seedCount++;
        console.log(`✅ Seeded mission ${seedCount}/8: ${mission.title}`);
      } catch (error) {
        console.error(`❌ Failed to seed mission: ${mission.title}`, error);
      }
    }

    console.log(`🎉 Successfully seeded ${seedCount}/${missions.length} missions!`);
    console.log('🚀 UFO Invasions missions are ready for cosmic explorers!');
    
    // Log mission summary
    const missionsByCategory = await Mission.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 }, totalPoints: { $sum: '$rewards.points' }, totalUsdt: { $sum: '$rewards.usdt' } } }
    ]);
    
    console.log('\n📊 Mission Summary by Category:');
    missionsByCategory.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count} missions, ${cat.totalPoints} points, ${cat.totalUsdt} USDT`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding missions:', error);
    process.exit(1);
  }
}

// Auto-run if called directly
if (require.main === module) {
  seedMissions();
}

export default seedMissions;