'use client';
import {
  MessageSquare as ChatBubbleLeftRightIcon,
  Grid2X2 as Squares2X2Icon,
  UserCircle as UserCircleIcon,
  UserPlus as UserPlusIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { NavLink } from '@/components/base/nav-link';
import Logo from '@/components/base/payboss-logo';
import ThemeSwitcher from '@/components/base/theme-switcher';
import { Button } from '@/components/ui/button';
import NavIconButton from '@/components/ui/nav-icon-button';
import useFloatingHeader from '@/hooks/use-floating-header';
import { BGS_SUPER_MERCHANT_ID } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Divider } from '@heroui/react';

function MobileNavLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      as={Link}
      className={cn('w-full p-2', className)}
      href={href}
      variant="light"
    >
      {children}
    </Button>
  );
}

function MobileNavIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-primary"
      fill="none"
      strokeLinecap="round"
      strokeWidth={2}
    >
      <path
        className={cn('origin-center transition', open && 'scale-90 opacity-0')}
        d="M0 1H14M0 7H14M0 13H14"
      />
      <path
        className={cn(
          'origin-center transition',
          !open && 'scale-90 opacity-0',
        )}
        d="M2 2L12 12M12 2L2 12"
      />
    </svg>
  );
}

function MobileNavigation({ session }: { session: any }) {
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
              <MobileNavLink href="/docs">Documentation</MobileNavLink>
              <MobileNavLink href="#why-payboss">Why PayBoss</MobileNavLink>
              <MobileNavLink href="#faqs">FAQs</MobileNavLink>
              <Divider className="my-6 h-px" />
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
                  <NavLink
                    className="hidden :flex"
                    href={`/register/${BGS_SUPER_MERCHANT_ID}`}
                  >
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

export function Header({ session }: { session: any }) {
  const pathname = usePathname();

  const isFloating = useFloatingHeader(100);

  return (
    <header
      className={cn(
        `rounded-blur fixed left-0 right-0 top-0 z-30 flex flex-wrap items-center px-4 py-5 backdrop-blur-2xl backdrop-saturate-200 transition-all lg:flex-nowrap lg:justify-start`,
        {
          'top-4 sm:top-2 sm:mx-10 rounded-xl bg-background/80': isFloating,
          'z-50': pathname === '/' && !isFloating,
        },
      )}
    >
      <nav className="relative z-50 flex w-full justify-between container">
        <div className="flex items-center md:gap-x-12">
          <Logo aria-label="Home" className="h-10 w-auto" />
          <div className="hidden lg:flex md:gap-x-6">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="/docs">Documentation</NavLink>
            <NavLink href="#why-payboss">Why PayBoss</NavLink>
            <NavLink href="#faqs">FAQs</NavLink>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex lg:gap-2 items-center">
            {session ? (
              <NavLink className={'p-1'} href="/dashboard">
                <NavIconButton>
                  <Squares2X2Icon className="h-5 w-5 " />
                </NavIconButton>
                <span className="hidden sm:flex">Dashboard</span>
              </NavLink>
            ) : (
              <>
                <NavLink className={'p-1 '} href="/login">
                  <NavIconButton>
                    <UserCircleIcon className="h-5 w-5 " />
                  </NavIconButton>
                  <span className="hidden lg:flex">Sign in</span>
                </NavLink>
                <NavLink
                  className="hidden gap-2 lg:flex"
                  href={`/register/${BGS_SUPER_MERCHANT_ID}`}
                >
                  <NavIconButton>
                    <UserPlusIcon className="h-5 w-5 " />
                  </NavIconButton>
                  <span> Register</span>
                </NavLink>
              </>
            )}
            <NavLink href="/support">
              <NavIconButton>
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
              </NavIconButton>
            </NavLink>
            <ThemeSwitcher />
          </div>
          <div className="-mr-1 lg:hidden">
            <MobileNavigation session={session} />
          </div>
        </div>
      </nav>
    </header>
  );
}
