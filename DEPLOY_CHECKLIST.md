# 🚀 UFO Invasions: Deploy Checklist

## Pre-Deploy Verification ✓

### 1. Environment Setup
- [ ] **MongoDB Atlas Connected**: Cluster `dbgzeu` configured with Vercel integration
- [ ] **Environment Variables**: All required vars set in Vercel dashboard
- [ ] **Network Access**: MongoDB whitelisted `0.0.0.0/0` for Vercel
- [ ] **Database User**: `Vercel-Admin-dbgzeu` has readWrite permissions

### 2. Dependencies & Build
- [ ] **Node.js Version**: 18+ confirmed in `package.json` engines
- [ ] **Dependencies Installed**: Run `npm install` locally first
- [ ] **TypeScript Check**: Run `npm run type-check` passes
- [ ] **Build Test**: Run `npm run build` succeeds locally

### 3. Error Handling System
- [ ] **Enhanced Error Handler**: `lib/error-handler.ts` implemented
- [ ] **Health Monitoring**: `/api/health` endpoint functional
- [ ] **Circuit Breakers**: Database and blockchain circuit breakers configured
- [ ] **Retry Logic**: All critical operations wrapped with `withRetry()`

## Deploy Process 🛸

### Step 1: Vercel Project Setup
```bash
# Link to existing Vercel project
vercel link

# Pull environment variables
vercel env pull .env.local

# Test local build
npm run build
```

### Step 2: MongoDB Atlas Integration
1. Go to Vercel Dashboard → Your Project → Integrations
2. Add **MongoDB Atlas** integration
3. Select cluster `dbgzeu` or create new M0 free tier
4. Verify `MONGODB_URI` appears in Environment Variables
5. Test connection: `npm run db:test`

### Step 3: Deploy to Vercel
```bash
# Deploy from CLI (recommended)
vercel --prod

# OR push to main branch (auto-deploy)
git push origin main
```

### Step 4: Post-Deploy Verification

#### Health Checks
```bash
# System health
curl https://your-app.vercel.app/api/health

# Database connection
curl https://your-app.vercel.app/api/health/database

# Agent status
curl https://your-app.vercel.app/api/agents/status
```

#### Expected Responses:
- **Health**: `{"status":"healthy","timestamp":"..."}` (200)
- **Database**: `{"connected":true,"responseTime":"...ms"}` (200)
- **Agents**: `{"orchestrator":"ready","agents":[...]}` (200)

## Critical Environment Variables ⚙️

### Required (Must Set)
```bash
MONGODB_URI=mongodb+srv://Vercel-Admin-dbgzeu:PASSWORD@dbgzeu.iwgoxu6.mongodb.net/ufo_invasions_db
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Optional (Performance)
```bash
# Agent Configuration
AGENT_EXECUTION_INTERVAL=240000
MAX_REWARDS_PER_EXECUTION=25
MAX_MISSIONS_PER_EXECUTION=30
BEAM_COOLDOWN_HOURS=1
REWARD_EXPIRY_HOURS=48

# Error Handling
RETRY_MAX_ATTEMPTS=3
CIRCUIT_BREAKER_THRESHOLD=5
HEALTH_CHECK_INTERVAL=300000

# Blockchain (Optional - for live features)
REACT_APP_CONTRACT_ADDRESS=0x7650a9c4543473cb0d1c73de441360bb92374444
REACT_APP_CHAIN_ID=56
REACT_APP_RPC_URL=https://bsc-dataseed.binance.org/
```

## Error Handling Features 🛡️

### 1. Retry Mechanisms
- **Database Operations**: 3 attempts, exponential backoff
- **Blockchain Calls**: 5 attempts, 1.5x backoff multiplier
- **API Calls**: 3 attempts, 2x backoff multiplier
- **Critical Operations**: 5 attempts, 30s max delay

### 2. Circuit Breakers
- **Database**: 3 failures → 30s timeout
- **Blockchain**: 5 failures → 60s timeout
- **Automatic Recovery**: Half-open state testing

### 3. Health Monitoring
- **Real-time Status**: `/api/health` endpoint
- **System Metrics**: Memory, uptime, response time
- **Database Health**: Connection, collection access
- **Environment Check**: Required variables validation

### 4. Error Classification
- **Automatic Categorization**: Database, Blockchain, API, Timeout
- **Severity Levels**: LOW, MEDIUM, HIGH, CRITICAL
- **Smart Logging**: Contextual error information
- **Alert Thresholds**: Critical errors trigger notifications

## Monitoring & Observability 📊

### Real-time Dashboards
```bash
# System overview
GET /api/monitoring/dashboard

