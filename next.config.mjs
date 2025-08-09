import { withSentryConfig } from "@sentry/nextjs";
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // distDir: "build",
  assetPrefix:
    process.env.NODE_ENV === "production" ? process.env.SERVER_URL : "",
  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "payboss-uat-backend.bgsgroup.co.zm",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bgspayboss.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  experimental: {},
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "sentry",
  project: "merchant-web-portal",
  sentryUrl:
    process.env.NODE_ENV == "production"
      ? process.env.SENTRY_DEV_URL
      : process.env.SENTRY_URL,

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
  tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
