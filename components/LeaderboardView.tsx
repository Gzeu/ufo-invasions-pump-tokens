'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LeaderboardUser {
  walletAddress: string;
  username: string;
  avatar: string;
  totalPoints: number;
  level: number;
  rank: number;
  badges: string[];
  missionsCompleted: number;
  totalRewards: number;
}

interface LeaderboardStats {
  totalUsers: number;
  totalPointsDistributed: number;
  totalMissionsCompleted: number;
  averageLevel: number;
}

export default function LeaderboardView() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardUser | null>(null);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    fetchLeaderboard();
  }, [limit]);

  const fetchLeaderboard = async () => {
    try {
      const savedWallet = localStorage.getItem('ufo_wallet');
      const url = `/api/leaderboard?limit=${limit}${
        savedWallet ? `&wallet=${savedWallet}` : ''
      }`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setLeaderboard(data.leaderboard);
        setUserRank(data.userRank);
        setStats(data.stats);
      } else {
        console.error('Failed to fetch leaderboard:', data.error);
      }
    } catch (error) {
      console.error('Fetch leaderboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    if (rank <= 10) return '🏆';
    if (rank <= 100) return '⭐';
    return '🚀';
  };

  const getBadgeEmoji = (badges: string[]) => {
    if (badges.includes('cosmic')) return '🌌';
    if (badges.includes('platinum')) return '💎';
    if (badges.includes('gold')) return '🥇';
    if (badges.includes('silver')) return '🥈';
    if (badges.includes('bronze')) return '🥉';
    return '🚀';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          🏆 Cosmic Leaderboard
        </h1>
        <p className="text-gray-300">
          Compete with fellow space explorers and climb the cosmic ranks!
        </p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-lg p-4 border border-blue-500/30">
            <div className="text-2xl font-bold text-blue-400">{stats.totalUsers}</div>
            <div className="text-sm text-gray-400">Total Explorers</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-4 border border-yellow-500/30">
            <div className="text-2xl font-bold text-yellow-400">{stats.totalPointsDistributed.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Points Distributed</div>
          </div>
          <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg p-4 border border-green-500/30">
            <div className="text-2xl font-bold text-green-400">{stats.totalMissionsCompleted}</div>
            <div className="text-sm text-gray-400">Missions Completed</div>
          </div>
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4 border border-purple-500/30">
            <div className="text-2xl font-bold text-purple-400">{stats.averageLevel}</div>
            <div className="text-sm text-gray-400">Average Level</div>
          </div>
        </div>
      )}

      {/* User Rank Highlight */}
      {userRank && (
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-6 mb-6 border-2 border-purple-500/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl">{getRankEmoji(userRank.rank)}</div>
              <div>
                <h3 className="font-bold text-white">Your Rank: #{userRank.rank}</h3>
                <p className="text-gray-300">{userRank.totalPoints} points • Level {userRank.level}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                {userRank.badges.slice(0, 3).map((badge, i) => (
                  <span key={i} className={`text-lg ${badgeColors[badge as keyof typeof badgeColors]}`}>
                    {getBadgeEmoji([badge])}
                  </span>
                ))}
                {userRank.badges.length > 3 && (
                  <span className="text-xs text-gray-400">+{userRank.badges.length - 3}</span>
                )}
              </div>
              <div className="text-sm text-gray-400">
                {userRank.missionsCompleted} missions completed
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-700/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-900/30">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-purple-300">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-purple-300">Explorer</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-purple-300">Level</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-purple-300">Points</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-purple-300">Missions</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-purple-300">Badges</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-purple-300">Rewards</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <motion.tr
                  key={user.walletAddress}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-t border-gray-700/50 hover:bg-purple-900/10 transition ${
                    userRank?.walletAddress === user.walletAddress ? 'bg-purple-900/20' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getRankEmoji(user.rank)}</span>
                      <span className="font-bold text-white">#{user.rank}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">
                        {user.username.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.username}</div>
                        <div className="text-xs text-gray-400 font-mono">
                          {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-purple-400">Level {user.level}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-yellow-400">{user.totalPoints.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">{user.missionsCompleted}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {user.badges.slice(0, 3).map((badge, i) => (
                        <span key={i} className={`text-lg ${badgeColors[badge as keyof typeof badgeColors]}`}>
                          {getBadgeEmoji([badge])}
                        </span>
                      ))}
                      {user.badges.length > 3 && (
                        <span className="text-xs text-gray-400">+{user.badges.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-green-400">{user.totalRewards} USDT</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Load More */}
      {leaderboard.length >= limit && (
        <div className="text-center mt-6">
          <button
            onClick={() => setLimit(prev => prev + 50)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-bold text-white transition"
          >
            Load More Explorers
          </button>
        </div>
      )}

      {leaderboard.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-gray-300 mb-2">Leaderboard Empty</h3>
          <p className="text-gray-500">Complete missions to see rankings!</p>
        </div>
      )}
    </div>
  );
}