# Agent execution history
GET /api/monitoring/agents

# Error logs and metrics
GET /api/monitoring/errors
```

### Key Metrics to Watch
- **Agent Success Rate**: >95% expected
- **Database Response Time**: <500ms average
- **Memory Usage**: <80% of allocated
- **Error Rate**: <1% of total requests
- **Uptime**: >99.9% target

## Troubleshooting 🔧

### Common Issues

#### 1. MongoDB Connection Failed
```bash
# Check environment
vercel env ls | grep MONGODB

# Test locally
npm run db:test

# Verify Atlas settings
# - Network Access: 0.0.0.0/0
# - Database User: readWrite permissions
# - Cluster Status: Available
```

#### 2. Agent Execution Failures
```bash
# Check orchestrator logs
curl https://your-app.vercel.app/api/agents/orchestrator

# Manual agent test
curl -X POST https://your-app.vercel.app/api/agents/mission-manager

# Review execution history
curl https://your-app.vercel.app/api/monitoring/agents
```

#### 3. Memory/Timeout Issues
```bash
# Check system health
curl https://your-app.vercel.app/api/health

# Review function configuration
# Verify vercel.json settings:
# - maxDuration: 30s
# - memory: 1024MB for agents
```

#### 4. Build/Deploy Failures
```bash
# Local build test
npm run build

# TypeScript validation
npm run type-check

# Check Vercel build logs
vercel logs --follow
```

## Performance Optimization ⚡

### Vercel Limits (Hobby Plan)
- **Functions**: 1M executions/month
- **Bandwidth**: 100GB/month
- **Build Minutes**: 6,000 minutes/month
- **Cron Jobs**: 2 maximum
- **Function Duration**: 30s max

### MongoDB Limits (M0 Free)
- **Storage**: 512MB
- **Connections**: 500 concurrent
- **Operations**: No limits
- **Network Transfer**: No limits

### Optimization Tips
1. **Connection Pooling**: maxPoolSize: 10 configured
2. **Batch Processing**: 20-50 items per agent execution
3. **Indexed Queries**: Optimize database performance
4. **Timeout Management**: 30s function limit compliance
5. **Memory Efficiency**: Monitor heap usage <80%

## Success Criteria ✅

### Deploy Complete When:
- [ ] **Health Check**: `/api/health` returns 200 OK
- [ ] **Database**: Connection established and collections accessible
- [ ] **Agents**: Orchestrator completes full cycle
- [ ] **Monitoring**: Dashboard shows system metrics
- [ ] **Error Handling**: Retry mechanisms functional
- [ ] **Cron Jobs**: Daily orchestrator execution scheduled
- [ ] **Performance**: Response times <2s for all endpoints

### Production Ready When:
- [ ] **Uptime**: >99% over 24-hour period
- [ ] **Agent Success**: >95% execution success rate
- [ ] **Error Rate**: <1% of total requests
- [ ] **Memory Stable**: <80% usage consistently
- [ ] **Database Performance**: <500ms average query time

---

**Deploy Command Summary:**
```bash
# Complete deployment
git add . && git commit -m "Production ready with enhanced error handling" && git push origin main

# Verify deployment
curl https://your-app.vercel.app/api/health && echo "\n\n🚀 UFO Invasions: Ready for Launch!"
```

**Created by**: George Pricop (@Gzeu)  
**Last Updated**: September 29, 2025  
**Version**: 2.0.0