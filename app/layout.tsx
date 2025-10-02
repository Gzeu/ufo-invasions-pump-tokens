import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UFO Invasions: Pump Tokens',
  description: '🛸 Blockchain gaming platform on BNB Chain with mission system, airdrops, badges and cosmic leaderboard',
  keywords: ['blockchain', 'gaming', 'bnb-chain', 'defi', 'nft', 'web3', 'crypto'],
  authors: [{ name: 'George Pricop', url: 'https://github.com/Gzeu' }],
  openGraph: {
    title: 'UFO Invasions: Pump Tokens',
    description: '🛸 Blockchain gaming platform with missions, rewards and cosmic adventures',
    url: 'https://ufo-invasions-pump-tokens.vercel.app',
    siteName: 'UFO Invasions',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UFO Invasions: Pump Tokens',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UFO Invasions: Pump Tokens',
    description: '🛸 Blockchain gaming platform with missions and rewards',
    images: ['/og-image.png'],
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-black text-white antialiased`}>
        <div className="relative min-h-screen overflow-hidden">
          {/* Cosmic Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-blue-900/20" />
          <div className="absolute inset-0 bg-[url('/stars.png')] opacity-50" />
          
          {/* Main Content */}
          <main className="relative z-10">
            {children}
          </main>
          
          {/* Cosmic Effects */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-ping" />
            <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
            <div className="absolute bottom-20 right-20 w-2 h-2 bg-pink-400 rounded-full animate-ping" />
          </div>
        </div>
      </body>
    </html>
  )
}
