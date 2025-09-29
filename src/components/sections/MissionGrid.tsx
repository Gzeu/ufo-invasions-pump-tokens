'use client'

import { useState } from 'react'

interface Mission {
  id: string
  title: string
  description: string
  icon: string
  reward: string
  badge: string
  points: number
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Legendary'
  status: 'available' | 'active' | 'completed' | 'locked'
  progress?: number
  requirement: string
}

const missions: Mission[] = [
  {
    id: 'first-contact',
    title: 'First Contact',
    description: 'Complete your first UFO token swap on PancakeSwap',
    icon: '🛸',
    reward: '100 UFO tokens',
    badge: 'Rookie Defender',
    points: 30,
    difficulty: 'Easy',
    status: 'available',
    requirement: 'Swap any amount of UFO tokens'
  },
  {
    id: 'diamond-hands',
    title: 'Diamond Hands',
    description: 'Hold UFO tokens for 7 consecutive days',
    icon: '💎',
    reward: '300 UFO tokens',
    badge: 'Diamond Hands',
    points: 50,
    difficulty: 'Medium',
    status: 'active',
    progress: 65,
    requirement: 'Hold minimum 1000 UFO for 7 days'
  },
  {
    id: 'social-invader',
    title: 'Social Invader',
    description: 'Share UFO Invasions on X (Twitter) or Telegram',
    icon: '📱',
    reward: 'Random beam reward',
    badge: 'Promo Badge',
    points: 5,
    difficulty: 'Easy',
    status: 'available',
    requirement: 'Share with #UFOInvasions hashtag'
  },
  {
    id: 'galactic-hodler',
    title: 'Galactic HODLer',
    description: 'Hold UFO tokens for 30+ days without selling',
    icon: '🌌',
    reward: 'Super NFT',
    badge: 'Collector Artifact',
    points: 100,
    difficulty: 'Hard',
    status: 'locked',
    requirement: 'Complete Diamond Hands first'
  },
  {
    id: 'alien-ambassador',
    title: 'Alien Ambassador',
    description: 'Refer 10 new commanders to join the invasion',
    icon: '👽',
    reward: '10% bonus on all rewards',
    badge: 'Ambassador Badge',
    points: 10,
    difficulty: 'Medium',
    status: 'available',
    requirement: '10 successful referrals'
  },
  {
    id: 'mission-commander',
    title: 'Mission Commander',
    description: 'Complete all available missions',
    icon: '⭐',
    reward: 'Legendary NFT',
    badge: 'Commander Badge',
    points: 200,
    difficulty: 'Legendary',
    status: 'locked',
    requirement: 'Complete all other missions'
  }
]

