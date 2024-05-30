'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import { ThemeProvider as NextThemesProvider } from 'next-themes'

const queryClient = new QueryClient()

function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      > */}
      {children}
      {/* </NextThemesProvider> */}

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default Providers
