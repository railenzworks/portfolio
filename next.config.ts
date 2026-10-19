import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 90 for portfolio images: dark, textured artwork bands at the default 75
  images: { qualities: [75, 90] },
};

export default nextConfig;
