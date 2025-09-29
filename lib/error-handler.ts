// Enhanced Error Handling and Retry System for UFO Invasions

export interface RetryConfig {
  maxAttempts: number;
  delay: number; // milliseconds
  backoffMultiplier: number;
  maxDelay: number;
  retryCondition?: (error: any) => boolean;
}

export interface OperationResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  attempts: number;
  totalTime: number;
}

// Default retry configurations for different operation types
export const RETRY_CONFIGS = {
  DATABASE: {
    maxAttempts: 3,
    delay: 1000,
    backoffMultiplier: 2,
    maxDelay: 10000,
    retryCondition: (error: any) => {
      // Retry on network errors, timeouts, connection issues
      return error.name === 'MongoNetworkError' ||
             error.name === 'MongoTimeoutError' ||
             error.code === 'ENOTFOUND' ||
             error.code === 'ECONNRESET' ||
             error.code === 'ETIMEDOUT';
    }
  },
  BLOCKCHAIN: {
    maxAttempts: 5,
    delay: 2000,
    backoffMultiplier: 1.5,
    maxDelay: 15000,
    retryCondition: (error: any) => {
      // Retry on RPC errors, network issues, rate limits
      return error.code === 'NETWORK_ERROR' ||
             error.code === 'SERVER_ERROR' ||
             error.code === 'TIMEOUT' ||
             error.message?.includes('rate limit') ||
             error.message?.includes('too many requests');
    }
  },
  API_CALLS: {
    maxAttempts: 3,
    delay: 500,
    backoffMultiplier: 2,
    maxDelay: 5000,
    retryCondition: (error: any) => {
      // Retry on 5xx errors, rate limits, network issues
      const status = error.response?.status || error.status;
      return status >= 500 || status === 429 || !status;
    }
  },
  CRITICAL: {
    maxAttempts: 5,
    delay: 1500,
    backoffMultiplier: 2,
    maxDelay: 30000,
    retryCondition: () => true // Retry all errors for critical operations
  }
};

/**
 * Enhanced retry mechanism with exponential backoff
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = RETRY_CONFIGS.DATABASE,
  operationName: string = 'Unknown Operation'
): Promise<OperationResult<T>> {
  const startTime = Date.now();
  let lastError: Error;
  let currentDelay = config.delay;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      console.log(`[${operationName}] Attempt ${attempt}/${config.maxAttempts}`);
      
      const result = await operation();
      const totalTime = Date.now() - startTime;
      
      console.log(`[${operationName}] Success on attempt ${attempt} (${totalTime}ms)`);
      
      return {
        success: true,
        data: result,
        attempts: attempt,
        totalTime
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const totalTime = Date.now() - startTime;
      
      console.error(`[${operationName}] Attempt ${attempt} failed:`, {
        error: lastError.message,
        stack: lastError.stack?.split('\n').slice(0, 3),
        totalTime
      });

      // Check if we should retry this error
      if (config.retryCondition && !config.retryCondition(lastError)) {
        console.log(`[${operationName}] Error not retryable, stopping`);
        break;
      }

      // If this is the last attempt, don't wait
      if (attempt === config.maxAttempts) {
        break;
      }

      // Wait before next attempt with exponential backoff
      const waitTime = Math.min(currentDelay, config.maxDelay);
      console.log(`[${operationName}] Waiting ${waitTime}ms before next attempt`);
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
      currentDelay *= config.backoffMultiplier;
    }
  }

  const totalTime = Date.now() - startTime;
  console.error(`[${operationName}] All attempts failed (${totalTime}ms)`);
  
  return {
    success: false,
    error: lastError,
    attempts: config.maxAttempts,
    totalTime
  };
}

/**
 * Circuit breaker pattern for critical services
 */
