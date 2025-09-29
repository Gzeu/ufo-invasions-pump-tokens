import { NextRequest, NextResponse } from 'next/server';

/**
 * UFO Invasions MVP Middleware
 * Security, CORS, rate limiting pentru Vercel deployment
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // API Routes middleware
  if (pathname.startsWith('/api')) {
    const response = NextResponse.next();
    
    // CORS configuration
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
    response.headers.set('Access-Control-Max-Age', '86400');
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers });
    }
    
    // Basic rate limiting pentru agents (max 1 req/min)
    if (pathname.includes('/agents/')) {
      const userAgent = request.headers.get('user-agent') || '';
      const isInternalCall = userAgent.includes('axios') || userAgent.includes('node');
      
      if (!isInternalCall) {
        // External calls to agents should be limited
        response.headers.set('X-RateLimit-Limit', '1');
        response.headers.set('X-RateLimit-Remaining', '0');
      }
    }
    
    // Security headers pentru API
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    
    return response;
  }
  
  // Frontend security headers
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // CSP pentru frontend
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self' data:;
    connect-src 'self' https: wss:;
    frame-src 'self' https:;
  `.replace(/\s{2,}/g, ' ').trim();
  
  response.headers.set('Content-Security-Policy', cspHeader);
  
  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};