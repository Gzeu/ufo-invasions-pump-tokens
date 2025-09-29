'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Mission {
  _id: string;
  missionId: string;
  title: string;
  description: string;
  category: 'social' | 'trading' | 'community' | 'special';
  requirements: {
    type: string;
    target: any;
    verification: string;
  };
  rewards: {
    points: number;
    usdt: number;
    badge: string;
  };
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  estimatedTime: string;
  userProgress?: {
    status: 'not_started' | 'in_progress' | 'completed' | 'claimed';
    progress: {
      current: number;
      required: number;
      percentage: number;
    };
  };
}

interface User {
  walletAddress: string;
  username: string;
  totalPoints: number;
  level: number;
  pendingRewards: number;
}

export default function MissionDashboard() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [user, setUser] = useState<User | null>(null);
  const [completingMission, setCompletingMission] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Missions', icon: '🌌' },
    { id: 'social', name: 'Social', icon: '👥' },
    { id: 'trading', name: 'Trading', icon: '💰' },
    { id: 'community', name: 'Community', icon: '🏠' },
    { id: 'special', name: 'Special', icon: '✨' }
  ];

  const difficultyColors = {
    easy: 'from-green-500 to-green-600',
    medium: 'from-yellow-500 to-yellow-600',
    hard: 'from-orange-500 to-red-500',
    legendary: 'from-purple-500 to-pink-500'
  };

  const badgeColors = {
    none: 'text-gray-400',
    bronze: 'text-amber-600',
    silver: 'text-gray-300',
    gold: 'text-yellow-400',
    platinum: 'text-purple-400',
    cosmic: 'text-pink-400'
  };

  useEffect(() => {
    loadUser();
    fetchMissions();
  }, [selectedCategory]);

  const loadUser = () => {
    const savedUser = localStorage.getItem('ufo_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  };

  const fetchMissions = async () => {
    try {
      const savedWallet = localStorage.getItem('ufo_wallet');
      const url = `/api/missions${
        savedWallet ? `?wallet=${savedWallet}` : ''
      }${selectedCategory !== 'all' ? `&category=${selectedCategory}` : ''}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setMissions(data.missions);
      } else {
        console.error('Failed to fetch missions:', data.error);
      }
    } catch (error) {
      console.error('Fetch missions error:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeMission = async (missionId: string) => {
    const savedWallet = localStorage.getItem('ufo_wallet');
    if (!savedWallet) {
      alert('Please connect your wallet first!');
      return;
    }

    setCompletingMission(missionId);
    
    try {
      const response = await fetch('/api/missions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          walletAddress: savedWallet, 
          missionId,
          proof: 'manual_verification' // For MVP, we accept manual verification
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local user data
        if (data.user) {
          const updatedUser = { ...user, ...data.user };
          setUser(updatedUser);
          localStorage.setItem('ufo_user', JSON.stringify(updatedUser));
        }
        
        // Refresh missions
        fetchMissions();
        
        // Show success message
        alert(`🎉 Mission completed!\n💰 Earned: ${data.rewards.points} points${data.rewards.usdt > 0 ? ` + ${data.rewards.usdt} USDT` : ''}${data.rewards.badge ? ` + ${data.rewards.badge} badge` : ''}`);
      } else {
        alert('Failed to complete mission: ' + data.error);
      }
    } catch (error) {
      console.error('Complete mission error:', error);
      alert('Failed to complete mission. Please try again.');
    } finally {
      setCompletingMission(null);
    }
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
          🛸 Cosmic Missions
        </h1>
        <p className="text-gray-300">
          Complete missions to earn points, USDT rewards, and exclusive badges!
        </p>
      </div>

      {/* User Stats */}
      {user && (
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-6 mb-8 border border-purple-500/30">
          <div className="flex flex-wrap justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{user.totalPoints}</div>
              <div className="text-sm text-gray-400">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">Level {user.level}</div>
              <div className="text-sm text-gray-400">Current Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{user.pendingRewards} USDT</div>
              <div className="text-sm text-gray-400">Pending Rewards</div>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedCategory === cat.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {missions.map((mission, index) => (
            <motion.div
              key={mission.missionId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Mission Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${difficultyColors[mission.difficulty]}`}>
                  {mission.difficulty.toUpperCase()}
                </div>
                <div className="text-xs text-gray-400">{mission.estimatedTime}</div>
              </div>

              {/* Mission Content */}
              <h3 className="text-lg font-bold text-white mb-2">{mission.title}</h3>
              <p className="text-sm text-gray-300 mb-4 line-clamp-3">{mission.description}</p>

              {/* Rewards */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                <span className="flex items-center gap-1 text-yellow-400">
                  ⭐ {mission.rewards.points}
                </span>
                {mission.rewards.usdt > 0 && (
                  <span className="flex items-center gap-1 text-green-400">
                    💰 {mission.rewards.usdt} USDT
                  </span>
                )}
                {mission.rewards.badge !== 'none' && (
                  <span className={`flex items-center gap-1 ${badgeColors[mission.rewards.badge]}`}>
                    🏆 {mission.rewards.badge}
                  </span>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => completeMission(mission.missionId)}
                disabled={completingMission === mission.missionId || mission.userProgress?.status === 'completed'}
                className={`w-full py-3 rounded-lg font-bold transition ${
                  mission.userProgress?.status === 'completed'
                    ? 'bg-green-600 text-white cursor-default'
                    : completingMission === mission.missionId
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-lg'
                }`}
              >
                {completingMission === mission.missionId ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                    Completing...
                  </span>
                ) : mission.userProgress?.status === 'completed' ? (
                  '✅ Mission Completed!'
                ) : (
                  '🚀 Start Mission'
                )}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {missions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛸</div>
          <h3 className="text-xl font-bold text-gray-300 mb-2">No missions available</h3>
          <p className="text-gray-500">Check back later for new cosmic adventures!</p>
        </div>
      )}
    </div>
  );
}