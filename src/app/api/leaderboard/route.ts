import { NextRequest, NextResponse } from 'next/server';

interface LeaderboardUser {
  rank: number;
  wallet: string;
  username?: string;
  avatar?: string;
  points: number;
  level: number;
  badges_count: number;
  missions_completed: number;
  total_earned: number;
  streak_days: number;
  last_active: string;
  rank_change: number; // +/- change from previous period
  percentile: number;
}

interface LeaderboardStats {
  total_users: number;
  total_points_distributed: number;
  total_rewards_distributed: number;
  active_users_24h: number;
  top_performer: LeaderboardUser;
  average_points: number;
}

// Real-time Leaderboard Manager
class LeaderboardManager {
  private mockUsers: LeaderboardUser[] = [
    {
      rank: 1,
      wallet: '0x1234...5678',
      username: 'UFO_Commander',
      avatar: '🛸',
      points: 15420,
      level: 12,
      badges_count: 8,
      missions_completed: 47,
      total_earned: 284.5,
      streak_days: 23,
      last_active: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      rank_change: 0,
      percentile: 99.8
    },
    {
      rank: 2,
      wallet: '0x2345...6789',
      username: 'Cosmic_Degen',
      avatar: '🚀',
      points: 12340,
      level: 10,
      badges_count: 6,
      missions_completed: 38,
      total_earned: 221.3,
      streak_days: 15,
      last_active: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      rank_change: 1,
      percentile: 98.5
    },
    {
      rank: 3,
      wallet: '0x3456...7890',
      username: 'Space_Explorer',
      avatar: '🌌',
      points: 9876,
      level: 8,
      badges_count: 5,
      missions_completed: 31,
      total_earned: 176.8,
      streak_days: 12,
      last_active: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      rank_change: -1,
      percentile: 95.2
    },
    {
      rank: 4,
      wallet: '0x4567...8901',
      username: 'Token_Hunter',
      avatar: '🎯',
      points: 8765,
      level: 7,
      badges_count: 4,
      missions_completed: 28,
      total_earned: 145.2,
      streak_days: 8,
      last_active: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      rank_change: 2,
      percentile: 91.7
    },
    {
      rank: 5,
      wallet: '0x5678...9012',
      username: 'Diamond_Pilot',
      avatar: '💎',
      points: 7654,
      level: 6,
      badges_count: 4,
      missions_completed: 24,
      total_earned: 132.6,
      streak_days: 6,
      last_active: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      rank_change: -2,
      percentile: 87.3
    }
  ];

  getGlobalLeaderboard(limit: number = 50): LeaderboardUser[] {
    return this.mockUsers.slice(0, limit);
  }

  getUserPosition(walletAddress: string): LeaderboardUser | null {
    return this.mockUsers.find(user => user.wallet.toLowerCase() === walletAddress.toLowerCase()) || null;
  }

  getSeasonalLeaderboard(season: string, limit: number = 50): LeaderboardUser[] {
    // Mock seasonal data - in production would query by time periods
    return this.mockUsers.map(user => ({
      ...user,
      points: Math.floor(user.points * 0.8), // Seasonal points adjustment
      rank_change: Math.floor(Math.random() * 6) - 3 // Random rank change for season
    })).slice(0, limit);
  }

  getPlatformStats(): LeaderboardStats {
    const totalUsers = 1247;
    const totalPoints = this.mockUsers.reduce((sum, user) => sum + user.points, 0);
    const totalRewards = this.mockUsers.reduce((sum, user) => sum + user.total_earned, 0);
    
    return {
      total_users: totalUsers,
      total_points_distributed: totalPoints * 10, // Estimate total across all users
      total_rewards_distributed: totalRewards * 15, // Estimate total rewards
      active_users_24h: Math.floor(totalUsers * 0.3), // 30% daily active
      top_performer: this.mockUsers[0],
      average_points: Math.floor(totalPoints / this.mockUsers.length)
    };
  }

