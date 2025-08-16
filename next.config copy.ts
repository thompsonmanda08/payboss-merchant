import { withSentryConfig } from '@sentry/nextjs';
import { NextConfig } from 'next';

const nextConfig = {
  output: 'standalone',
  // distDir: "build",
  assetPrefix: process.env.SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL,
  compress: false, // Disable compression - let reverse proxy handle it
  outputFileTracingRoot: process.cwd(), // Container-specific settings
  devIndicators: {
    autoPrerender: false,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: String(
          process.env.SERVER_URL ||
            process.env.NEXT_PUBLIC_SERVER_URL ||
            'http://localhost:3000',
        ),
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bgspayboss.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  turbopack: {
    rules: {
      // "*.svg": {
      //   loaders: ["@svgr/webpack"],
      //   as: "*.js",
      // },
    },
  },

  experimental: {
    // Disable SWC transforms that might force HTTPS
    forceSwcTransforms: false, //Disabled

    optimizePackageImports: ['lucide-react', '@heroicons/react'], // Optimize chunk splitting
  },

  // Disable webpack cache if causing issues
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.cache = false;
    }

    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxSize: 500000, // Increase max size to reduce chunk count
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }
    return config;
  },

  // Ensure static files use HTTP
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: 'upgrade-insecure-requests; block-all-mixed-content',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Content-Encoding',
            value: 'identity', // Disable chunked encoding for static files
          },
        ],
      },
      {
        source: '/_next/static/media/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Content-Type',
            value: 'font/ttf',
          },
          // Force proper content encoding
          {
            key: 'Content-Encoding',
            value: 'identity',
          },
        ],
      },
    ];
  },
} as NextConfig;

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'sentry',
  project: 'merchant-web-portal',
  sentryUrl: process.env.SENTRY_URL,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
