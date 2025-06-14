/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',       
  trailingSlash: true,     
  images: {
    unoptimized: true      
  },
  devIndicators: false,
  
  generateBuildId: async () => {
    return Date.now().toString();
  },
  async rewrites() {
    if (process.env.NODE_ENV !== 'production') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:7006/api/:path*',
        },
      ];
    }
    return [];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    return config;
  },

};

module.exports = nextConfig;
