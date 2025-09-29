'use client';

import { useState, useEffect } from 'react';

interface User {
  walletAddress: string;
  username: string;
  avatar: string;
  totalPoints: number;
  level: number;
  rank: number;
  badges: any[];
  missionsCompleted: number;
  totalRewardsEarned: number;
  pendingRewards: number;
  claimedRewards: number;
  joinedAt: string;
}

export default function WalletConnect() {
  const [connected, setConnected] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if already connected on load
  useEffect(() => {
    const savedWallet = localStorage.getItem('ufo_wallet');
    const savedUser = localStorage.getItem('ufo_user');
    
    if (savedWallet && savedUser) {
      setUser(JSON.parse(savedUser));
      setConnected(true);
    }
  }, []);

  const generateMockWallet = () => {
    const prefixes = ['0xa1', '0xb2', '0xc3', '0xd4', '0xe5', '0xf6'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = Math.random().toString(16).substring(2, 40);
    return prefix + suffix;
  };

  const connectWallet = async () => {
    setLoading(true);
    
    try {
      // Generate mock wallet address for MVP
      const mockAddress = generateMockWallet();
      
      const response = await fetch('/api/auth/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: mockAddress })
      });

      const data = await response.json();
      
      if (data.success && data.user) {
        setUser(data.user);
        setConnected(true);
        
        // Save to localStorage
        localStorage.setItem('ufo_wallet', mockAddress);
        localStorage.setItem('ufo_user', JSON.stringify(data.user));
        
        console.log('✅ Wallet connected:', mockAddress);
      } else {
        console.error('❌ Connection failed:', data.error);
        alert('Failed to connect wallet: ' + data.error);
      }
    } catch (error) {
      console.error('❌ Connection error:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setUser(null);
    localStorage.removeItem('ufo_wallet');
    localStorage.removeItem('ufo_user');
    console.log('❌ Wallet disconnected');
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg border border-purple-500/30">
        <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-purple-300 font-medium">Connecting to mothership...</span>
      </div>
    );
  }

  if (!connected || !user) {
    return (
      <button
        onClick={connectWallet}
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center gap-2"
      >
        <span className="text-xl">🛸</span>
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {/* User Info */}
      <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-500/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">
            {user.username.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">{user.username}</span>
            <span className="text-xs text-purple-300">Level {user.level}</span>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-purple-500/30">
          <div className="text-center">
            <div className="text-sm font-bold text-yellow-400">{user.totalPoints}</div>
            <div className="text-xs text-gray-400">Points</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-green-400">{user.totalRewardsEarned}</div>
            <div className="text-xs text-gray-400">USDT</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-blue-400">#{user.rank || '??'}</div>
            <div className="text-xs text-gray-400">Rank</div>
          </div>
        </div>
      </div>

      {/* Connected Wallet */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg border border-green-500/30">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="font-mono text-sm text-green-300">
          {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
        </span>
        <button
          onClick={disconnectWallet}
          className="ml-2 text-xs text-red-400 hover:text-red-300 transition"
          title="Disconnect"
        >
          ❌
        </button>
      </div>
    </div>
  );
}