'use client'

import { useState, useEffect } from 'react'

interface Stat {
  id: string
  label: string
  value: number
  suffix: string
  icon: string
  color: string
  description: string
}

const stats: Stat[] = [
  {
    id: 'commanders',
    label: 'Active Commanders',
    value: 1234,
    suffix: '+',
    icon: '👽',
    color: 'text-ufo-glow',
    description: 'Cosmic pilots joining the invasion'
  },
  {
    id: 'missions',
    label: 'Missions Completed',
    value: 50892,
    suffix: '',
    icon: '🎯',
    color: 'text-ufo-beam',
    description: 'Total missions accomplished'
  },
  {
    id: 'rewards',
    label: 'UFO Tokens Distributed',
    value: 2547891,
    suffix: '',
    icon: '🛸',
    color: 'text-ufo-energy',
    description: 'Total rewards given to commanders'
  },
  {
    id: 'nfts',
    label: 'NFT Badges Minted',
    value: 5447,
    suffix: '',
    icon: '🏆',
    color: 'text-purple-400',
    description: 'Unique badges earned by commanders'
  }
]

export function StatsOverview() {
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
          animateStats()
        }
      },
      { threshold: 0.5 }
    )

    const element = document.getElementById('stats-overview')
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [isVisible])

  const animateStats = () => {
    stats.forEach((stat, index) => {
      let current = 0
      const target = stat.value
      const increment = target / 100
      const duration = 2000 // 2 seconds
      const stepTime = duration / 100

      const animate = () => {
        current += increment
        if (current < target) {
          setAnimatedValues(prev => ({
            ...prev,
            [stat.id]: Math.floor(current)
          }))
          setTimeout(() => requestAnimationFrame(animate), stepTime)
        } else {
          setAnimatedValues(prev => ({
            ...prev,
            [stat.id]: target
          }))
        }
      }

      // Stagger animations
      setTimeout(() => animate(), index * 200)
    })
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toLocaleString()
  }

  return (
    <section id="stats-overview" className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-cosmic font-bold glow-text mb-4">
            🌌 Galactic Impact
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of cosmic commanders in the biggest DeFi gaming revolution on BNB Chain
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className="glass-cosmic rounded-xl p-6 text-center hover:scale-105 transition-all duration-300 cursor-pointer group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="text-4xl mb-4 group-hover:animate-bounce">
                {stat.icon}
              </div>

              {/* Value */}
              <div className={`text-3xl md:text-4xl font-bold mb-2 ${stat.color} cosmic-pulse`}>
                {isVisible ? formatNumber(animatedValues[stat.id] || 0) : '0'}
                {stat.suffix}
              </div>

              {/* Label */}
              <h3 className="text-lg font-semibold text-white mb-2">
                {stat.label}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-400 leading-relaxed">
                {stat.description}
              </p>

              {/* Hover Effect */}
              <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r from-${stat.color.split('-')[1]}-400 to-${stat.color.split('-')[1]}-600 rounded-full transform transition-all duration-1000 group-hover:scale-x-100 scale-x-0 origin-left`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Live Activity Feed */}
        <div className="mt-16">
          <div className="glass-ufo rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-cosmic font-bold glow-text">
                ⚡ Live Activity Feed
              </h3>
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm">Live</span>
              </div>
            </div>

            {/* Activity Items */}
            <div className="space-y-3 max-h-48 overflow-y-auto hide-scrollbar">
              {[
                { icon: '🛸', text: 'CosmicCommander completed "First Contact" mission', time: '2m ago', color: 'text-ufo-glow' },
                { icon: '🏆', text: 'AlienHunter earned "Diamond Hands" badge', time: '5m ago', color: 'text-purple-400' },
                { icon: '🚀', text: 'GalacticTrader claimed 500 UFO tokens', time: '7m ago', color: 'text-ufo-energy' },
                { icon: '⭐', text: 'StarExplorer reached rank #10 on leaderboard', time: '12m ago', color: 'text-ufo-beam' },
                { icon: '💎', text: 'NebulaWarrior completed "Social Invader" mission', time: '15m ago', color: 'text-ufo-glow' },
                { icon: '🌌', text: 'VoidSeeker joined the UFO invasion', time: '18m ago', color: 'text-green-400' }
              ].map((activity, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors duration-200"
                >
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">{activity.text}</p>
                  </div>
                  <div className={`text-xs ${activity.color} font-semibold`}>
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>

            {/* View More Button */}
            <div className="mt-4 pt-4 border-t border-gray-700 text-center">
              <button className="text-ufo-glow hover:text-ufo-beam transition-colors duration-200 text-sm font-semibold">
                View All Activity →
              </button>
            </div>
          </div>
        </div>

        {/* Network Status */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-cosmic rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🔗</div>
            <div className="text-lg font-bold text-ufo-glow">BNB Smart Chain</div>
            <div className="text-sm text-gray-400">Network</div>
          </div>
          
          <div className="glass-cosmic rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-lg font-bold text-green-400">Online</div>
            <div className="text-sm text-gray-400">System Status</div>
          </div>
          
          <div className="glass-cosmic rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🔄</div>
            <div className="text-lg font-bold text-ufo-beam">Real-time</div>
            <div className="text-sm text-gray-400">Updates</div>
          </div>
        </div>
      </div>
    </section>
  )
}
