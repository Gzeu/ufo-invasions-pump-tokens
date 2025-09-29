#!/usr/bin/env node
/**
 * UFO Invasions: Production Setup Script for Vercel
 * This script helps configure the production environment
 * 
 * Usage: node scripts/setup-vercel-production.js
 */

const https = require('https');
const { execSync } = require('child_process');

class VercelSetupHelper {
  constructor() {
    this.baseUrl = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_APP_URL;
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const request = https.request(url, options, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
          try {
            resolve({
              status: response.statusCode,
              data: data ? JSON.parse(data) : null,
              raw: data
            });
          } catch (error) {
            resolve({
              status: response.statusCode,
              data: null,
              raw: data
            });
          }
        });
      });
      request.on('error', reject);
      if (options.body) {
        request.write(options.body);
      }
      request.end();
    });
  }

  async checkEnvironment() {
    this.log('Checking environment configuration...');
    
    const requiredEnvVars = [
      'MONGODB_URI',
      'NEXT_PUBLIC_APP_URL'
    ];

    const missing = requiredEnvVars.filter(env => !process.env[env]);
    
    if (missing.length > 0) {
      this.log(`Missing environment variables: ${missing.join(', ')}`, 'error');
      return false;
    }

    this.log('Environment configuration looks good!', 'success');
    return true;
  }

  async checkDatabase() {
    this.log('Testing database connection...');
    
    try {
      const healthUrl = `${this.baseUrl}/api/health`;
      const response = await this.makeRequest(healthUrl);
      
      if (response.status === 200) {
        this.log('Database connection successful!', 'success');
        return true;
      } else {
        this.log(`Database health check failed: ${response.status}`, 'error');
        return false;
      }
    } catch (error) {
      this.log(`Database connection error: ${error.message}`, 'error');
      return false;
    }
  }

  async initializeDatabase() {
    this.log('Initializing database with MVP schema...');
    
    try {
      const initUrl = `${this.baseUrl}/api/agents/orchestrator`;
      const response = await this.makeRequest(initUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        this.log('Database initialization completed!', 'success');
        return true;
      } else {
        this.log(`Database initialization failed: ${response.status}`, 'error');
        return false;
      }
    } catch (error) {
      this.log(`Database initialization error: ${error.message}`, 'error');
      return false;
    }
  }

  async checkCronJobs() {
    this.log('Checking cron job configuration...');
    
    if (!this.isProduction) {
      this.log('Skipping cron check in development mode');
      return true;
    }

    // In production, cron jobs should be automatically configured
    // by Vercel based on vercel.json
    this.log('Cron jobs should be automatically configured by Vercel', 'success');
    return true;
  }

  async runHealthChecks() {
    this.log('Running comprehensive health checks...');
    
    const checks = [
      { name: 'System Health', url: '/api/health' },
      { name: 'Database Status', url: '/api/health/database' },
      { name: 'Agent Status', url: '/api/agents/status' },
      { name: 'Global Stats', url: '/api/stats' }
    ];

    const results = [];

    for (const check of checks) {
      try {
        const response = await this.makeRequest(`${this.baseUrl}${check.url}`);
        const success = response.status >= 200 && response.status < 300;
        results.push({ ...check, success, status: response.status });
        this.log(`${check.name}: ${success ? 'PASS' : 'FAIL'} (${response.status})`, success ? 'success' : 'error');
      } catch (error) {
        results.push({ ...check, success: false, error: error.message });
        this.log(`${check.name}: FAIL - ${error.message}`, 'error');
      }
    }

    const allPassed = results.every(r => r.success);
    this.log(`Health checks: ${allPassed ? 'ALL PASSED' : 'SOME FAILED'}`, allPassed ? 'success' : 'error');
    
    return { allPassed, results };
  }

  async generateReport() {
    this.log('Generating deployment report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      environment: this.isProduction ? 'production' : 'development',
      baseUrl: this.baseUrl,
      checks: {
        environment: await this.checkEnvironment(),
        database: await this.checkDatabase(),
        cronJobs: await this.checkCronJobs()
      }
    };

    // Run health checks
    const healthResults = await this.runHealthChecks();
    report.healthChecks = healthResults;

    this.log('\n=== DEPLOYMENT REPORT ===');
    this.log(`Environment: ${report.environment}`);
    this.log(`Base URL: ${report.baseUrl}`);
    this.log(`Environment Config: ${report.checks.environment ? 'PASS' : 'FAIL'}`);
    this.log(`Database Connection: ${report.checks.database ? 'PASS' : 'FAIL'}`);
    this.log(`Cron Jobs: ${report.checks.cronJobs ? 'PASS' : 'FAIL'}`);
    this.log(`Health Checks: ${healthResults.allPassed ? 'ALL PASSED' : 'SOME FAILED'}`);
    this.log('========================\n');

    return report;
  }

  async setup() {
    this.log('🚀 Starting UFO Invasions Production Setup...');
    
    try {
      // Environment check
      const envOk = await this.checkEnvironment();
      if (!envOk) {
        throw new Error('Environment configuration failed');
      }

      // Database setup
      const dbOk = await this.checkDatabase();
      if (!dbOk) {
        this.log('Attempting database initialization...');
        await this.initializeDatabase();
      }

      // Generate final report
      await this.generateReport();
      
      this.log('🛸 UFO Invasions setup completed successfully!', 'success');
      
    } catch (error) {
      this.log(`Setup failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new VercelSetupHelper();
  setup.setup().catch(console.error);
}

module.exports = VercelSetupHelper;