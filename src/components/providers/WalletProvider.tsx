'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { WagmiProvider } from 'wagmi'
import { bsc, bscTestnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 1. Get projectId from environment
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

// 2. Create wagmiConfig
const metadata = {
  name: 'UFO Invasions: Pump Tokens',
  description: 'Cosmic gaming meets DeFi on BNB Chain',
  url: 'https://ufo-invasions.com',
  icons: ['https://ufo-invasions.com/icon.png']
}

const chains = [bsc, bscTestnet] as const

const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
})

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': '#00ffff',
    '--w3m-color-mix-strength': 20,
    '--w3m-font-family': 'Inter, sans-serif',
    '--w3m-border-radius-master': '12px'
  }
})

// 4. Create query client
const queryClient = new QueryClient()

// Wallet Context
interface WalletContextType {
  isConnected: boolean
  address: string | null
  balance: string | null
  chainId: number | null
  isCorrectChain: boolean
  connectWallet: () => void
  disconnectWallet: () => void
  switchToCorrectChain: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isCorrectChain, setIsCorrectChain] = useState(false)

  // Check if we're on the correct chain (BSC Mainnet or Testnet)
  useEffect(() => {
    const correctChains = [56, 97] // BSC Mainnet and Testnet
    setIsCorrectChain(chainId ? correctChains.includes(chainId) : false)
  }, [chainId])

  const connectWallet = () => {
    // This will be handled by the Web3Modal
    console.log('Connect wallet triggered')
  }

  const disconnectWallet = () => {
    // This will be handled by the Web3Modal
    console.log('Disconnect wallet triggered')
    setIsConnected(false)
    setAddress(null)
    setBalance(null)
    setChainId(null)
  }

  const switchToCorrectChain = () => {
    // This will be handled by the wagmi hook
    console.log('Switch to correct chain triggered')
  }

  const value = {
    isConnected,
    address,
    balance,
    chainId,
    isCorrectChain,
    connectWallet,
    disconnectWallet,
    switchToCorrectChain,
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletContext.Provider value={value}>
          {children}
        </WalletContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

// Custom hook to use wallet context
export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

// Wallet Connection Component
export function WalletButton() {
  const { isConnected, address, isCorrectChain } = useWallet()
  
  if (!isConnected) {
    return (
      <w3m-button />
    )
  }

  return (
    <div className="flex items-center space-x-3">
      {!isCorrectChain && (
        <div className="px-3 py-1 bg-red-500/20 text-red-300 text-sm rounded-lg border border-red-500/30">
          Wrong Network
        </div>
      )}
      
      <div className="flex items-center space-x-2 glass-cosmic px-4 py-2 rounded-lg">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-sm font-mono">
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
        </span>
      </div>
      
      <w3m-button />
    </div>
  )
}

// Network Status Component
export function NetworkStatus() {
  const { chainId, isCorrectChain } = useWallet()
  
  const getNetworkName = (chainId: number | null) => {
    switch (chainId) {
      case 56:
        return 'BSC Mainnet'
      case 97:
        return 'BSC Testnet'
      default:
        return 'Unknown Network'
    }
  }
  
  return (
    <div className={`px-3 py-1 text-xs rounded-full border ${
      isCorrectChain 
        ? 'bg-green-500/20 text-green-300 border-green-500/30' 
        : 'bg-red-500/20 text-red-300 border-red-500/30'
    }`}>
      {getNetworkName(chainId)}
    </div>
  )
}
