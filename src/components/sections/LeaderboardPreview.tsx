'use client'

import { useState, useEffect } from 'react'

interface Commander {
  id: string
  rank: number
  address: string
  username?: string
  points: number
  missionsCompleted: number
  badges: string[]
  totalRewards: string
  isCurrentUser?: boolean
}

const mockLeaderboard: Commander[] = [
  {
    id: '1',
    rank: 1,
    address: '0x1234...5678',
    username: 'CosmicCommander',
    points: 1250,
    missionsCompleted: 12,
    badges: ['💎', '⭐', '🏆'],
    totalRewards: '5,890 UFO'
  },
  {
    id: '2', 
    rank: 2,
    address: '0x9876...4321',
    username: 'AlienHunter',
    points: 1180,
    missionsCompleted: 11,
    badges: ['💎', '🛸'],
    totalRewards: '4,250 UFO'
  },
  {
    id: '3',
    rank: 3,
    address: '0xabcd...efgh',
    username: 'GalacticTrader',
    points: 1050,
    missionsCompleted: 10,
    badges: ['💎', '🚀'],
    totalRewards: '3,780 UFO'
  },
  {
    id: '4',
    rank: 4,
    address: '0x5555...9999',
    username: 'StarExplorer',
    points: 920,
    missionsCompleted: 8,
    badges: ['🌌', '📱'],
    totalRewards: '2,890 UFO'
  },
  {
    id: '5',
    rank: 5,
    address: '0x7777...3333',
    username: 'NebulaWarrior',
    points: 850,
    missionsCompleted: 7,
    badges: ['🛸', '📱'],
    totalRewards: '2,340 UFO',
    isCurrentUser: true
  },
  {
    id: '6',
    rank: 6,
    address: '0x2222...8888',
    username: 'VoidSeeker', 
    points: 720,
    missionsCompleted: 6,
    badges: ['🛸'],
    totalRewards: '1,950 UFO'
  },
  {
    id: '7',
    rank: 7,
    address: '0x4444...6666',
    username: 'MeteorRider',
    points: 680,
    missionsCompleted: 5,
    badges: ['🚀'],
    totalRewards: '1,780 UFO'
  }
]

export function LeaderboardPreview() {
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>('weekly')
  const [animatedPoints, setAnimatedPoints] = useState<Record<string, number>>({})

  // Animate points counting up
  useEffect(() => {
    const newAnimatedPoints: Record<string, number> = {}
    
    mockLeaderboard.forEach((commander) => {
      let current = 0
      const target = commander.points
      const increment = target / 50
      
      const animate = () => {
        current += increment
        if (current < target) {
          newAnimatedPoints[commander.id] = Math.floor(current)
          setAnimatedPoints({...newAnimatedPoints})
          requestAnimationFrame(animate)
        } else {
          newAnimatedPoints[commander.id] = target
          setAnimatedPoints({...newAnimatedPoints})
        }
      }
      
      setTimeout(() => animate(), commander.rank * 100)
    })
  }, [timeFilter])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
      case 2: return 'text-gray-300 bg-gray-300/10 border-gray-300/30'
      case 3: return 'text-orange-400 bg-orange-400/10 border-orange-400/30'
      default: return 'text-ufo-glow bg-ufo-glow/10 border-ufo-glow/30'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Filters */}
      <div className="glass-cosmic rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h3 className="text-2xl font-cosmic font-bold glow-text mb-2">
              Top Commanders
            </h3>
            <p className="text-gray-300">
              Compete for cosmic supremacy and earn legendary rewards
            </p>
          </div>
          
          {/* Time Filter */}
          <div className="flex space-x-2">
            {(['daily', 'weekly', 'monthly', 'all-time'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  timeFilter === filter
                    ? 'bg-ufo-glow text-black'
                    : 'glass-ufo text-gray-300 hover:text-white'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        {mockLeaderboard.map((commander, index) => (
          <div
            key={commander.id}
            className={`leaderboard-row ${
              commander.isCurrentUser 
                ? 'ring-2 ring-ufo-glow bg-ufo-glow/5' 
                : ''
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center space-x-4">
              {/* Rank */}
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold ${
                getRankColor(commander.rank)
              }`}>
                {commander.rank <= 3 ? (
                  <span className="text-2xl">{getRankIcon(commander.rank)}</span>
                ) : (
                  <span className="text-lg">{commander.rank}</span>
                )}
              </div>

              {/* Commander Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-white truncate">
                        {commander.username || `Commander ${commander.rank}`}
                      </h4>
                      {commander.isCurrentUser && (
                        <span className="px-2 py-1 bg-ufo-glow/20 text-ufo-glow text-xs rounded-full">
                          YOU
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 font-mono">
                      {commander.address}
                    </p>
                  </div>
                  
                  {/* Badges */}
                  <div className="flex space-x-1">
                    {commander.badges.map((badge, badgeIndex) => (
                      <div
                        key={badgeIndex}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-ufo-glow/20 to-ufo-beam/20 border border-ufo-glow/30 flex items-center justify-center text-sm hover:scale-110 transition-transform duration-200"
                        title={`Badge ${badgeIndex + 1}`}
                      >
                        {badge}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="hidden md:flex items-center space-x-8 text-right">
                <div>
                  <div className="text-lg font-bold text-ufo-energy">
                    {animatedPoints[commander.id] || 0}
                  </div>
                  <div className="text-xs text-gray-400">Points</div>
                </div>
                
                <div>
                  <div className="text-lg font-bold text-ufo-beam">
                    {commander.missionsCompleted}
                  </div>
                  <div className="text-xs text-gray-400">Missions</div>
                </div>
                
                <div>
                  <div className="text-lg font-bold text-ufo-glow">
                    {commander.totalRewards}
                  </div>
                  <div className="text-xs text-gray-400">Rewards</div>
                </div>
              </div>

              {/* Mobile Stats */}
              <div className="md:hidden text-right">
                <div className="text-lg font-bold text-ufo-energy">
                  {animatedPoints[commander.id] || 0}
                </div>
                <div className="text-xs text-gray-400">Points</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Current User Position (if not in top 7) */}
      <div className="mt-8 text-center">
        <div className="glass-ufo rounded-xl p-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-2xl">🛸</div>
            <div>
              <p className="text-gray-300 mb-2">
                Your current position in the galactic leaderboard
              </p>
              <div className="flex items-center justify-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-ufo-glow">#15</div>
                  <div className="text-xs text-gray-400">Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-ufo-energy">480</div>
                  <div className="text-xs text-gray-400">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-ufo-beam">4</div>
                  <div className="text-xs text-gray-400">Missions</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400 mb-3">
              Complete more missions to climb the rankings! 🚀
            </p>
            <button className="btn-cosmic px-6 py-2 text-sm rounded-lg">
              View Full Leaderboard
            </button>
          </div>
        </div>
      </div>

      {/* Season Info */}
      <div className="mt-8 text-center">
        <div className="glass-cosmic rounded-xl p-4">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Season:</span>
              <span className="text-ufo-glow font-semibold">Cosmic Conquest #1</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Ends in:</span>
              <span className="text-ufo-beam font-semibold">12d 5h 23m</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Prize Pool:</span>
              <span className="text-ufo-energy font-semibold">100K UFO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
