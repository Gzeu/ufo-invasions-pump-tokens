# 🛸 UFO Invasions: Pump Tokens

**The first blockchain gaming platform on BNB Chain that transforms meme token trading into a cosmic adventure with real rewards through NFTs, badges, and leaderboard system.**

<div align="center">
  <img src="https://img.shields.io/badge/BNB%20Chain-Mainnet-yellow?style=for-the-badge&logo=binance" alt="BNB Chain">
  <img src="https://img.shields.io/badge/Status-Development-orange?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License">
</div>

## 🎯 Project Overview

UFO Invasions combines **DeFi gaming** with **social engagement** to create an immersive experience where users complete cosmic missions, earn rewards, and climb the galactic leaderboard.

### ✨ Key Features

- 🚀 **Mission System**: Complete UFO token swaps, holding challenges, and social tasks
- 🏆 **Cosmic Leaderboard**: Real-time ranking with scoring algorithm
- 🎖️ **NFT Badge System**: Collectible achievements stored on-chain
- 💫 **Beam Airdrops**: Random reward distribution with UFO animations
- 👥 **Referral Program**: Earn bonuses from invited commanders
- 📱 **Mobile-First UI**: Responsive design with cosmic theme

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with custom cosmic theme
- **Framer Motion** - Smooth animations and UFO effects
- **Reown (WalletConnect)** - Multi-wallet BNB Chain integration

### Backend
- **Node.js + Express** - RESTful API server
- **TypeScript** - Full-stack type safety
- **Socket.io** - Real-time updates and notifications
- **MongoDB** - User data and mission cache
- **Redis** - Session management and leaderboard cache

### Blockchain
- **BNB Smart Chain (BSC)** - Main blockchain network
- **Solidity** - Smart contracts for badges and rewards
- **Hardhat** - Development and deployment framework
- **PancakeSwap API** - Swap transaction monitoring
- **BSCScan API** - Blockchain event tracking

## 🎮 Mission Categories

| Mission | Trigger | Reward | Badge | Points |
|---------|---------|--------|---------|---------|
| **First Contact** | First UFO swap | 100 UFO tokens | Rookie Defender | 30 |
| **Diamond Hands** | Hold UFO 7/30 days | 300 UFO tokens | Diamond Hands | 50 |
| **Social Invader** | Share on X/Telegram | Random beam | Promo Badge | 5 |
| **Galactic HODLer** | Hold 30+ days | Super NFT | Collector Artifact | 100 |
| **Alien Ambassador** | 10 referrals complete | 10% bonus rewards | Ambassador Badge | 10/referral |
| **Mission Commander** | Complete all missions | Legendary NFT | Commander Badge | 200 |

## 📁 Project Structure

```
ufo-invasions-pump-tokens/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Next.js pages
│   ├── api/                # API routes and backend logic
│   ├── utils/              # Utility functions
│   ├── hooks/              # Custom React hooks
│   ├── styles/             # Global styles and themes
│   └── types/              # TypeScript type definitions
├── contracts/              # Smart contracts (Solidity)
├── scripts/                # Deployment and utility scripts  
├── tests/                  # Test suites
├── docs/                   # Project documentation
└── public/                 # Static assets and images
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Git
- MetaMask or compatible wallet
- BNB testnet tokens for development

### Installation

```bash
# Clone the repository
git clone https://github.com/Gzeu/ufo-invasions-pump-tokens.git
cd ufo-invasions-pump-tokens

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### Environment Variables

```env
# Frontend
NEXT_PUBLIC_CHAIN_ID=56
NEXT_PUBLIC_RPC_URL=https://bsc-dataseed.binance.org/

# Backend
MONGODB_URI=mongodb://localhost:27017/ufo-invasions
REDIS_URL=redis://localhost:6379

# APIs
PANCAKESWAP_API_KEY=your_api_key
BSCSCAN_API_KEY=your_api_key

# Smart Contracts
BSC_PRIVATE_KEY=your_private_key
CONTRACT_ADDRESS=deployed_contract_address
```

## 📊 Development Roadmap

### Phase 1: MVP Foundation (30 days)
- [x] Project setup and repository creation
- [ ] Smart contract development
- [ ] Backend agent core logic
- [ ] Frontend cosmic UI implementation
- [ ] Wallet integration

### Phase 2: Core Features (45 days)
- [ ] BSC testnet deployment
- [ ] Mission validation system
- [ ] NFT minting functionality
- [ ] Airdrop distribution system
- [ ] Social media integration

### Phase 3: Production Launch (30 days)
- [ ] Mainnet deployment
- [ ] Security audit
- [ ] Community testing
- [ ] Marketing campaign
- [ ] Public launch

## 🎯 Target Metrics

- **Active Users**: 1,000+ daily
- **UFO Transactions**: 10,000+ weekly
- **Missions Completed**: 50,000+ total
- **NFTs Minted**: 5,000+ badges
- **Social Shares**: 20,000+ monthly

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/cosmic-feature`)
3. Commit changes (`git commit -m '🛸 Add cosmic feature'`)
4. Push to branch (`git push origin feature/cosmic-feature`)
5. Create a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [ufo-token-landing.vercel.app](https://ufo-token-landing.vercel.app/)
- **Documentation**: [Notion Workspace](https://www.notion.so/27cc2a54483581f886c0e9b0c9b63e81)
- **Project Management**: [Linear Board](https://linear.app/gpz/project/af3d04d4-f5e9-4e9f-9b5f-cec1c60cecdd)
- **Four.meme Platform**: [four.meme](https://four.meme/)

## 🛸 Join the Invasion!

Ready to become a cosmic commander? Connect your wallet and start your UFO mission today!

---

<div align="center">
  <p><strong>Built with 💜 for the cosmic community</strong></p>
  <p>© 2025 UFO Invasions: Pump Tokens</p>
</div>