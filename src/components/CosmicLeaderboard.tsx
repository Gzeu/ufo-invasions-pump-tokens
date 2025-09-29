'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, TrendingUp, Crown, Medal } from 'lucide-react';
import { UFOShip } from './UFOShip';

interface LeaderboardEntry {
  rank: number;
  address: string;
  displayName: string;
  totalRewards: number;
  missionsCompleted: number;
  powerLevel: number;
  badges: string[];
  nftCount: number;
  isCurrentUser?: boolean;
}

interface CosmicLeaderboardProps {
  userAddress?: string;
}

export const CosmicLeaderboard: React.FC<CosmicLeaderboardProps> = ({ userAddress }) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'alltime'>('weekly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboardData();
  }, [timeframe]);

  const loadLeaderboardData = async () => {
    setLoading(true);
    try {
      // Simulated leaderboard data - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: LeaderboardEntry[] = [
        {
          rank: 1,
          address: '0x742d35Cc7d7346C1B56e95893b8e8D30c242B932',
          displayName: 'CosmicWhale.eth',
          totalRewards: 2847.50,
          missionsCompleted: 156,
          powerLevel: 25,
          badges: ['COSMIC_WHALE', 'DIAMOND_HANDS', 'ALPHA_FINDER', 'GUILD_MASTER'],
          nftCount: 12
        },
        {
          rank: 2, 
          address: '0x1234567890123456789012345678901234567890',
          displayName: 'AlienHunter',
          totalRewards: 1923.75,
          missionsCompleted: 98,
          powerLevel: 18,
          badges: ['PUMP_HUNTER', 'TREND_RIDER', 'SOCIAL_SCOUT'],
          nftCount: 8
        },
        {
          rank: 3,
          address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          displayName: 'UFOCommander',
          totalRewards: 1567.25,
          missionsCompleted: 87,
          powerLevel: 15,
          badges: ['DEGEN_EXPLORER', 'PUMP_HUNTER'],
          nftCount: 6
        },
        {
          rank: 4,
          address: userAddress || '0x0000000000000000000000000000000000000000',
          displayName: 'You',
          totalRewards: 125.50,
          missionsCompleted: 12,
          powerLevel: 5,
          badges: ['PUMP_HUNTER', 'TREND_RIDER'],
          nftCount: 3,
          isCurrentUser: true
        },
        {
          rank: 5,
          address: '0x9876543210987654321098765432109876543210',
          displayName: 'SpaceTrader',
          totalRewards: 98.25,
          missionsCompleted: 8,
          powerLevel: 3,
          badges: ['SOCIAL_SCOUT'],
          nftCount: 2
        }
      ];
      
      setLeaderboardData(mockData);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="text-yellow-400" size={24} />;
      case 2: return <Medal className="text-gray-300" size={24} />;
      case 3: return <Medal className="text-amber-600" size={24} />;
      default: return <span className="text-white font-bold text-lg">#{rank}</span>;
    }
  };

  const getRankBgColor = (rank: number, isCurrentUser?: boolean) => {
    if (isCurrentUser) {
      return 'from-purple-600/30 to-pink-600/30 border-purple-500/50';
    }
    
    switch (rank) {
      case 1: return 'from-yellow-600/30 to-amber-600/30 border-yellow-500/50';
      case 2: return 'from-gray-600/30 to-slate-600/30 border-gray-500/50';
      case 3: return 'from-amber-700/30 to-orange-600/30 border-amber-600/50';
      default: return 'from-blue-600/20 to-purple-600/20 border-blue-500/30';
    }
  };

  const getShipType = (powerLevel: number) => {
    if (powerLevel >= 20) return 'special';
    if (powerLevel >= 15) return 'mothership';
    if (powerLevel >= 8) return 'battle';
    return 'scout';
  };

  if (loading) {
    return (
      <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
        <div className="flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <UFOShip size="large" animated />
          </motion.div>
          <p className="ml-4 text-purple-300">Loading cosmic leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 🗺️ Header and Filters */}
      <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="text-yellow-400" size={28} />
            <h2 className="text-2xl font-bold text-white">Cosmic Leaderboard</h2>
          </div>
          
          {/* Timeframe Selector */}
          <div className="flex gap-2">
            {[
              { id: 'daily', label: 'Daily' },
              { id: 'weekly', label: 'Weekly' },
              { id: 'monthly', label: 'Monthly' },
              { id: 'alltime', label: 'All Time' }
            ].map((period) => (
              <button
                key={period.id}
                onClick={() => setTimeframe(period.id as any)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  timeframe === period.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-800/30 text-purple-300 hover:bg-purple-700/50'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🏆 Leaderboard Entries */}
      <div className="space-y-3">
        {leaderboardData.map((entry, index) => (
          <motion.div
            key={entry.address}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-r ${getRankBgColor(entry.rank, entry.isCurrentUser)} backdrop-blur-lg rounded-2xl p-6 border relative overflow-hidden`}
          >
            {/* Rank Badge */}
            <div className="absolute top-4 left-4">
              {getRankIcon(entry.rank)}
            </div>
            
            {/* Current User Highlight */}
            {entry.isCurrentUser && (
              <motion.div
                className="absolute inset-0 border-2 border-purple-400 rounded-2xl"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            
            <div className="flex items-center justify-between ml-12">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <UFOShip 
                  size="medium" 
                  type={getShipType(entry.powerLevel)}
                  powerLevel={entry.powerLevel}
                  animated={entry.rank <= 3}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold text-lg">{entry.displayName}</h3>
                    {entry.isCurrentUser && (
                      <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                        YOU
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm font-mono">
                    {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                  </p>
                  
                  {/* Badges */}
                  <div className="flex gap-1 mt-2">
                    {entry.badges.slice(0, 3).map((badge) => (
                      <span 
                        key={badge}
                        className="bg-white/20 text-white text-xs px-2 py-1 rounded-full"
                      >
                        {badge.replace('_', ' ')}
                      </span>
                    ))}
                    {entry.badges.length > 3 && (
                      <span className="text-purple-300 text-xs px-2 py-1">
                        +{entry.badges.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="text-right space-y-2">
                <div className="flex items-center gap-2 justify-end">
                  <Zap className="text-green-400" size={16} />
                  <span className="text-white font-bold">${entry.totalRewards.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <TrendingUp className="text-blue-400" size={16} />
                  <span className="text-purple-300">{entry.missionsCompleted} missions</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Star className="text-yellow-400" size={16} />
                  <span className="text-purple-300">{entry.nftCount} NFTs</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* 📋 Stats Footer */}
      <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-4 border border-purple-500/30 text-center">
        <p className="text-purple-300 text-sm">
          🎆 Compete with {leaderboardData.length.toLocaleString()}+ space commanders across the galaxy!
        </p>
      </div>
    </div>
  );
};

export default CosmicLeaderboard;