export class CircuitBreaker {
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000, // 1 minute
    private monitorWindow: number = 300000 // 5 minutes
  ) {}

  async execute<T>(
    operation: () => Promise<T>,
    fallback?: () => Promise<T>
  ): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
        console.log('[CircuitBreaker] Moving to HALF_OPEN state');
      } else {
        if (fallback) {
          console.log('[CircuitBreaker] Circuit OPEN, using fallback');
          return await fallback();
        }
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      console.error(`[CircuitBreaker] Circuit OPEN after ${this.failures} failures`);
    }
  }

  getState(): string {
    return this.state;
  }

  reset(): void {
    this.failures = 0;
    this.state = 'CLOSED';
    console.log('[CircuitBreaker] Circuit manually reset');
  }
}

/**
 * Error classification and logging
 */
export class ErrorClassifier {
  static classify(error: any): {
    type: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    retryable: boolean;
    requiresAlert: boolean;
  } {
    const message = error.message || String(error);
    const code = error.code || error.status;

    // Database errors
    if (error.name?.includes('Mongo') || message.includes('mongodb')) {
      return {
        type: 'DATABASE',
        severity: 'HIGH',
        retryable: true,
        requiresAlert: true
      };
    }

    // Blockchain/RPC errors
    if (message.includes('RPC') || message.includes('eth_') || code === 'NETWORK_ERROR') {
      return {
        type: 'BLOCKCHAIN',
        severity: 'MEDIUM',
        retryable: true,
        requiresAlert: false
      };
    }

    // Rate limiting
    if (code === 429 || message.includes('rate limit')) {
      return {
        type: 'RATE_LIMIT',
        severity: 'LOW',
        retryable: true,
        requiresAlert: false
      };
    }

    // Timeout errors
    if (message.includes('timeout') || code === 'ETIMEDOUT') {
      return {
        type: 'TIMEOUT',
        severity: 'MEDIUM',
        retryable: true,
        requiresAlert: false
      };
    }

    // Validation errors
    if (code === 400 || message.includes('validation')) {
      return {
        type: 'VALIDATION',
        severity: 'LOW',
        retryable: false,
        requiresAlert: false
      };
    }

    // Unknown errors
    return {
      type: 'UNKNOWN',
      severity: 'HIGH',
      retryable: true,
      requiresAlert: true
    };
  }

  static logError(error: any, context: string): void {
    const classification = this.classify(error);
    const timestamp = new Date().toISOString();

    const logEntry = {
      timestamp,
      context,
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code,
        name: error.name
      },
      classification
    };

    // Log based on severity
    switch (classification.severity) {
      case 'CRITICAL':
        console.error('🚨 CRITICAL ERROR:', logEntry);
        break;
      case 'HIGH':
        console.error('❌ HIGH ERROR:', logEntry);
        break;
      case 'MEDIUM':
        console.warn('⚠️ MEDIUM ERROR:', logEntry);
        break;
      case 'LOW':
        console.log('ℹ️ LOW ERROR:', logEntry);
        break;
    }
  }
}

/**
 * Health check utilities
 */
export class HealthChecker {
  private static checks: Map<string, () => Promise<boolean>> = new Map();

  static register(name: string, check: () => Promise<boolean>): void {
    this.checks.set(name, check);
  }

  static async runAll(): Promise<{ [key: string]: { healthy: boolean; error?: string } }> {
    const results: { [key: string]: { healthy: boolean; error?: string } } = {};

    for (const [name, check] of this.checks) {
      try {
        const healthy = await Promise.race([
          check(),
          new Promise<boolean>((_, reject) => 
            setTimeout(() => reject(new Error('Health check timeout')), 5000)
          )
        ]);
        results[name] = { healthy };
      } catch (error) {
        results[name] = { 
          healthy: false, 
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }

    return results;
  }

  static async isHealthy(): Promise<boolean> {
    const results = await this.runAll();
    return Object.values(results).every(result => result.healthy);
  }
}

// Global circuit breaker instances
export const databaseCircuitBreaker = new CircuitBreaker(3, 30000); // 3 failures, 30s timeout
export const blockchainCircuitBreaker = new CircuitBreaker(5, 60000); // 5 failures, 60s timeout

// Export utility functions
export { withRetry as retry, RETRY_CONFIGS as retryConfigs };