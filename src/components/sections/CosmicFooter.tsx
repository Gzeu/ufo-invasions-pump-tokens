'use client'

export function CosmicFooter() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    platform: [
      { name: 'Missions', href: '#missions' },
      { name: 'Leaderboard', href: '#leaderboard' },
      { name: 'NFT Badges', href: '#badges' },
      { name: 'Referrals', href: '#referrals' }
    ],
    resources: [
      { name: 'Documentation', href: 'https://docs.ufo-invasions.com' },
      { name: 'Whitepaper', href: '/whitepaper.pdf' },
      { name: 'API', href: '/api' },
      { name: 'Help Center', href: '/help' }
    ],
    community: [
      { name: 'Twitter/X', href: 'https://x.com/ufo_invasions' },
      { name: 'Telegram', href: 'https://t.me/ufo_invasions' },
      { name: 'Discord', href: 'https://discord.gg/ufo-invasions' },
      { name: 'GitHub', href: 'https://github.com/Gzeu/ufo-invasions-pump-tokens' }
    ],
    legal: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Disclaimer', href: '/disclaimer' }
    ]
  }

  return (
    <footer className="relative py-16 px-6 mt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-cosmic-950 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="text-4xl animate-ufo-hover">🛸</div>
              <div>
                <h3 className="text-2xl font-cosmic font-bold glow-text">
                  UFO Invasions
                </h3>
                <p className="text-ufo-glow font-semibold">PUMP TOKENS</p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              Transform your meme token trading into an epic cosmic adventure. 
              Complete UFO missions, earn exclusive rewards, and dominate the galactic leaderboard on BNB Smart Chain.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: '🐦', href: 'https://x.com/ufo_invasions', label: 'Twitter/X' },
                { icon: '✉️', href: 'https://t.me/ufo_invasions', label: 'Telegram' },
                { icon: '🎮', href: 'https://discord.gg/ufo-invasions', label: 'Discord' },
                { icon: '💻', href: 'https://github.com/Gzeu/ufo-invasions-pump-tokens', label: 'GitHub' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full glass-cosmic flex items-center justify-center hover:scale-110 transition-all duration-300 group"
                  title={social.label}
                >
                  <span className="text-xl group-hover:animate-bounce">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-lg font-cosmic font-semibold text-ufo-glow mb-4">
              Platform
            </h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-ufo-glow transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-lg font-cosmic font-semibold text-ufo-beam mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : '_self'}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-gray-300 hover:text-ufo-beam transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="text-lg font-cosmic font-semibold text-ufo-energy mb-4">
              Community
            </h4>
            <ul className="space-y-3">
              {footerLinks.community.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-ufo-energy transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="glass-cosmic rounded-xl p-6 mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-xl font-cosmic font-bold glow-text mb-2">
              📡 Stay Updated on the Invasion
            </h4>
            <p className="text-gray-300 mb-6">
              Get the latest mission updates, exclusive rewards, and cosmic news delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-black/50 border border-gray-600 text-white placeholder-gray-400 focus:border-ufo-glow focus:ring-1 focus:ring-ufo-glow focus:outline-none transition-all duration-200"
              />
              <button className="btn-cosmic px-6 py-3 rounded-lg whitespace-nowrap">
                Join Fleet 🚀
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} UFO Invasions: Pump Tokens. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Built with 💜 for the cosmic community on BNB Smart Chain
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              {footerLinks.legal.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-gray-300 transition-colors duration-200 text-xs"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Network Info */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-4 glass-ufo rounded-full px-6 py-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-300">Connected to BNB Smart Chain</span>
            </div>
            <div className="w-px h-4 bg-gray-600" />
            <div className="text-sm text-gray-400">
              Contract: 0x1234...5678
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-8 left-8 opacity-30">
        <div className="text-3xl animate-float">✨</div>
      </div>
      <div className="absolute top-16 right-12 opacity-30">
        <div className="text-2xl animate-float" style={{ animationDelay: '1s' }}>🌌</div>
      </div>
      <div className="absolute bottom-8 left-16 opacity-30">
        <div className="text-4xl animate-float" style={{ animationDelay: '2s' }}>⭐</div>
      </div>
    </footer>
  )
}
