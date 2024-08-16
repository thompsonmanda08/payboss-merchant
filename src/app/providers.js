'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { NextUIProvider } from '@nextui-org/react'
import { useNetwork } from '@/hooks/useNetwork'
import { motion } from 'framer-motion'
// import { ThemeProvider as NextThemesProvider } from 'next-themes'

const queryClient = new QueryClient()

function Providers({ children }) {
  const { online } = useNetwork()
  return (
    <QueryClientProvider client={queryClient}>
      {/* <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      > */}

      <NextUIProvider>
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
            className="relative -top-1 left-0 right-0 z-[999] bg-red-500 p-2 text-xs font-bold capitalize text-white"
          >
            NETWORK ERROR: Check your internet connection and try again!
          </motion.div>
        )}
        {children}
      </NextUIProvider>
      {/* </NextThemesProvider> */}

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default Providers