  updateUserScore(walletAddress: string, points: number): boolean {
    const userIndex = this.mockUsers.findIndex(user => user.wallet.toLowerCase() === walletAddress.toLowerCase());
    
    if (userIndex >= 0) {
      this.mockUsers[userIndex].points += points;
      this.mockUsers[userIndex].level = Math.floor(this.mockUsers[userIndex].points / 1000);
      this.mockUsers[userIndex].last_active = new Date().toISOString();
      
      // Re-sort and update ranks
      this.mockUsers.sort((a, b) => b.points - a.points);
      this.mockUsers.forEach((user, index) => {
        user.rank = index + 1;
        user.percentile = Math.round((1 - index / this.mockUsers.length) * 100 * 10) / 10;
      });
      
      return true;
    }
    
    return false;
  }
}

const leaderboardManager = new LeaderboardManager();

// GET /api/leaderboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'global';
    const limit = parseInt(searchParams.get('limit') || '50');
    const walletAddress = searchParams.get('address');
    const season = searchParams.get('season');
    
    switch (type) {
      case 'global':
        const globalBoard = leaderboardManager.getGlobalLeaderboard(limit);
        return NextResponse.json({
          success: true,
          type: 'global',
          leaderboard: globalBoard,
          total: globalBoard.length,
          last_updated: new Date().toISOString()
        });
        
      case 'user':
        if (!walletAddress) {
          return NextResponse.json({ error: 'Wallet address required for user position' }, { status: 400 });
        }
        
        const userPosition = leaderboardManager.getUserPosition(walletAddress);
        
        if (!userPosition) {
          return NextResponse.json({
            success: true,
            user_found: false,
            message: 'User not found in leaderboard. Complete missions to get ranked!'
          });
        }
        
        return NextResponse.json({
          success: true,
          user_found: true,
          position: userPosition,
          nearby_users: leaderboardManager.getGlobalLeaderboard().slice(
            Math.max(0, userPosition.rank - 3),
            Math.min(userPosition.rank + 2, 50)
          )
        });
        
      case 'seasonal':
        if (!season) {
          return NextResponse.json({ error: 'Season ID required for seasonal leaderboard' }, { status: 400 });
        }
        
        const seasonalBoard = leaderboardManager.getSeasonalLeaderboard(season, limit);
        return NextResponse.json({
          success: true,
          type: 'seasonal',
          season,
          leaderboard: seasonalBoard,
          total: seasonalBoard.length,
          last_updated: new Date().toISOString()
        });
        
      case 'stats':
        const stats = leaderboardManager.getPlatformStats();
        return NextResponse.json({
          success: true,
          type: 'stats',
          statistics: stats,
          generated_at: new Date().toISOString()
        });
        
      default:
        return NextResponse.json({ error: 'Invalid leaderboard type' }, { status: 400 });
    }
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}

// POST /api/leaderboard
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, walletAddress, points } = body;
    
    switch (action) {
      case 'update_score':
        if (!walletAddress || typeof points !== 'number') {
          return NextResponse.json({ error: 'Wallet address and points required' }, { status: 400 });
        }
        
        const updated = leaderboardManager.updateUserScore(walletAddress, points);
        
        if (!updated) {
          return NextResponse.json({ error: 'User not found in leaderboard' }, { status: 404 });
        }
        
        const newPosition = leaderboardManager.getUserPosition(walletAddress);
        
        return NextResponse.json({
          success: true,
          message: `📊 Score updated! +${points} points earned.`,
          new_position: newPosition,
          updated_at: new Date().toISOString()
        });
        
      case 'refresh':
        // Trigger real-time leaderboard refresh
        return NextResponse.json({
          success: true,
          message: 'Leaderboard refreshed successfully',
          refreshed_at: new Date().toISOString()
        });
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update leaderboard' }, { status: 500 });
  }
}