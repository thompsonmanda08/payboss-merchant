import "./globals.css";
import localFont from "next/font/local";

import { cn } from "@/lib/utils";

import Providers from "./providers";
import { getAuthSession, getUserDetails } from "./_actions/config-actions";

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
      className={cn("h-screen scroll-smooth bg-background antialiased light")}
      lang="en"
    >
      <head>
        <link href="/manifest.json" rel="manifest" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <meta content="#da532c" name="msapplication-TileColor" />
        <meta content="#ffffff" name="theme-color" />
      </head>
      <body
        className={cn(
          "flex min-h-screen flex-col bg-background font-inter overflow-x-hidden",
          inter.variable,
        )}
      >
        <Providers authSession={authSession} session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
