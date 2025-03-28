import "./globals.css";
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
        </Providers>
      </body>
    </html>
  );
}
