import { Inter, Lexend } from 'next/font/google'

import '@/styles/tailwind.css'
import { Toaster } from 'react-hot-toast'
import { cn } from '@/lib/utils'
import Providers from './providers'

export const metadata = {
  title: {
    template: '%s - PayBoss',
    default: 'PayBoss - Gateway to simplified payments',
  },
  description:
    'PayBoss offers cutting-edge digital tools designed to help businesses of all sizes efficiently manage their financial inflows and outflows',
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
})

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={cn(
        'h-full scroll-smooth bg-white antialiased',
        inter.variable,
        lexend.variable,
      )}
    >
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="flex h-full flex-col">
        <Providers>
          {children}
          <Toaster
            toastOptions={{
              duration: 3000,
            }}
            position="top-center"
            containerClassName="z-[10000000!important]"
          />
        </Providers>
      </body>
    </html>
  )
}
