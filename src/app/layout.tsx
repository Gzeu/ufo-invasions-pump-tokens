import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import './globals.css'
import { WalletProvider } from '@/components/providers/WalletProvider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })
const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-cosmic'
})

export const metadata: Metadata = {
  title: 'UFO Invasions: Pump Tokens | Cosmic Gaming on BNB Chain',
  description: 'Transform meme token trading into a cosmic adventure. Complete UFO missions, earn rewards, and climb the galactic leaderboard on BNB Smart Chain.',
  keywords: ['UFO', 'DeFi', 'Gaming', 'BNB Chain', 'Rewards', 'NFT', 'Blockchain'],
  authors: [{ name: 'UFO Invasions Team' }],
  openGraph: {
    title: 'UFO Invasions: Pump Tokens',
    description: 'Cosmic gaming meets DeFi on BNB Chain',
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UFO Invasions: Pump Tokens',
    description: 'Cosmic gaming meets DeFi on BNB Chain',
    images: ['/og-image.png'],
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#00d2ff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.className} ${orbitron.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-space-gradient min-h-screen text-white antialiased">
        <WalletProvider>
          <div className="relative overflow-hidden">
            {/* Space Background Pattern */}
            <div className="fixed inset-0 bg-space-pattern opacity-20 pointer-events-none" />
            
            {/* Cosmic Gradient Overlay */}
            <div className="fixed inset-0 bg-gradient-to-br from-cosmic-950/80 via-ufo-space/90 to-cosmic-950/80 pointer-events-none" />
            
            {/* Main Content */}
            <div className="relative z-10">
              {children}
            </div>
            
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: 'bg-cosmic-800/90 text-white border border-ufo-glow/20 backdrop-blur-sm',
                success: {
                  iconTheme: {
                    primary: '#00ffff',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ff4757',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </div>
        </WalletProvider>
      </body>
    </html>
  )
}
