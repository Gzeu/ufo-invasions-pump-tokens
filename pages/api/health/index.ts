import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase, checkConnection } from '../../../lib/mongodb';
import { HealthChecker } from '../../../lib/error-handler';

// Register health checks
HealthChecker.register('mongodb', async () => {
  return await checkConnection();
});

HealthChecker.register('environment', async () => {
  const requiredEnvs = [
    'MONGODB_URI',
    'NEXT_PUBLIC_APP_URL',
    'REACT_APP_CONTRACT_ADDRESS'
  ];
  
  return requiredEnvs.every(env => !!process.env[env]);
});

HealthChecker.register('database_collections', async () => {
  try {
    const db = await getDatabase();
    const collections = ['users', 'missions', 'rewards', 'leaderboard', 'beam_events'];
    
    for (const collectionName of collections) {
      const collection = db.collection(collectionName);
      await collection.findOne({}, { limit: 1 });
    }
    
    return true;
  } catch (error) {
    return false;
  }
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const startTime = Date.now();
    const results = await HealthChecker.runAll();
    const responseTime = Date.now() - startTime;
    
    const overallHealth = Object.values(results).every(result => result.healthy);
    
    const healthStatus = {
      status: overallHealth ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      version: process.env.npm_package_version || '0.2.0',
      environment: process.env.NODE_ENV || 'unknown',
      deployment: {
        platform: 'vercel',
        region: process.env.VERCEL_REGION || 'unknown',
        url: process.env.NEXT_PUBLIC_APP_URL
      },
      checks: results,
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      }
    };

    // Return appropriate HTTP status
    const statusCode = overallHealth ? 200 : 503;
    
    return res.status(statusCode).json(healthStatus);
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    return res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      checks: { system: { healthy: false, error: 'Health check system failed' } }
    });
  }
}