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

export const metadata = {
  title: {
    template: '%s - PayBoss',
    default: 'PayBoss - Gateway to simplified payments',
  },
  description,
  manifest: '/manifest.json',
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await getUserDetails();
  const authSession = await getAuthSession();

  return (
    <html
      className={cn('h-screen scroll-smooth bg-background antialiased light')}
      lang="en"
    >
      <head>
        <link href="/manifest.json" rel="manifest" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <meta content="#da532c" name="msapplication-TileColor" />

        <meta
          content="#ffffff"
          media="(prefers-color-scheme: light)"
          name="theme-color"
        />
        <meta
          content="#000000"
          media="(prefers-color-scheme: dark)"
          name="theme-color"
        />
        <meta
          content="upgrade-insecure-requests"
          httpEquiv="Content-Security-Policy"
        />
        <link href="/apple-icon.png" rel="apple-touch-icon" />
        {/* Structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'BGS PayBoss',
            description,
            url: 'https://bgspayboss.com',
            applicationCategory: 'Marketplace',
            operatingSystem: 'Web',
          })}
        </script>
      </head>
      <body
        className={cn(
          'flex min-h-screen flex-col bg-background font-inter overflow-x-hidden',
          inter.variable,
          inter.className,
        )}
      >
        <Providers authSession={authSession} session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
