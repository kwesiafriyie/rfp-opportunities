/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // Configure API proxy for development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*', // Proxy API requests to FastAPI
      },
    ];
  },
  
  // Configure webpack
  webpack: (config, { isServer }) => {
    // Important: return the modified config
    return config;
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
};

export default nextConfig;
