/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Read at build time on Vercel/etc; falls back to localhost for local dev.
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  },
};

export default nextConfig;
