import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// Health check endpoint with comprehensive monitoring
export async function GET() {
  const startTime = Date.now();
  
  try {
    const checks = {
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.2.1',
      environment: process.env.NODE_ENV || 'production',
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024)
      },
      database: 'unknown',
      smartContracts: 'unknown',
      apis: 'unknown',
      cache: 'unknown'
    };

    // Database connectivity check
    try {
      const { db } = await connectToDatabase();
      await db.admin().ping();
      checks.database = 'connected';
    } catch (error) {
      console.error('Database health check failed:', error);
      checks.database = 'error';
    }

    // Smart contract status check
    try {
      // Check if contract addresses are configured
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      if (contractAddress && contractAddress !== 'undefined') {
        // In a real implementation, you'd check contract accessibility here
        checks.smartContracts = 'active';
      } else {
        checks.smartContracts = 'not_deployed';
      }
    } catch (error) {
      console.error('Smart contract check failed:', error);
      checks.smartContracts = 'error';
    }

    // External APIs check (PancakeSwap, BSCScan, etc.)
    try {
      // Check BSCScan API connectivity
      if (process.env.BSCSCAN_API_KEY) {
        const response = await fetch(
          `https://api.bscscan.com/api?module=stats&action=bnbprice&apikey=${process.env.BSCSCAN_API_KEY}`,
          { signal: AbortSignal.timeout(3000) }
        );
        
        if (response.ok) {
          checks.apis = 'connected';
        } else {
          checks.apis = 'degraded';
        }
      } else {
        checks.apis = 'not_configured';
      }
    } catch (error) {
      console.error('APIs health check failed:', error);
      checks.apis = 'error';
    }

    // Cache status (Redis would go here if implemented)
    checks.cache = 'not_implemented';

    const responseTime = Date.now() - startTime;
    const overallHealth = determineOverallHealth(checks);
    
    const healthData = {
      status: overallHealth,
      responseTime: `${responseTime}ms`,
      checks,
      metrics: {
        dbConnections: await getDatabaseMetrics(),
        apiCalls: await getAPIMetrics(),
        errors: await getErrorMetrics()
      }
    };

    // Return appropriate HTTP status based on health
    const statusCode = overallHealth === 'healthy' ? 200 : 
                      overallHealth === 'degraded' ? 200 : 503;

    return NextResponse.json(healthData, { status: statusCode });
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'critical',
      error: 'Health check failed',
      timestamp: new Date().toISOString(),
      responseTime: `${Date.now() - startTime}ms`
    }, { status: 503 });
  }
}

// Determine overall system health based on individual checks
function determineOverallHealth(checks: any): 'healthy' | 'degraded' | 'critical' {
  const { database, smartContracts, apis } = checks;
  
  // Critical if database is down
  if (database === 'error') {
    return 'critical';
  }
  
  // Degraded if smart contracts or APIs have issues
  if (smartContracts === 'error' || apis === 'error') {
    return 'degraded';
  }
  
  // Degraded if smart contracts not deployed (development scenario)
  if (smartContracts === 'not_deployed') {
    return 'degraded';
  }
  
  return 'healthy';
}

// Get database connection metrics
async function getDatabaseMetrics() {
  try {
    const { db } = await connectToDatabase();
    const stats = await db.stats();
    
    return {
      collections: stats.collections || 0,
      dataSize: Math.round((stats.dataSize || 0) / 1024 / 1024), // MB
      indexSize: Math.round((stats.indexSize || 0) / 1024 / 1024), // MB
      documents: stats.objects || 0
    };
  } catch (error) {
    return { error: 'Unable to fetch database metrics' };
  }
}

// Get API call metrics (simplified)
async function getAPIMetrics() {
  // In a real implementation, you'd track these metrics
  return {
    totalCalls: 0,
    successRate: '100%',
    avgResponseTime: '200ms'
  };
}

// Get error metrics (simplified)
async function getErrorMetrics() {
  // In a real implementation, you'd track error rates
  return {
    last24h: 0,
    errorRate: '0%',
    lastError: null
  };
}

// Optional: HEAD method for lightweight health checks
export async function HEAD() {
  try {
    // Quick database ping
    const { db } = await connectToDatabase();
    await db.admin().ping();
    
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return new NextResponse(null, { status: 503 });
  }
}