# UFO Invasions MVP Deployment Guide

## 🚀 Quick Deployment to Vercel

### Prerequisites
- Vercel account connected to GitHub
- MongoDB Atlas account (free tier)

### Step 1: MongoDB Atlas Setup
1. Go to [Vercel Marketplace MongoDB Integration](https://vercel.com/integrations/mongodb-atlas)
2. Click "Add Integration" și conectează cu Vercel project
3. Creează nou cluster (M0 Free) sau conectează existent
4. Integration-ul va seta automat `MONGODB_URI` în Vercel env vars

### Step 2: Environment Variables
Set up in Vercel Dashboard > Project > Settings > Environment Variables:

```bash
# Auto-set by MongoDB integration
MONGODB_URI=mongodb+srv://...

# Required
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
WEBHOOK_SECRET=generate-strong-secret

# Blockchain (use existing or set new)
REACT_APP_CONTRACT_ADDRESS=0x7650a9c4543473cb0d1c73de441360bb92374444
REACT_APP_CHAIN_ID=56
REACT_APP_RPC_URL=https://bsc-dataseed.binance.org/
REACT_APP_EXPLORER_URL=https://bscscan.com

# Optional
NEXT_PUBLIC_DEBUG_MODE=false
REACT_APP_E2E_MOCK_CHAIN=false
```

### Step 3: Deploy
1. **Merge MVP branch to main:**
   ```bash
   git checkout main
   git merge mvp-unified-deployment
   git push origin main
   ```

2. **Or deploy direct from branch:**
   - Vercel Dashboard > Project > Git > Change branch to `mvp-unified-deployment`
   - Trigger deployment

### Step 4: Initialize Database
Après deployment:
1. Run database initialization:
   ```bash
   # Local
   npm run db:init
   
   # Or call API endpoint
   curl -X POST https://your-app.vercel.app/api/agents/orchestrator
   ```

### Step 5: Verify Deployment
1. **Health check:**
   ```
   GET https://your-app.vercel.app/health
   ```

2. **Test APIs:**
   ```bash
   # Stats
   curl https://your-app.vercel.app/api/stats
   
   # Missions
   curl https://your-app.vercel.app/api/missions
   
   # Leaderboard
   curl https://your-app.vercel.app/api/leaderboard
   ```

3. **Test agents:**
   ```bash
   # Manual trigger
   curl -X POST https://your-app.vercel.app/api/agents/orchestrator
   ```

## ⚙️ Vercel Configuration

### Cron Jobs (2 max in free tier)
- **Every 4 hours:** Full orchestrator (`/api/agents/orchestrator`)
- **Every 15 minutes:** Reward processor (`/api/agents/reward-processor`)

### Function Limits
- **Agents:** 30s max duration, 1GB memory
- **Regular APIs:** 10s max duration, 512MB memory
- **Total:** 1M requests/month, 100GB bandwidth

### Monitoring
- **Logs:** Vercel Dashboard > Functions > View Logs
- **Analytics:** Vercel Analytics (optional)
- **Health:** `/health` endpoint

## 🛠️ Troubleshooting

### Common Issues

1. **MongoDB connection fails:**
   - Verify `MONGODB_URI` in Vercel env vars
   - Check MongoDB Atlas IP whitelist (allow all: 0.0.0.0/0)
   - Ensure cluster is running (not paused)

2. **Agents timeout:**
   - Check Vercel function logs
   - Verify cron job configuration
   - Test manually with `/api/agents/orchestrator`

3. **Build fails:**
   ```bash
   # Local test
   npm run build
   npm run type-check
   ```

4. **Environment variables missing:**
   ```bash
   # Pull from Vercel
   vercel env pull .env.local
   
   # Test locally
   npm run db:test
   ```

### Performance Optimization

1. **Database connection pooling:**
   - Singleton pattern implemented în `lib/mongodb.ts`
   - Max 10 connections per serverless function
   - Connection reuse between requests

2. **Agent execution:**
   - Limited batch sizes (20-30 items per run)
   - Execution time monitoring
   - Graceful timeouts and error handling

3. **API response caching:**
   - Leaderboard: cache 5 minutes
   - Stats: cache 10 minutes
   - Missions: cache 1 hour

## 🔄 Alternative Deployment Options

### If Vercel limits are exceeded:

1. **Render.com (free tier):**
   - Unlimited cron jobs
   - 750 hours/month
   - Better for heavy agent processing

2. **Railway.app:**
   - $5/month starter
   - Better performance
   - More flexible cron jobs

3. **Supabase + Vercel:**
   - Supabase pentru database + edge functions
   - Vercel pentru frontend
   - Real-time subscriptions

## 🎆 MVP Features Included

### Core APIs
- ✅ User registration/management
- ✅ Mission system with progress tracking
- ✅ Reward distribution (USDT/UFO/NFT/Badges)
- ✅ Leaderboard with multiple categories
- ✅ Global statistics dashboard

### Agents (Background Processing)
- ✅ Mission Manager - tracks user progress
- ✅ Reward Processor - distributes rewards
- ✅ Beam Technology - random airdrops
- ✅ Orchestrator - coordinates all agents

### Infrastructure
- ✅ MongoDB Atlas integration
- ✅ Vercel serverless deployment
- ✅ Automated cron jobs
- ✅ Error handling and monitoring
- ✅ CORS and security headers
- ✅ Health checks and diagnostics

MVP este complet functional și ready pentru production deployment pe Vercel!