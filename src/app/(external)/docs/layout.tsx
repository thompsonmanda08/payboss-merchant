import Link from "next/link";

import Search from "@/components/ui/search";
import Logo from "@/components/base/payboss-logo";

import DocsMobileNav from "../_components/docs-mobile-nav";
import { PropsWithChildren } from "react";

export default function DocsLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-foreground/10 bg-background shadow-sm shadow-black/5 px-4 md:px-6">
        <DocsMobileNav />
        <Logo aria-label="Home" className="" href={"/"} />
        <Link className="flex items-center gap-2 font-semibold" href="#">
          <span className="text-xl">Documentation</span>
        </Link>
        <div className="relative ml-auto flex-1 md:grow-0 md:w-80">
          <Search />
        </div>
      </header>
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left Sidebar */}
        <aside className="hidden border-r border-foreground/10 md:block flex-[0.5] max-w-96">
          <div className="sticky top-16 overflow-y-auto p-4 h-[calc(100vh-4rem)]">
            <nav className="grid gap-6 text-sm">
              <div className="grid gap-3 p-2">
                <h3 className="text-lg font-semibold">API Documentation</h3>
                <div className="grid gap-1">
                  <Link
                    className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-primary font-medium"
                    href="#"
                  >
                    PayBoss Collections API
                  </Link>
                  {/* <Link
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:text-foreground"
                    href="#"
                  >
                    Authentication
                  </Link>
                  <Link
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:text-foreground"
                    href="#"
                  >
                    Webhooks
                  </Link>
                  <Link
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:text-foreground"
                    href="#"
                  >
                    Error Handling
                  </Link> */}
                </div>
              </div>
            </nav>
          </div>
        </aside>

        {children}
      </div>
    </div>
  );
}
