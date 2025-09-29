const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

/**
 * UFO Invasions MVP Database Initialization
 * Creeză structura completă și populează cu date inițiale
 */

async function initMVPDatabase() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    console.log('Run: vercel env pull .env.local');
    process.exit(1);
  }
  
  console.log('🛸 Initializing UFO Invasions MVP database...');
  
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    
    const db = client.db('ufo_invasions_db');
    
    // Create collections with optimized indexes
    console.log('📊 Creating collections and indexes...');
    
    // Users collection - core user data
    const usersCollection = db.collection('users');
    await usersCollection.createIndex({ walletAddress: 1 }, { unique: true });
    await usersCollection.createIndex({ referralCode: 1 }, { unique: true });
    await usersCollection.createIndex({ totalPoints: -1 });
    await usersCollection.createIndex({ lastActive: -1 });
    await usersCollection.createIndex({ rewardsEarned: -1 });
    await usersCollection.createIndex({ gamesWon: -1, winRate: -1 });
    
    // Missions collection - game missions
    const missionsCollection = db.collection('missions');
    await missionsCollection.createIndex({ category: 1, isActive: 1 });
    await missionsCollection.createIndex({ difficulty: 1 });
    await missionsCollection.createIndex({ createdAt: -1 });
    await missionsCollection.createIndex({ endDate: 1 }, { partialFilterExpression: { endDate: { $exists: true } } });
    
    // User missions - participation tracking
    const userMissionsCollection = db.collection('user_missions');
    await userMissionsCollection.createIndex({ userId: 1, missionId: 1 }, { unique: true });
    await userMissionsCollection.createIndex({ isCompleted: 1, rewardClaimed: 1 });
    await userMissionsCollection.createIndex({ lastUpdated: -1 });
    
    // Rewards collection - all rewards/airdrops
    const rewardsCollection = db.collection('rewards');
    await rewardsCollection.createIndex({ walletAddress: 1 });
    await rewardsCollection.createIndex({ status: 1 });
    await rewardsCollection.createIndex({ type: 1, rewardType: 1 });
    await rewardsCollection.createIndex({ createdAt: -1 });
    await rewardsCollection.createIndex({ scheduledFor: 1 });
    await rewardsCollection.createIndex({ expiresAt: 1 }, { partialFilterExpression: { expiresAt: { $exists: true } } });
    
    // Global stats collection
    const statsCollection = db.collection('global_stats');
    await statsCollection.createIndex({ type: 1 }, { unique: true });
    
    console.log('✅ Collections and indexes created successfully');
    
    // Insert comprehensive initial missions
    console.log('🎯 Inserting MVP missions...');
    
    const mvpMissions = [
      // DAILY MISSIONS
      {
        title: 'Daily Explorer',
        description: 'Visit the UFO Invasions platform and check your progress.',
        category: 'daily',
        difficulty: 'easy',
        reward: {
          type: 'UFO',
          amount: 50
        },
        requirements: {
          type: 'play_games',
          target: 1,
          timeLimit: 24
        },
        participants: 0,
        completions: 0,
        startDate: new Date(),
        isActive: true,
        isRepeatable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // WEEKLY MISSIONS
      {
        title: 'Cosmic Achiever',
        description: 'Win 5 games this week to prove your cosmic gaming skills.',
        category: 'weekly',
        difficulty: 'medium',
        reward: {
          type: 'USDT',
          amount: 25,
          badge: 'Weekly Champion'
        },
        requirements: {
          type: 'win_games',
          target: 5,
          timeLimit: 168 // 7 days
        },
        participants: 0,
        completions: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isActive: true,
        isRepeatable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // SPECIAL MISSIONS
      {
        title: 'First Contact',
        description: 'Connect your wallet and join the UFO invasion!',
        category: 'special',
        difficulty: 'easy',
        reward: {
          type: 'USDT',
          amount: 5,
          badge: 'Space Cadet'
        },
        requirements: {
          type: 'play_games',
          target: 1
        },
        participants: 0,
        completions: 0,
        startDate: new Date(),
        isActive: true,
        isRepeatable: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      {
        title: 'Social Invader',
        description: 'Connect your Twitter account and join our cosmic community.',
        category: 'special',
        difficulty: 'easy',
        reward: {
          type: 'UFO',
          amount: 200,
          badge: 'Influencer'
        },
        requirements: {
          type: 'social_share',
          target: 1
        },
        participants: 0,
        completions: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        isActive: true,
        isRepeatable: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      {
        title: 'Galactic Ambassador',
        description: 'Invite 5 friends to join the UFO invasion using your referral code.',
        category: 'special',
        difficulty: 'hard',
        reward: {
          type: 'USDT',
          amount: 50,
          badge: 'Ambassador'
        },
        requirements: {
          type: 'referral',
          target: 5
        },
        participants: 0,
        completions: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true,
        isRepeatable: false,
        maxCompletions: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // EPIC MISSIONS
      {
        title: 'UFO Master',
        description: 'Win 50 games and become a true UFO gaming legend!',
        category: 'epic',
        difficulty: 'legendary',
        reward: {
          type: 'USDT',
          amount: 200,
          badge: 'UFO Master'
        },
        requirements: {
          type: 'win_games',
          target: 50
        },
        participants: 0,
        completions: 0,
        startDate: new Date(),
        isActive: true,
        isRepeatable: false,
        maxCompletions: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Check if missions already exist
    const existingMissions = await missionsCollection.countDocuments();
    if (existingMissions === 0) {
      await missionsCollection.insertMany(mvpMissions);
      console.log(`✅ Inserted ${mvpMissions.length} MVP missions`);
    } else {
      console.log(`📊 Found ${existingMissions} existing missions`);
      
      // Update existing missions to be active
      const updateResult = await missionsCollection.updateMany(
        { isActive: false },
        { $set: { isActive: true, updatedAt: new Date() } }
      );
      console.log(`✅ Activated ${updateResult.modifiedCount} inactive missions`);
    }
    
    // Initialize global stats
    console.log('📊 Initializing global statistics...');
    
    const initialStats = [
      {
        type: 'user_stats',
        totalUsers: 0,
        activeUsers: 0,
        totalReferrals: 0,
        totalRewardsDistributed: 0,
        lastUpdated: new Date()
      },
      {
        type: 'reward_stats',
        totalRewards: 0,
        totalUSDT: 0,
        totalUFO: 0,
        totalNFTs: 0,
        pendingRewards: 0,
        completedToday: 0,
        lastUpdated: new Date()
      },
      {
        type: 'beam_stats',
        totalBeams: 0,
        totalBeamAmount: 0,
        totalBeamUSDT: 0,
        totalBeamUFO: 0,
        lastBeamTime: null,
        lastUpdated: new Date()
      },
      {
        type: 'mission_stats',
        totalMissions: mvpMissions.length,
        activeMissions: mvpMissions.length,
        totalCompletions: 0,
        totalParticipants: 0,
        lastUpdated: new Date()
      },
      {
        type: 'last_beam',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago to allow immediate beam
      }
    ];
    
    for (const stat of initialStats) {
      await statsCollection.updateOne(
        { type: stat.type },
        { $setOnInsert: stat },
        { upsert: true }
      );
    }
    
    console.log('✅ Global statistics initialized');
    
    // Database summary
    const collections = await db.listCollections().toArray();
    const collectionStats = [];
    
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      collectionStats.push({ name: collection.name, documents: count });
    }
    
    console.log(`\n📊 UFO Invasions MVP Database Summary:`);
    console.log(`Total Collections: ${collections.length}`);
    collectionStats.forEach(stat => {
      console.log(`  - ${stat.name}: ${stat.documents} documents`);
    });
    
    console.log('\n🎆 MVP Database initialization completed successfully!');
    console.log('🚀 Ready to deploy on Vercel with MongoDB Atlas!');
    console.log('\n🛠️ Next steps:');
    console.log('1. Run: vercel --prod (deploy to production)');
    console.log('2. Configure MongoDB Atlas integration in Vercel dashboard');
    console.log('3. Set environment variables in Vercel project settings');
    console.log('4. Test agents: POST /api/agents/orchestrator');
    
  } catch (error) {
    console.error('❌ MVP database initialization failed:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔐 Connection closed');
  }
}

initMVPDatabase();