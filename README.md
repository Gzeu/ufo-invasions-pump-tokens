# 🛸 UFO Invasions: Pump Tokens - MVP

**Blockchain gaming platform cu mission system, rewards și leaderboard pe BNB Chain**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FGzeu%2Fufo-invasions-pump-tokens&branch=mvp-unified-deployment)

## ✨ MVP Features

### 🎮 Core Gaming
- **Interactive games** cu reward system
- **Mission tracking** și progress monitoring  
- **NFT minting** pentru achievements
- **Wallet integration** (MetaMask, WalletConnect)

### 💰 Reward System
- **Multi-currency rewards:** USDT, UFO tokens, NFTs, Badges
- **Automated distribution** via smart contracts
- **Beam Technology:** Random airdrops pentru active users
- **Expiry management** cu claim timeouts

### 🏆 Leaderboard & Social
- **Multi-category leaderboards:** Overall, Games, Trading, Referrals
- **Real-time rankings** cu period filters
- **Social integration:** Twitter, Discord, Telegram
- **Badge system** pentru achievements

### 🤖 Background Agents
- **Mission Manager:** Tracks user progress și awards completion
- **Reward Processor:** Distributes pending rewards  
- **Beam Technology:** Generates random airdrops
- **Orchestrator:** Coordinates all agent execution

## 🚀 Quick Start

### Development
```bash
# Clone și install
git clone https://github.com/Gzeu/ufo-invasions-pump-tokens.git
cd ufo-invasions-pump-tokens
git checkout mvp-unified-deployment
npm install

# Environment setup
cp .env.example .env.local
# Edit .env.local with your MongoDB URI

# Test database connection
npm run db:test

# Initialize database
npm run db:init

# Start development server
npm run dev
```

### Production Deployment pe Vercel
1. **Connect GitHub repo** în Vercel Dashboard
2. **Set branch** la `mvp-unified-deployment` 
3. **Configure MongoDB Atlas** prin Vercel Marketplace
4. **Deploy și test** agents via `/api/agents/orchestrator`

Detailed guide: [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📊 API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `GET /api/users/[walletAddress]` - Get user profile
- `PATCH /api/users/[walletAddress]` - Update user data

### Missions  
- `GET /api/missions` - List available missions
- `POST /api/missions/participate` - Join mission

### Rewards
- `GET /api/rewards` - List user rewards
- `POST /api/rewards/claim` - Claim reward

### Leaderboard
- `GET /api/leaderboard?period=daily|weekly|monthly|all-time&category=overall|games|trading|referrals`

### Stats
- `GET /api/stats` - Global platform statistics
- `GET /api/health` - System health check

### Agents (Background Processing)
- `POST /api/agents/mission-manager` - Process mission progress
- `POST /api/agents/reward-processor` - Distribute pending rewards  
- `POST /api/agents/beam-technology` - Generate random airdrops
- `POST /api/agents/orchestrator` - Run all agents

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework cu App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling și cosmic theme
- **Framer Motion** - Animations și beam effects
- **Wagmi + Viem** - Web3 wallet connections

### Backend
- **Next.js API Routes** - Serverless functions
- **MongoDB Atlas** - Database (free M0 cluster)
- **Vercel Crons** - Automated agent execution
- **Axios** - Internal API calls

### Blockchain
- **BNB Chain** - Smart contracts deployment
- **Hardhat** - Development și deployment framework  
- **Ethers.js** - Blockchain interactions
- **Four.meme** - Token launch platform integration

### Testing
- **Jest + RTL** - Unit și integration testing
- **Playwright** - E2E testing cu mock blockchain
- **MSW** - API mocking pentru development

## 🖒 Free Tier Optimizations

### Vercel Limits Respected
- **1M requests/month** - efficient API design
- **2 cron jobs max** - orchestrator + processor
- **100GB bandwidth** - optimized payloads
- **30s function timeout** - chunked processing

### MongoDB Atlas Free
- **512MB storage** - optimized schemas
- **Connection pooling** - singleton pattern
- **Index optimization** - query performance

### Smart Agent Design
- **Batch processing** - 20-50 items per execution
- **Time monitoring** - graceful timeouts
- **Probabilistic execution** - beam technology 20% chance
- **Error resilience** - individual failure handling

## 📊 Current Status

- ✅ **Frontend:** Cosmic UI cu wallet integration
- ✅ **Backend:** Complete API suite cu MongoDB
- ✅ **Agents:** Automated background processing
- ✅ **Database:** Optimized schemas cu indexes
- ✅ **Deploy Config:** Vercel-ready cu cron jobs
- ✅ **Testing:** Comprehensive test suite

**Ready for production deployment pe Vercel!** 🛸

## 🔗 Links

- **Repository:** [GitHub](https://github.com/Gzeu/ufo-invasions-pump-tokens)
- **Live Demo:** [Vercel App](https://ufo-invasions-pump-tokens.vercel.app)
- **Token on Four.meme:** [UFO Token](https://four.meme/token/0x7650a9c4543473cb0d1c73de441360bb92374444)
- **Documentation:** [Full Docs](./ENHANCED_FEATURES.md)

---

**Created by:** George Pricop ([Gzeu](https://github.com/Gzeu))  
**License:** MIT  
**Version:** 0.2.0 MVP