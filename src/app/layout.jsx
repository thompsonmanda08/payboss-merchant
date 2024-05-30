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
