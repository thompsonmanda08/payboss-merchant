"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { motion } from "framer-motion";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

import { useNetwork } from "@/hooks/useNetwork";
import ScreenLock, { IdleTimerContainer } from "@/components/screen-lock";
import FirstLogin from "@/components/first-login";

const queryClient = new QueryClient();

function Providers({ session, authSession, children }) {
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
              whileInView={{
                y: [-20, 1],
                opacity: [0, 1],
                transition: {
                  duration: 0.3,
                  easings: "easeInOut",
                  stiffness: {
                    type: "spring",
                    // stiffness: 100,
                  },
                },
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

          <ToastProvider placement={"top-right"} toastOffset={8} />
        </HeroUIProvider>
      </NextThemesProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default Providers;
