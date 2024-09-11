'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { NextUIProvider } from '@nextui-org/react'
import { useNetwork } from '@/hooks/useNetwork'
import { motion } from 'framer-motion'
import FirstLogin from '@/components/base/FirstLogin'
import ScreenLock, { IdleTimerContainer } from '@/components/base/ScreenLock'
// import { ThemeProvider as NextThemesProvider } from 'next-themes'

const queryClient = new QueryClient()

function Providers({ session, authSession, children }) {
  const { online } = useNetwork()

  return (
    <QueryClientProvider client={queryClient}>
      {/* <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      > */}

      <NextUIProvider locale="en-GB">
        {!online && (
          <motion.div
            whileInView={{
              y: [-20, 1],
              opacity: [0, 1],
              transition: {
                duration: 0.3,
                easings: 'easeInOut',
                stiffness: {
                  type: 'spring',
                  // stiffness: 100,
                },
              },
            }}
            className="relative -top-1 left-0 right-0 z-[999] mb-4 bg-red-500 p-2 py-4 text-xs font-bold capitalize text-white"
          >
            NETWORK ERROR: Check your internet connection and try again!
          </motion.div>
        )}
        <IdleTimerContainer authSession={authSession} />
        {children}
        {session?.user?.changePassword && <FirstLogin />}
        {authSession?.screenLocked && (
          <ScreenLock open={authSession?.screenLocked} />
        )}
      </NextUIProvider>
      {/* </NextThemesProvider> */}

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default Providers
