import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../../lib/mongodb';
import { User } from '../../../lib/models/User';
import { nanoid } from 'nanoid';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { walletAddress, referredBy, twitterHandle, discordId } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    const db = await getDatabase();
    const usersCollection = db.collection<User>('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ walletAddress });
    if (existingUser) {
      // Update last active
      await usersCollection.updateOne(
        { walletAddress },
        { $set: { lastActive: new Date() } }
      );
      return res.status(200).json({ 
        message: 'User already exists', 
        user: existingUser 
      });
    }

    // Generate unique referral code
    let referralCode;
    let codeExists = true;
    while (codeExists) {
      referralCode = nanoid(8).toUpperCase();
      const existing = await usersCollection.findOne({ referralCode });
      codeExists = !!existing;
    }

    // Create new user
    const newUser: User = {
      walletAddress,
      referralCode,
      referredBy: referredBy || undefined,
      badges: ['Space Cadet'], // Welcome badge
      totalPoints: 100, // Welcome bonus points
      nftsOwned: [],
      missionsCompleted: [],
      rewardsEarned: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActive: new Date(),
      twitterHandle: twitterHandle || undefined,
      discordId: discordId || undefined,
      totalGames: 0,
      gamesWon: 0,
      winRate: 0,
      highestScore: 0,
      totalTrades: 0,
      tradingVolume: 0,
      referralEarnings: 0,
      airdropsClaimed: 0
    };

    const result = await usersCollection.insertOne(newUser);
    
    // Create welcome reward
    await db.collection('rewards').insertOne({
      userId: result.insertedId,
      walletAddress,
      type: 'special',
      rewardType: 'USDT',
      amount: 5, // $5 USDT welcome bonus
      description: 'Welcome to UFO Invasions! 🛸',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    // Process referral if exists
    if (referredBy) {
      const referrer = await usersCollection.findOne({ referralCode: referredBy });
      if (referrer) {
        await usersCollection.updateOne(
          { referralCode: referredBy },
          { 
            $inc: { totalPoints: 250, referralEarnings: 10 },
            $set: { updatedAt: new Date() }
          }
        );
        
        // Create referral reward for referrer
        await db.collection('rewards').insertOne({
          userId: referrer._id,
          walletAddress: referrer.walletAddress,
          type: 'referral',
          rewardType: 'USDT',
          amount: 10, // $10 USDT referral bonus
          description: `Referral bonus for inviting ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: { ...newUser, _id: result.insertedId }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}