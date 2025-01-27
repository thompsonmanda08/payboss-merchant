"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HeroUIProvider } from "@heroui/react";
import { useNetwork } from "@/hooks/useNetwork";
import { motion } from "framer-motion";
import ScreenLock, {
  IdleTimerContainer,
} from "@/components/elements/screen-lock";
import FirstLogin from "@/components/elements/first-login";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

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
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <HeroUIProvider locale="en-GB">
          {!online && (
            <motion.div
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
              className="relative -top-1 left-0 right-0 z-[999] mb-4 bg-red-500 p-2 py-2 text-xs font-bold capitalize text-white"
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
        </HeroUIProvider>
      </NextThemesProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default Providers;
