'use client';

import { useState, useEffect } from 'react';
import WalletConnect from '@/components/WalletConnect';
import MissionDashboard from '@/components/MissionDashboard';
import LeaderboardView from '@/components/LeaderboardView';
import UFOHero from '@/components/sections/UFOHero';
import StatsOverview from '@/components/sections/StatsOverview';
import CosmicFooter from '@/components/sections/CosmicFooter';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'missions' | 'leaderboard'>('missions');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Check wallet connection status
    const savedWallet = localStorage.getItem('ufo_wallet');
    setConnected(!!savedWallet);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="text-3xl animate-pulse">🛸</div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  UFO Invasions
                </h1>
                <p className="text-xs text-gray-400">Pump Tokens MVP</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="hidden md:flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('missions')}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  activeTab === 'missions'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                🎯 Missions
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  activeTab === 'leaderboard'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                🏆 Leaderboard
              </button>
            </div>

            {/* Wallet Connect */}
            <WalletConnect />
          </div>
        </div>
      </nav>

      {/* Hero Section (only show if not connected) */}
      {!connected && (
        <>
          <UFOHero />
          <StatsOverview />
        </>
      )}

      {/* Mobile Tab Navigation */}
      <div className="md:hidden sticky top-16 z-40 bg-gray-900/90 backdrop-blur-sm border-b border-purple-500/20">
        <div className="flex">
          <button
            onClick={() => setActiveTab('missions')}
            className={`flex-1 py-3 text-sm font-medium transition ${
              activeTab === 'missions'
                ? 'bg-purple-600 text-white border-b-2 border-purple-400'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            🎯 Missions
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-3 text-sm font-medium transition ${
              activeTab === 'leaderboard'
                ? 'bg-purple-600 text-white border-b-2 border-purple-400'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            🏆 Leaderboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative">
        {/* Connection Required Message */}
        {!connected && (
          <div className="max-w-4xl mx-auto px-6 py-12 text-center">
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-8 border border-purple-500/30">
              <div className="text-6xl mb-4">🛸</div>
              <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet to Begin</h2>
              <p className="text-gray-300 mb-6">
                Join thousands of cosmic explorers completing missions and earning rewards!
              </p>
              <div className="flex justify-center">
                <WalletConnect />
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content (only show if connected) */}
        {connected && (
          <div className="py-8">
            {activeTab === 'missions' && <MissionDashboard />}
            {activeTab === 'leaderboard' && <LeaderboardView />}
          </div>
        )}
      </main>

      {/* Footer */}
      <CosmicFooter />

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  );
}