'use client'

import { useState, useEffect } from 'react'
import { WalletButton } from '@/components/providers/WalletProvider'

export function UFOHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Cosmic Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cosmic-950/80 via-ufo-space/60 to-cosmic-950/80" />
      
      {/* Interactive UFO Beam */}
      <div 
        className="absolute pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 50,
          top: mousePosition.y - 100,
          opacity: isHovered ? 0.3 : 0,
        }}
      >
        <div className="w-24 h-48 bg-gradient-to-b from-ufo-glow/40 to-transparent rounded-full blur-sm" />
      </div>

      <div className="relative max-w-6xl mx-auto text-center">
        {/* Main UFO */}
        <div className="mb-12 relative">
          <div 
            className="inline-block text-8xl md:text-9xl animate-ufo-hover cursor-pointer transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            🛸
          </div>
          
          {/* Beam Effect */}
          <div className={`absolute top-full left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}>
            <div className="w-32 h-48 bg-gradient-to-b from-ufo-glow/30 to-ufo-beam/20 rounded-full blur-lg" />
          </div>
        </div>

        {/* Hero Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-cosmic font-bold glow-text">
              UFO INVASIONS
            </h1>
            <div className="text-2xl md:text-4xl font-semibold">
              <span className="text-ufo-glow">PUMP</span>
              <span className="text-white mx-2">•</span>
              <span className="text-ufo-beam">TOKENS</span>
            </div>
          </div>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Transform your <span className="text-ufo-glow font-semibold">meme token trading</span> into 
            an epic <span className="text-ufo-beam font-semibold">cosmic adventure</span>. 
            Complete UFO missions, earn exclusive rewards, and dominate the galactic leaderboard.
          </p>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="glass-cosmic rounded-xl p-6 mission-card">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-xl font-cosmic font-semibold text-ufo-glow mb-2">
                Epic Missions
              </h3>
              <p className="text-gray-300 text-sm">
                Complete UFO token swaps, holding challenges, and social tasks to earn cosmic rewards
              </p>
            </div>

            <div className="glass-cosmic rounded-xl p-6 mission-card">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="text-xl font-cosmic font-semibold text-ufo-beam mb-2">
                Leaderboard
              </h3>
              <p className="text-gray-300 text-sm">
                Climb the galactic rankings and compete with commanders across the universe
              </p>
            </div>

            <div className="glass-cosmic rounded-xl p-6 mission-card">
              <div className="text-3xl mb-3">🎆</div>
              <h3 className="text-xl font-cosmic font-semibold text-ufo-energy mb-2">
                NFT Rewards
              </h3>
              <p className="text-gray-300 text-sm">
                Unlock exclusive badges and collectible NFTs as you progress through missions
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-12">
            <WalletButton />
            
            <button className="btn-cosmic px-8 py-4 text-lg font-semibold rounded-xl group">
              <span className="flex items-center space-x-2">
                <span>Start Mission</span>
                <span className="text-xl group-hover:animate-bounce">🚀</span>
              </span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 glass-ufo rounded-xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-ufo-glow cosmic-pulse">
                  1,234+
                </div>
                <div className="text-sm text-gray-400 mt-1">Active Commanders</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-ufo-beam cosmic-pulse">
                  50,892
                </div>
                <div className="text-sm text-gray-400 mt-1">Missions Completed</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-ufo-energy cosmic-pulse">
                  5,447
                </div>
                <div className="text-sm text-gray-400 mt-1">NFTs Minted</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white cosmic-pulse">
                  $127K+
                </div>
                <div className="text-sm text-gray-400 mt-1">Rewards Distributed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 opacity-60">
        <div className="text-4xl animate-float">✨</div>
      </div>
      <div className="absolute top-32 right-16 opacity-60">
        <div className="text-3xl animate-float" style={{ animationDelay: '1s' }}>🚀</div>
      </div>
      <div className="absolute bottom-20 left-20 opacity-60">
        <div className="text-5xl animate-float" style={{ animationDelay: '2s' }}>🌌</div>
      </div>
      <div className="absolute bottom-32 right-12 opacity-60">
        <div className="text-4xl animate-float" style={{ animationDelay: '3s' }}>⭐</div>
      </div>
    </section>
  )
}
