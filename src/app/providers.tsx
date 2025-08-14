'use client';
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { motion } from 'framer-motion';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { PropsWithChildren, useEffect, useState } from 'react';

import FirstLogin from '@/components/elements/first-login';
import ScreenLock, {
  IdleTimerContainer,
} from '@/components/elements/screen-lock';
import { useNetwork } from '@/hooks/use-network';
import { AuthSession, UserSession } from '@/types';

const queryClient = new QueryClient();

function Providers({
  session,
  authSession,
  children,
}: PropsWithChildren & {
  session?: UserSession;
  authSession?: AuthSession;
}) {
  const { online } = useNetwork();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        disableTransitionOnChange
        enableSystem
        attribute="class"
        defaultTheme="light"
      >
        <HeroUIProvider locale="en-GB">
          {!online && (
            <motion.div
              className="relative -top-1 left-0 right-0 z-[999] mb-4 bg-red-500 p-2 py-2 text-xs font-bold capitalize text-white"
              transition={{
                type: 'spring',
                stiffness: 100,
                ease: 'easeInOut',
                duration: 0.3,
              }}
              whileInView={{
                y: [-20, 1],
                opacity: [0, 1],
              }}
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

          <ToastProvider placement={'top-right'} toastOffset={8} />
        </HeroUIProvider>
      </NextThemesProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default Providers;
