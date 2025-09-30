/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Removed 'appDir' as it's default in Next.js 14
    serverComponentsExternalPackages: ['mongoose']
  },
  webpack: (config, { isServer }) => {
    // MSW setup for browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false
      }
    }
    // Additional externals for production
    config.externals.push('pino-pretty', 'encoding');
    return config;
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXT_PUBLIC_BSC_RPC: process.env.NEXT_PUBLIC_BSC_RPC,
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  }
}

module.exports = nextConfig