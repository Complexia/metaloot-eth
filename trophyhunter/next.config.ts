import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  output: 'export',
  basePath: '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/server/:path*',
        destination: 'http://127.0.0.1:8080/:path*'
      }
    ];
  }
};

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//       // Warning: This allows production builds to successfully complete even if
//       // your project has ESLint errors.
//       ignoreDuringBuilds: true,
//   },
//   output: 'export',
//   images: {
//       remotePatterns: [
//           {
//               protocol: 'https',
//               hostname: '*.supabase.co',
//               pathname: '/storage/v1/object/public/**',
//           },
//           {
//               protocol: 'https',
//               hostname: 'biz-touch-7unj.shuttle.app',
//               pathname: '/api/**',
//           },
//       ],
//   },
// };

// export default nextConfig;
