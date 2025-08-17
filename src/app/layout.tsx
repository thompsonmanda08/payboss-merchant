import { Metadata, Viewport } from 'next';
import './globals.css';
import localFont from 'next/font/local';
import { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

import { getAuthSession, getUserDetails } from './_actions/config-actions';
import Providers from './providers';

const inter = localFont({
  src: [
    {
      path: 'fonts/inter/100.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: 'fonts/inter/200.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: 'fonts/inter/300.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: 'fonts/inter/400.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: 'fonts/inter/500.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: 'fonts/inter/600.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: 'fonts/inter/700.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: 'fonts/inter/800.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: 'fonts/inter/900.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['inter', 'system-ui', 'arial'],
});

const description =
  'PayBoss offers cutting-edge digital tools designed to help businesses of all sizes efficiently manage their financial inflows and outflows';

export const appConfig = {
  name: 'PayBoss',
  description,
  url: 'https://bgspayboss.com',
  ogImage: 'https://bgspayboss.com/images/screenshots/dashboard.png',
  twitterImage: 'https://bgspayboss.com/images/screenshots/dashboard.png',
  creator: '@PayBoss',
};

// Separate viewport export (Next.js 15+ requirement)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  colorScheme: 'light dark',
};

// Optimized metadata for Next.js 15.3
export const metadata: Metadata = {
  metadataBase: new URL(appConfig.url),
  title: {
    template: '%s | PayBoss - Business Payment Solutions',
    default:
      'PayBoss - Gateway to Simplified Business Payments & Financial Management',
  },
  description,
  keywords: [
    'business payments',
    'financial management',
    'payment solutions',
    'invoice processing',
    'expense tracking',
    'SMB financial tools',
    'payment gateway',
    'digital payments',
    'Zambia fintech',
    'business banking',
  ],
  authors: [{ name: 'PayBoss Team', url: appConfig.url }],
  creator: 'PayBoss',
  publisher: 'PayBoss',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: appConfig.url,
    title: 'PayBoss - Streamline Your Business Payments',
    description,
    siteName: appConfig.name,
    images: [
      {
        url: appConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'PayBoss - Business Payment Solutions Dashboard',
        type: 'image/jpeg',
      },
    ],
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'PayBoss - Gateway to Simplified Business Payments',
    description,
    site: appConfig.creator,
    creator: appConfig.creator,
    images: [
      {
        url: appConfig.twitterImage,
        width: 1200,
        height: 630,
        alt: 'PayBoss Business Payment Solutions',
      },
    ],
  },

  // Icons (Next.js 15+ format)
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },

  // Manifest
  manifest: '/manifest.json',

  // App specific
  applicationName: appConfig.name,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: appConfig.name,
    startupImage: [
      {
        url: '/apple-startup-image.png',
        media: '(max-width: 768px)',
      },
    ],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    other: {
      'facebook-domain-verification': 'your-facebook-verification-code',
    },
  },

  // Canonical
  alternates: {
    canonical: appConfig.url,
    languages: {
      'en-US': appConfig.url,
      'en-GB': `${appConfig.url}/en-gb`,
    },
  },

  // Additional meta
  category: 'finance',
  classification: 'Business',
  referrer: 'origin-when-cross-origin',
};

// Structured data as a separate function for better organization
export function generateStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: appConfig.name,
    url: appConfig.url,
    logo: `${appConfig.url}/images/payboss-logo-light.png`,
    description,
    operatingSystem: 'Web Browser',
    applicationCategory: 'FinanceApplication',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    permissions: 'No special permissions required',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'ZMW',
      description: 'Free business payment management tools',
    },
    creator: {
      '@type': 'Organization',
      name: 'Bridging Gap Solutions',
      url: 'https://bgsgroup.co.zm',
      logo: `${appConfig.url}/images/payboss-logo-light.png`,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+260 211 255 910',
        email: 'fintech@bgsgroup.co.zm',
        contactType: 'Customer Service',
        availableLanguage: ['English'],
      },
    },
    sameAs: [
      'https://twitter.com/BGS-PayBoss',
      'https://www.linkedin.com/company/BGS-PayBoss',
      'https://www.facebook.com/BGS-PayBoss',
    ],
    featureList: [
      'Invoice Management',
      'Payment Processing',
      'Financial Reporting',
      'Expense Tracking',
      'Digital Receipts',
    ],
    screenshot: `${appConfig.url}/images/screenshots/dashboard.png`,
  };
}

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await getUserDetails();
  const authSession = await getAuthSession();

  const structuredData = generateStructuredData();

  return (
    <html
      lang="en"
      className={cn('h-screen scroll-smooth bg-background antialiased light')}
      suppressHydrationWarning
    >
      <body
        className={cn(
          'flex min-h-screen flex-col bg-background font-inter overflow-x-hidden',
          inter.variable,
          inter.className,
        )}
        suppressHydrationWarning
      >
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />

        <Providers authSession={authSession} session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
