import { NextRequest, NextResponse } from 'next/server';

interface Reward {
  id: string;
  type: 'mission' | 'badge' | 'social' | 'airdrop' | 'daily';
  amount: number;
  currency: 'USDT' | 'BNB';
  source: string;
  status: 'pending' | 'claimed' | 'expired';
  claimed_at?: string;
  expires_at?: string;
  transaction_hash?: string;
}

interface UserRewards {
  wallet: string;
  pending_balance: number;
  claimed_balance: number;
  total_earned: number;
  rewards: Reward[];
}

// Mock USDT Integration - Ready for Smart Contract
class RewardManager {
  private mockRewards: Record<string, UserRewards> = {
    'demo': {
      wallet: 'demo',
      pending_balance: 45.5,
      claimed_balance: 127.8,
      total_earned: 173.3,
      rewards: [
        {
          id: 'reward_mission_pump_001',
          type: 'mission',
          amount: 15,
          currency: 'USDT',
          source: 'Pump Hunter Mission Completed',
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'reward_badge_diamond_001',
          type: 'badge',
          amount: 25,
          currency: 'USDT',
          source: 'Diamond Hands Badge Earned',
          status: 'pending',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'reward_social_twitter_001',
          type: 'social',
          amount: 5,
          currency: 'USDT',
          source: 'Twitter Engagement Reward',
          status: 'claimed',
          claimed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          transaction_hash: '0x1234567890abcdef'
        },
        {
          id: 'reward_daily_maintenance',
          type: 'daily',
          amount: 5.5,
          currency: 'USDT',
          source: 'Daily Maintenance Reward',
          status: 'pending',
          expires_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    }
  };

  getUserRewards(walletAddress: string): UserRewards {
    return this.mockRewards[walletAddress] || {
      wallet: walletAddress,
      pending_balance: Math.floor(Math.random() * 100) + 10,
      claimed_balance: Math.floor(Math.random() * 200) + 50,
      total_earned: 0,
      rewards: []
    };
  }

  async claimReward(walletAddress: string, rewardId: string): Promise<{success: boolean, transaction_hash?: string, error?: string}> {
    // In production, this would:
    // 1. Validate reward eligibility
    // 2. Call smart contract to transfer USDT
    // 3. Update database with transaction hash
    // 4. Emit real-time notification
    
    const userRewards = this.getUserRewards(walletAddress);
    const reward = userRewards.rewards.find(r => r.id === rewardId);
    
    if (!reward) {
      return { success: false, error: 'Reward not found' };
    }
    
    if (reward.status !== 'pending') {
      return { success: false, error: 'Reward already claimed or expired' };
    }
    
    // Mock smart contract interaction
    const transaction_hash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    // Update reward status
    reward.status = 'claimed';
    reward.claimed_at = new Date().toISOString();
    reward.transaction_hash = transaction_hash;
    
    return { success: true, transaction_hash };
  }

  async batchClaimRewards(walletAddress: string, rewardIds: string[]): Promise<{success: boolean, transactions: any[], total_amount: number}> {
    const transactions = [];
    let total_amount = 0;
    
    for (const rewardId of rewardIds) {
      const result = await this.claimReward(walletAddress, rewardId);
      if (result.success) {
        const reward = this.getUserRewards(walletAddress).rewards.find(r => r.id === rewardId);
        if (reward) {
          total_amount += reward.amount;
          transactions.push({
            reward_id: rewardId,
            amount: reward.amount,
            transaction_hash: result.transaction_hash
          });
        }
      }
    }
    
    return {
      success: transactions.length > 0,
      transactions,
      total_amount
    };
  }
}

const rewardManager = new RewardManager();

// GET /api/rewards
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('address') || 'demo';
    const action = searchParams.get('action') || 'balance';
    const rewardId = searchParams.get('rewardId');
    
    const userRewards = rewardManager.getUserRewards(walletAddress);
    
    switch (action) {
      case 'balance':
        return NextResponse.json({
          success: true,
          wallet: walletAddress,
          pending_balance: userRewards.pending_balance,
          claimed_balance: userRewards.claimed_balance,
          total_earned: userRewards.total_earned,
          pending_count: userRewards.rewards.filter(r => r.status === 'pending').length
        });
        
      case 'history':
        return NextResponse.json({
          success: true,
          wallet: walletAddress,
          rewards: userRewards.rewards,
          total: userRewards.rewards.length
        });
        
      case 'eligibility':
        if (!rewardId) {
          return NextResponse.json({ error: 'Reward ID required for eligibility check' }, { status: 400 });
        }
        
        const reward = userRewards.rewards.find(r => r.id === rewardId);
        const eligible = reward && reward.status === 'pending' && (!reward.expires_at || new Date(reward.expires_at) > new Date());
        
        return NextResponse.json({
          success: true,
          reward_id: rewardId,
          eligible,
          reason: !reward ? 'Reward not found' : reward.status !== 'pending' ? 'Already claimed' : eligible ? 'Eligible' : 'Expired'
        });
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rewards' }, { status: 500 });
  }
}

// POST /api/rewards
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, action, rewardId, rewardIds } = body;
    
    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }
    
    switch (action) {
      case 'claim':
        if (!rewardId) {
          return NextResponse.json({ error: 'Reward ID required' }, { status: 400 });
        }
        
        const result = await rewardManager.claimReward(walletAddress, rewardId);
        
        if (!result.success) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        
        return NextResponse.json({
          success: true,
          message: '🎉 Reward claimed successfully! USDT transferred to your wallet.',
          reward_id: rewardId,
          transaction_hash: result.transaction_hash,
          claimed_at: new Date().toISOString()
        });
        
      case 'batch_claim':
        if (!rewardIds || !Array.isArray(rewardIds)) {
          return NextResponse.json({ error: 'Reward IDs array required' }, { status: 400 });
        }
        
        const batchResult = await rewardManager.batchClaimRewards(walletAddress, rewardIds);
        
        return NextResponse.json({
          success: batchResult.success,
          message: `🎉 Batch claim completed! ${batchResult.total_amount} USDT transferred.`,
          transactions: batchResult.transactions,
          total_amount: batchResult.total_amount,
          claimed_count: batchResult.transactions.length,
          claimed_at: new Date().toISOString()
        });
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process reward claim' }, { status: 500 });
  }
}