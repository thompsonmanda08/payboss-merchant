"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChatBubbleLeftRightIcon,
  Squares2X2Icon,
  UserCircleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/base/nav-link";
import { cn } from "@/lib/utils";
import useFloatingHeader from "@/hooks/useFloatingHeader";
import Logo from "@/components/base/logo";
import ThemeSwitcher from "@/components/base/theme-switcher";
import NavIconButton from "@/components/ui/nav-icon-button";

function MobileNavLink({ href, className, children }) {
  return (
    <Button as={Link} className={cn("w-full p-2")} href={href} variant="light">
      {children}
    </Button>
  );
}

function MobileNavIcon({ open }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-primary"
      fill="none"
      strokeLinecap="round"
      strokeWidth={2}
    >
      <path
        className={cn("origin-center transition", open && "scale-90 opacity-0")}
        d="M0 1H14M0 7H14M0 13H14"
      />
      <path
        className={cn(
          "origin-center transition",
          !open && "scale-90 opacity-0",
        )}
        d="M2 2L12 12M12 2L2 12"
      />
    </svg>
  );
}

function MobileNavigation({ session }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div
          className="absolute -left-14 -top-8 w-screen h-screen inset-0 "
          onClick={() => setOpen(false)}
        />
      )}
      <div className="">
        <Button
          aria-label="Toggle Navigation"
          className="relative z-10 flex h-8 w-8 items-center justify-center ui-not-focus-visible:outline-none"
          variant="light"
          onPress={() => setOpen(!open)}
        >
          <MobileNavIcon open={open} />
        </Button>

        {open && (
          <div className="absolute right-0 w-full max-w-[200px]">
            <div className="mt-2 flex origin-top flex-col rounded-xl gap-2 bg-background/90 backdrop-blur-md p-4 text-lg tracking-tight text-foreground shadow-xl">
              <MobileNavLink href="#features">Features</MobileNavLink>
              <MobileNavLink href="#why-payboss">Why PayBoss</MobileNavLink>
              <MobileNavLink href="#faqs">FAQs</MobileNavLink>
              <hr className="m-2 border-slate-300/40" />
              {session ? (
                <NavLink href="/dashboard">
                  <NavIconButton>
                    <Squares2X2Icon className="h-5 w-5 " />
                  </NavIconButton>
                  <span>Dashboard</span>
                </NavLink>
              ) : (
                <>
                  <NavLink href="/login">
                    <NavIconButton>
                      <UserCircleIcon className="h-5 w-5 " />
                    </NavIconButton>
                    <span>Sign in</span>
                  </NavLink>
                  <NavLink className="hidden :flex" href="/register">
                    <NavIconButton>
                      <UserPlusIcon className="h-5 w-5 " />
                    </NavIconButton>
                    <span> Register</span>
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export function Header({ session }) {
  const pathname = usePathname();

  const isFloating = useFloatingHeader(100);

  return (
    <header
      className={cn(
        `rounded-blur fixed left-0 right-0 top-0 z-30 flex flex-wrap items-center px-4 py-5 backdrop-blur-2xl backdrop-saturate-200 transition-all lg:flex-nowrap lg:justify-start`,
        {
          "top-2 mx-10 rounded-xl bg-background/80": isFloating,
          "z-50 pt-5": pathname === "/" && !isFloating,
        },
      )}
    >
      <nav className="relative z-50 flex w-full justify-between container">
        <div className="flex items-center md:gap-x-12">
          <Logo aria-label="Home" className="h-10 w-auto" />
          <div className="hidden lg:flex md:gap-x-6">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#why-payboss">Why PayBoss</NavLink>
            <NavLink href="#faqs">FAQs</NavLink>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {!session && (
            <div className="flex translate-x-8 md:translate-x-0">
              <NavLink href="/login">
                <NavIconButton>
                  <UserCircleIcon className="h-5 w-5 " />
                </NavIconButton>
                <span className="hidden md:flex">Sign in</span>
              </NavLink>
              <NavLink className="hidden gap-2 lg:flex" href="/register">
                <NavIconButton>
                  <UserPlusIcon className="h-5 w-5 " />
                </NavIconButton>
                <span> Register</span>
              </NavLink>
            </div>
          )}
          {session && (
            <NavLink href="/dashboard">
              <NavIconButton>
                <Squares2X2Icon className="h-5 w-5 " />
              </NavIconButton>
              <span>Dashboard</span>
            </NavLink>
          )}
          <div className="ml-8 flex gap-1 items-center">
            <ThemeSwitcher />
            <NavLink href="/support">
              <NavIconButton>
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
              </NavIconButton>
            </NavLink>
          </div>

          <div className="-mr-1 lg:hidden">
            <MobileNavigation />
          </div>
        </div>
      </nav>
    </header>
  );
}
