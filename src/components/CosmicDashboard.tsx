'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useBalance, useContractRead } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Trophy, Rocket, Star, Globe, TrendingUp } from 'lucide-react';
import { UFOShip } from './UFOShip';
import { MissionCard } from './MissionCard';
import { CosmicLeaderboard } from './CosmicLeaderboard';
import { RewardsClaim } from './RewardsClaim';

interface Mission {
  id: string;
  type: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  rewards: {
    usdt: number;
    nft: boolean;
    badge?: string;
  };
  timeLimit: number;
  progress: number;
  status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED';
}

interface UserStats {
  totalRewards: number;
  nftCount: number;
  missionsCompleted: number;
  currentRank: number;
  powerLevel: number;
  badges: string[];
}

export const CosmicDashboard: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  
  const [activeMissions, setActiveMissions] = useState<Mission[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalRewards: 0,
    nftCount: 0,
    missionsCompleted: 0,
    currentRank: 0,
    powerLevel: 1,
    badges: []
  });
  const [selectedTab, setSelectedTab] = useState<'missions' | 'leaderboard' | 'rewards' | 'fleet'>('missions');
  const [isLoading, setIsLoading] = useState(false);

  // 🎆 Cosmic background animation
  const cosmicParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10
  }));

  useEffect(() => {
    if (isConnected && address) {
      loadUserData();
      loadActiveMissions();
    }
  }, [isConnected, address]);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      // Simulated API call - replace with real contract interactions
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUserStats({
        totalRewards: 125.50,
        nftCount: 3,
        missionsCompleted: 12,
        currentRank: 47,
        powerLevel: 5,
        badges: ['PUMP_HUNTER', 'TREND_RIDER', 'SOCIAL_SCOUT']
      });
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadActiveMissions = async () => {
    try {
      // Simulated missions - replace with AI-generated missions from backend
      const mockMissions: Mission[] = [
        {
          id: 'mission_001',
          type: 'TRENDING_HUNTER',
          title: '🚀 Ride the Wave: PEPE',
          description: 'Token-ul PEPE a crescut cu 45% astăzi. Investește minim $100 și ține poziția 6 ore.',
          difficulty: 'MEDIUM',
          rewards: { usdt: 15, nft: true, badge: 'TREND_RIDER' },
          timeLimit: Date.now() + 6 * 60 * 60 * 1000, // 6 ore
          progress: 0,
          status: 'ACTIVE'
        },
        {
          id: 'mission_002',
          type: 'VIRAL_SCOUT',
          title: '👽 Alien Radar: DOGE',
          description: 'DOGE buzz pe Twitter cu 2.5K mențiuni. Explorează și investește $50+.',
          difficulty: 'EASY',
          rewards: { usdt: 8, nft: false, badge: 'SOCIAL_SCOUT' },
          timeLimit: Date.now() + 12 * 60 * 60 * 1000, // 12 ore
          progress: 25,
          status: 'ACTIVE'
        },
        {
          id: 'mission_003',
          type: 'CATEGORY_SPECIALIST',
          title: '🌟 Master Your Domain: AI',
          description: 'Ești expert în AI tokens! Găsește un token nou din această categorie și investește.',
          difficulty: 'HARD',
          rewards: { usdt: 25, nft: true, badge: 'AI_EXPERT' },
          timeLimit: Date.now() + 48 * 60 * 60 * 1000, // 48 ore
          progress: 60,
          status: 'ACTIVE'
        }
      ];
      
      setActiveMissions(mockMissions);
    } catch (error) {
      console.error('Failed to load missions:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'from-green-400 to-emerald-600';
      case 'MEDIUM': return 'from-yellow-400 to-orange-500';
      case 'HARD': return 'from-red-400 to-pink-600';
      default: return 'from-blue-400 to-purple-600';
    }
  };

  const getTimeRemaining = (timeLimit: number) => {
    const remaining = timeLimit - Date.now();
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-black/40 rounded-2xl backdrop-blur-lg border border-purple-500/30"
        >
          <UFOShip size="large" animated />
          <h2 className="text-3xl font-bold text-white mt-6 mb-4">
            🛸 Connect Your Cosmic Wallet
          </h2>
          <p className="text-purple-300 mb-6">
            Join the UFO Invasions and start earning rewards for your crypto activity!
          </p>
          <w3m-button />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* 🌌 Cosmic Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {cosmicParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-white rounded-full opacity-20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6">
        {/* 🗺️ Header with User Stats */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <UFOShip size="medium" animated />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    UFO Invasions Command Center
                  </h1>
                  <p className="text-purple-300">
                    Commander {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                </div>
              </div>
              <w3m-button />
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-4 rounded-xl border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="text-green-400" size={20} />
                  <span className="text-green-400 text-sm font-medium">Total Rewards</span>
                </div>
                <p className="text-white text-xl font-bold">${userStats.totalRewards}</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-4 rounded-xl border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Rocket className="text-blue-400" size={20} />
                  <span className="text-blue-400 text-sm font-medium">Fleet Size</span>
                </div>
                <p className="text-white text-xl font-bold">{userStats.nftCount} UFOs</p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-4 rounded-xl border border-purple-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="text-purple-400" size={20} />
                  <span className="text-purple-400 text-sm font-medium">Missions</span>
                </div>
                <p className="text-white text-xl font-bold">{userStats.missionsCompleted}</p>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 p-4 rounded-xl border border-yellow-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="text-yellow-400" size={20} />
                  <span className="text-yellow-400 text-sm font-medium">Rank</span>
                </div>
                <p className="text-white text-xl font-bold">#{userStats.currentRank}</p>
              </div>
              
              <div className="bg-gradient-to-r from-red-600/20 to-pink-600/20 p-4 rounded-xl border border-red-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="text-red-400" size={20} />
                  <span className="text-red-400 text-sm font-medium">Power Level</span>
                </div>
                <p className="text-white text-xl font-bold">{userStats.powerLevel}</p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* 🗺️ Navigation Tabs */}
        <div className="mb-6">
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-2 border border-purple-500/30 inline-flex">
            {[
              { id: 'missions', label: 'Active Missions', icon: TrendingUp },
              { id: 'leaderboard', label: 'Cosmic Leaderboard', icon: Trophy },
              { id: 'rewards', label: 'Claim Rewards', icon: Zap },
              { id: 'fleet', label: 'UFO Fleet', icon: Rocket }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    selectedTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-purple-300 hover:bg-purple-800/50'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 📋 Content based on selected tab */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {selectedTab === 'missions' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeMissions.map((mission) => (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`bg-gradient-to-br ${getDifficultyColor(mission.difficulty)} p-6 rounded-2xl border border-white/20 backdrop-blur-lg`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium bg-black/30 text-white`}>
                        {mission.difficulty}
                      </span>
                      <span className="text-white text-sm">
                        ⏱️ {getTimeRemaining(mission.timeLimit)}
                      </span>
                    </div>
                    
                    <h3 className="text-white font-bold text-lg mb-2">{mission.title}</h3>
                    <p className="text-white/80 text-sm mb-4">{mission.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-white/80 mb-1">
                        <span>Progress</span>
                        <span>{mission.progress}%</span>
                      </div>
                      <div className="w-full bg-black/30 rounded-full h-2">
                        <motion.div
                          className="bg-white h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${mission.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                    
                    {/* Rewards */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-white">
                        <Zap size={16} />
                        <span className="font-bold">${mission.rewards.usdt} USDT</span>
                      </div>
                      {mission.rewards.nft && (
                        <div className="flex items-center gap-1 text-purple-200">
                          <Sparkles size={14} />
                          <span className="text-xs">NFT Reward</span>
                        </div>
                      )}
                    </div>
                    
                    <button className="w-full bg-black/30 hover:bg-black/50 text-white py-2 rounded-xl transition-all">
                      {mission.progress > 0 ? 'Continue Mission' : 'Start Mission'}
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
            
            {selectedTab === 'leaderboard' && (
              <CosmicLeaderboard userAddress={address} />
            )}
            
            {selectedTab === 'rewards' && (
              <RewardsClaim userStats={userStats} />
            )}
            
            {selectedTab === 'fleet' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* UFO Fleet visualization - placeholder */}
                <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 text-center">
                  <UFOShip size="large" animated />
                  <h3 className="text-white font-bold mt-4">Scout Ship</h3>
                  <p className="text-purple-300 text-sm">Power Level: 5</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};