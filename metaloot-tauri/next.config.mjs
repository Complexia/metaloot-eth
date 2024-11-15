/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    output: 'export',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
            {
                protocol: 'https',
                hostname: 'biz-touch-7unj.shuttle.app',
                pathname: '/api/**',
            },
        ],
    },
    async headers() {
        return [
          {
            // Match all routes
            source: '/(.*)',
            headers: [
              {
                key: 'Content-Security-Policy',
                value: [
                  "default-src 'self';",
                  "connect-src 'self' https://rest-testnet.onflow.org https://biz-touch-7unj.shuttle.app;",
                  "img-src 'self' https://*.supabase.co;",
                  "script-src 'self';",
                  "style-src 'self';",
                  "frame-src 'self' https://fcl-discovery.onflow.org;", // Allow the Flow discovery URL
                ].join(' '),
              },
            ],
          },
        ];
      },
};

export default nextConfig;