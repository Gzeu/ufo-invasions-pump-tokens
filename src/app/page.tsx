import { WalletButton, NetworkStatus } from '@/components/providers/WalletProvider'
import { UFOHero } from '@/components/sections/UFOHero'
import { MissionGrid } from '@/components/sections/MissionGrid'
import { LeaderboardPreview } from '@/components/sections/LeaderboardPreview'
import { StatsOverview } from '@/components/sections/StatsOverview'
import { CosmicFooter } from '@/components/sections/CosmicFooter'

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6 glass-cosmic">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-cosmic font-bold glow-text">
            🛸 UFO Invasions
          </div>
          <div className="hidden md:flex items-center space-x-1">
            <span className="text-ufo-glow font-semibold">PUMP</span>
            <span className="text-white">TOKENS</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <NetworkStatus />
          <WalletButton />
        </div>
      </nav>

      {/* Hero Section */}
      <UFOHero />

      {/* Stats Overview */}
      <StatsOverview />

      {/* Mission Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-cosmic font-bold glow-text mb-6">
              🎯 Cosmic Missions
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Complete UFO missions, earn rewards, and unlock exclusive NFT badges. 
              Each mission brings you closer to becoming a legendary commander.
            </p>
          </div>
          <MissionGrid />
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="py-20 px-6 bg-gradient-to-r from-cosmic-950/50 to-ufo-space/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-cosmic font-bold glow-text mb-6">
              🏆 Galactic Leaderboard
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Compete with cosmic commanders from across the galaxy. 
              Climb the ranks and earn legendary rewards.
            </p>
          </div>
          <LeaderboardPreview />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-cosmic rounded-2xl p-12">
            <h2 className="text-4xl md:text-5xl font-cosmic font-bold glow-text mb-6">
              Ready to Join the Invasion? 🛸
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect your wallet and start your cosmic journey. 
              Complete missions, earn rewards, and become a UFO legend.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <WalletButton />
              
              <a 
                href="#missions" 
                className="btn-cosmic px-8 py-4 text-lg font-semibold rounded-xl"
              >
                Explore Missions 🚀
              </a>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="glass-ufo rounded-lg p-4">
                <div className="text-2xl font-bold text-ufo-glow mb-2">1000+</div>
                <div className="text-sm text-gray-400">Active Commanders</div>
              </div>
              <div className="glass-ufo rounded-lg p-4">
                <div className="text-2xl font-bold text-ufo-beam mb-2">50K+</div>
                <div className="text-sm text-gray-400">Missions Completed</div>
              </div>
              <div className="glass-ufo rounded-lg p-4">
                <div className="text-2xl font-bold text-ufo-energy mb-2">5K+</div>
                <div className="text-sm text-gray-400">NFT Badges Earned</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <CosmicFooter />

      {/* Floating UFO Animation */}
      <div className="fixed bottom-8 right-8 z-40 pointer-events-none">
        <div className="text-6xl animate-ufo-hover opacity-70">
          🛸
        </div>
      </div>

      {/* Background Stars */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </main>
  )
}
