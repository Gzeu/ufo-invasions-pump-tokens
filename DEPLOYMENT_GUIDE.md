# 🚀 Deployment Guide - UFO Invasions: Pump Tokens

## Overview
Guide complet pentru deploy-ul platformei UFO Invasions pe Vercel cu MongoDB Atlas integration.

## 📋 Prerequisites

- **GitHub Account**: Repository linked to Vercel
- **Vercel Account**: Free Hobby plan (includes crons)
- **MongoDB Atlas**: Free M0 cluster (512MB)
- **Node.js**: Version 18+ (pentru development local)

## 🎯 Quick Production Deploy

### Step 1: Vercel Project Setup
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import from GitHub: `Gzeu/ufo-invasions-pump-tokens`
4. Select branch: `main`
5. Keep default settings, click **Deploy**

### Step 2: MongoDB Atlas Integration
1. In Vercel dashboard, go to your project
2. Navigate to **Integrations** tab
3. Find **MongoDB Atlas** and click **Add Integration**
4. Create new cluster or use existing `dbgzeu`
5. Connection will be auto-configured as `MONGODB_URI`

### Step 3: Environment Variables
Vercel will auto-add these via MongoDB integration:
```bash
MONGODB_URI=mongodb+srv://Vercel-Admin-dbgzeu:PASSWORD@dbgzeu.iwgoxu6.mongodb.net/ufo_invasions_db
```

Add these manually in **Project Settings > Environment Variables**:
```bash
# App Configuration
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
WEBHOOK_SECRET=your-random-secret-here

# Blockchain Configuration
REACT_APP_CONTRACT_ADDRESS=0x7650a9c4543473cb0d1c73de441360bb92374444
REACT_APP_CHAIN_ID=56
REACT_APP_RPC_URL=https://bsc-dataseed.binance.org/

# Agent Configuration
AGENT_EXECUTION_INTERVAL=240000
MAX_REWARDS_PER_EXECUTION=25
MAX_MISSIONS_PER_EXECUTION=30
BEAM_COOLDOWN_HOURS=1
REWARD_EXPIRY_HOURS=48
```

### Step 4: Initialize Database
1. Wait for deployment to complete
2. Go to your deployed app: `https://your-app.vercel.app/api/health`
3. Check if database connection is working
4. Initialize database by calling: `https://your-app.vercel.app/api/agents/orchestrator`

## 🔧 Local Development Setup

### Prerequisites
```bash
# Check Node.js version
node --version  # Should be 18+
npm --version   # Should be 8+
```

### Setup Steps
```bash
# 1. Clone repository
git clone https://github.com/Gzeu/ufo-invasions-pump-tokens.git
cd ufo-invasions-pump-tokens

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local

# 4. Edit .env.local with your MongoDB URI
# Get it from Vercel project settings
vim .env.local

# 5. Test database connection
npm run db:test

# 6. Initialize database
npm run db:init

# 7. Start development server
npm run dev
```

### Link to Vercel (Optional)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project to Vercel
vercel link

# Pull environment variables
vercel env pull .env.local
```

## 🤖 Agent System Configuration

### Cron Jobs (Auto-configured)
Vercel automatically runs these based on `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/agents/orchestrator",
      "schedule": "0 0 * * *"
    }
  ]
}
```

### Manual Agent Testing
Test agents manually via these endpoints:

```bash
# Test orchestrator (runs all agents)
curl -X POST https://your-app.vercel.app/api/agents/orchestrator

# Test individual agents
curl -X POST https://your-app.vercel.app/api/agents/mission-manager
curl -X POST https://your-app.vercel.app/api/agents/reward-processor
curl -X POST https://your-app.vercel.app/api/agents/beam-technology
```

## 📊 Monitoring & Health Checks

### Health Endpoints
```bash
# System health
GET /api/health

# Database status
GET /api/health/database

# Agent status
GET /api/agents/status

# Global stats
GET /api/stats
```

### Logs Monitoring
1. **Vercel Dashboard**: Real-time logs in Functions tab
2. **Runtime Logs**: Check for agent execution
3. **Build Logs**: Deployment issues

## 🚨 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed
```bash
# Check environment variables
vercel env ls

# Test connection locally
npm run db:test

# Check MongoDB Atlas network access (0.0.0.0/0)
```

#### 2. Cron Jobs Not Running
```bash
# Check vercel.json syntax
# Ensure no unsupported fields (like 'comment')
# Verify schedule format: "0 0 * * *"
```

#### 3. Function Timeout
```bash
# Check function duration in vercel.json:
"functions": {
  "pages/api/agents/*.ts": {
    "maxDuration": 30  // Max 30s for Hobby plan
  }
}
```

#### 4. Memory Limits
```bash
# Optimize batch processing
# Check memory settings in vercel.json
# Reduce MAX_*_PER_EXECUTION values
```

### Debug Mode
Enable debug mode by adding:
```bash
NEXT_PUBLIC_DEBUG_MODE=true
DISABLE_AGENT_AUTO_TRIGGER=true  # Disable auto-execution
```

## 🔄 CI/CD Pipeline

### Auto-Deploy on Push
Vercel automatically deploys when you push to `main` branch:

```bash
git add .
git commit -m "Update: your changes"
git push origin main
```

### Branch Deployments
Each branch gets a preview deployment:
```bash
git checkout -b feature/new-feature
git push origin feature/new-feature
# Gets deployed to: https://ufo-invasions-pump-tokens-git-feature-new-feature-gzeus.vercel.app
```

## 📈 Performance Optimization

### Vercel Limits (Hobby Plan)
- **Functions**: 1M executions/month
- **Bandwidth**: 100GB/month
- **Build Minutes**: 6,000 minutes/month
- **Cron Jobs**: 2 cron jobs max

### MongoDB Limits (Free M0)
- **Storage**: 512MB
- **Connections**: 500 concurrent
- **Network Transfer**: No limit

### Optimization Tips
1. **Connection Pooling**: Use `lib/mongodb-vercel.ts`
2. **Batch Processing**: Process 20-50 items per execution
3. **Indexed Queries**: Optimize database queries
4. **Function Duration**: Keep under 30s timeout

## 🔐 Security Considerations

### Environment Variables
- Never commit `.env` files
- Use Vercel environment variables for secrets
- Rotate API keys regularly

### Database Security
- Use strong MongoDB passwords
- Whitelist IP addresses (0.0.0.0/0 for Vercel)
- Enable MongoDB Atlas audit logging

### API Security
- Implement rate limiting
- Validate input data
- Use HTTPS only

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [UFO Invasions Repository](https://github.com/Gzeu/ufo-invasions-pump-tokens)

## 🆘 Support

If you encounter issues:
1. Check this guide first
2. Review Vercel deployment logs
3. Test locally with `npm run dev`
4. Create issue on GitHub: [Issues](https://github.com/Gzeu/ufo-invasions-pump-tokens/issues)

---

**Created by**: George Pricop (@Gzeu)  
**Last Updated**: September 29, 2025  
**Version**: 1.0.0