export function MissionGrid() {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)

  const getDifficultyColor = (difficulty: Mission['difficulty']) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 border-green-400/30 bg-green-400/10'
      case 'Medium': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
      case 'Hard': return 'text-red-400 border-red-400/30 bg-red-400/10'
      case 'Legendary': return 'text-purple-400 border-purple-400/30 bg-purple-400/10'
    }
  }

  const getStatusColor = (status: Mission['status']) => {
    switch (status) {
      case 'available': return 'border-ufo-glow/50 bg-ufo-glow/5'
      case 'active': return 'border-ufo-beam/50 bg-ufo-beam/5'
      case 'completed': return 'border-green-400/50 bg-green-400/5'
      case 'locked': return 'border-gray-600/50 bg-gray-600/5 opacity-60'
    }
  }

  const getStatusIcon = (status: Mission['status']) => {
    switch (status) {
      case 'available': return '🚀'
      case 'active': return '⚡'
      case 'completed': return '✅'
      case 'locked': return '🔒'
    }
  }

  return (
    <div className="space-y-8">
      {/* Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className={`mission-card border-2 cursor-pointer ${
              getStatusColor(mission.status)
            } ${
              selectedMission?.id === mission.id ? 'ring-2 ring-ufo-glow' : ''
            }`}
            onClick={() => setSelectedMission(mission)}
          >
            {/* Mission Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{mission.icon}</div>
                <div>
                  <h3 className="font-cosmic font-semibold text-lg text-white">
                    {mission.title}
                  </h3>
                  <div className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(mission.difficulty)}`}>
                    {mission.difficulty}
                  </div>
                </div>
              </div>
              
              <div className="text-2xl">
                {getStatusIcon(mission.status)}
              </div>
            </div>

            {/* Progress Bar (for active missions) */}
            {mission.status === 'active' && mission.progress && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Progress</span>
                  <span className="text-ufo-beam">{mission.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-ufo-glow to-ufo-beam h-2 rounded-full transition-all duration-300"
                    style={{ width: `${mission.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Mission Description */}
            <p className="text-gray-300 text-sm mb-4">
              {mission.description}
            </p>

            {/* Rewards */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Reward:</span>
                <span className="text-ufo-energy font-semibold">{mission.reward}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Badge:</span>
                <span className="text-ufo-glow">{mission.badge}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Points:</span>
                <span className="text-white font-bold">{mission.points}</span>
              </div>
            </div>

            {/* Action Button */}
            <button 
              className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                mission.status === 'available' ? 'bg-ufo-glow text-black hover:bg-ufo-glow/80' :
                mission.status === 'active' ? 'bg-ufo-beam text-white hover:bg-ufo-beam/80' :
                mission.status === 'completed' ? 'bg-green-500 text-white cursor-default' :
                'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              disabled={mission.status === 'locked' || mission.status === 'completed'}
            >
              {mission.status === 'available' && 'Start Mission'}
              {mission.status === 'active' && 'Continue Mission'}
              {mission.status === 'completed' && 'Completed'}
              {mission.status === 'locked' && 'Locked'}
            </button>
          </div>
        ))}
      </div>

      {/* Mission Details Modal */}
      {selectedMission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-cosmic rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="text-5xl">{selectedMission.icon}</div>
                <div>
                  <h2 className="text-2xl font-cosmic font-bold glow-text">
                    {selectedMission.title}
                  </h2>
                  <div className={`text-sm px-3 py-1 rounded-full border ${getDifficultyColor(selectedMission.difficulty)} inline-block`}>
                    {selectedMission.difficulty}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedMission(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Mission Details */}
            <div className="space-y-6">
              <p className="text-gray-300 text-lg leading-relaxed">
                {selectedMission.description}
              </p>

              {/* Requirements */}
              <div className="glass-ufo rounded-lg p-4">
                <h3 className="font-semibold text-ufo-glow mb-2">Requirements:</h3>
                <p className="text-gray-300">{selectedMission.requirement}</p>
              </div>

              {/* Rewards Breakdown */}
              <div className="glass-ufo rounded-lg p-4">
                <h3 className="font-semibold text-ufo-beam mb-3">Rewards:</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tokens:</span>
                    <span className="text-ufo-energy font-semibold">{selectedMission.reward}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Badge:</span>
                    <span className="text-ufo-glow">{selectedMission.badge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Points:</span>
                    <span className="text-white font-bold">{selectedMission.points}</span>
                  </div>
                </div>
              </div>

              {/* Progress (if active) */}
              {selectedMission.status === 'active' && selectedMission.progress && (
                <div className="glass-ufo rounded-lg p-4">
                  <h3 className="font-semibold text-ufo-beam mb-3">Progress:</h3>
                  <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                    <div 
                      className="bg-gradient-to-r from-ufo-glow to-ufo-beam h-3 rounded-full cosmic-pulse"
                      style={{ width: `${selectedMission.progress}%` }}
                    />
                  </div>
                  <div className="text-center text-ufo-beam font-semibold">
                    {selectedMission.progress}% Complete
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button 
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    selectedMission.status === 'available' ? 'btn-cosmic' :
                    selectedMission.status === 'active' ? 'bg-ufo-beam text-white hover:bg-ufo-beam/80' :
                    selectedMission.status === 'completed' ? 'bg-green-500 text-white cursor-default' :
                    'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={selectedMission.status === 'locked' || selectedMission.status === 'completed'}
                >
                  {selectedMission.status === 'available' && 'Start Mission 🚀'}
                  {selectedMission.status === 'active' && 'Continue Mission ⚡'}
                  {selectedMission.status === 'completed' && 'Completed ✅'}
                  {selectedMission.status === 'locked' && 'Locked 🔒'}
                </button>
                
                <button 
                  onClick={() => setSelectedMission(null)}
                  className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-600/20 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
