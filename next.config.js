/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_ORACLE_ADDRESS: process.env.NEXT_PUBLIC_ORACLE_ADDRESS,
    NEXT_PUBLIC_BSC_TESTNET_RPC: process.env.NEXT_PUBLIC_BSC_TESTNET_RPC,
    NEXT_PUBLIC_FASTAPI_URL: process.env.NEXT_PUBLIC_FASTAPI_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/oracle/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000"
        }/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
