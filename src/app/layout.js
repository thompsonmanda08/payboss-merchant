import "./globals.css";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import Providers from "./providers";
import { getAuthSession, getUserDetails } from "./_actions/config-actions";

import localFont from "next/font/local";

const inter = localFont({
  src: "font/Inter-VariableFont_slnt,wght.ttf",
  variable: "--font-inter",
});

export const metadata = {
  title: {
    template: "%s - PayBoss",
    default: "PayBoss - Gateway to simplified payments",
  },
  description:
    "PayBoss offers cutting-edge digital tools designed to help businesses of all sizes efficiently manage their financial inflows and outflows",
};

export default async function RootLayout({ children }) {
  const session = await getUserDetails();
  const authSession = await getAuthSession();

  return (
    <html
      lang="en"
      className={cn("h-screen scroll-smooth bg-background antialiased light")}
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
      <body
        className={cn(
          "flex min-h-screen flex-col bg-background font-inter overflow-x-hidden",
          inter.variable
        )}
      >
        <Providers session={session} authSession={authSession}>
          {children}
          <Toaster
            toastOptions={{
              duration: 3000,
            }}
            position="top-right"
            containerClassName="z-[10000!important]"
          />
        </Providers>
      </body>
    </html>
  );
}
