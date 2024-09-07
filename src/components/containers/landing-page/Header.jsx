'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import {
  Popover,
  PopoverButton,
  PopoverOverlay,
  PopoverPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react'

import { Button } from '@/components/ui/Button'
import { Container } from '@/components/base/Container'
import { NavLink } from '@/components/base/NavLink'
import { cn } from '@/lib/utils'
import { Logo } from '../../base'
import { UserIcon } from '@heroicons/react/24/solid'

function MobileNavLink({ href, children }) {
  return (
    <PopoverButton as={Link} href={href} className="block w-full p-2">
      {children}
    </PopoverButton>
  )
}

function MobileNavIcon({ open }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={cn('origin-center transition', open && 'scale-90 opacity-0')}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={cn(
          'origin-center transition',
          !open && 'scale-90 opacity-0',
        )}
      />
    </svg>
  )
}

function MobileNavigation({ session }) {
  return (
    <Popover>
      <PopoverButton
        className="relative z-10 flex h-8 w-8 items-center justify-center ui-not-focus-visible:outline-none"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </PopoverButton>
      <Transition>
        <TransitionChild
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <PopoverOverlay className="fixed inset-0 bg-slate-300/50" />
        </TransitionChild>
        <TransitionChild
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <PopoverPanel className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5">
            <MobileNavLink href="#features">Features</MobileNavLink>
            <MobileNavLink href="#why-payboss">Why PayBoss</MobileNavLink>
            <MobileNavLink href="#faqs">FAQs</MobileNavLink>
            <hr className="m-2 border-slate-300/40" />
            {session ? (
              <MobileNavLink href="/dashboard">Dashboard</MobileNavLink>
            ) : (
              <MobileNavLink href="/login">Sign in</MobileNavLink>
            )}
          </PopoverPanel>
        </TransitionChild>
      </Transition>
    </Popover>
  )
}

export function Header({ session }) {
  const [isFloating, setIsFloating] = useState(false)

  const pathname = usePathname()

  useEffect(() => {
    const scrollYPos = window.addEventListener('scroll', () => {
      window.scrollY > 50 ? setIsFloating(true) : setIsFloating(false)
    })

    // remove event
    return () => window.removeEventListener('scroll', scrollYPos)
  })
  return (
    <header
      className={cn(
        `rounded-blur fixed left-0 right-0 top-0 z-30 flex   flex-wrap items-center  px-4 py-5 backdrop-blur-2xl backdrop-saturate-200 transition-all lg:flex-nowrap lg:justify-start`,
        {
          'top-4 mx-10 rounded-xl bg-white/80': isFloating,
          'z-50 pt-5': pathname === '/' && !isFloating,
        },
      )}
    >
      <Container className={'w-full'}>
        <nav className="relative z-50 flex w-full justify-between">
          <div className="flex items-center md:gap-x-12">
            <Logo aria-label="Home" className="h-10 w-auto" />
            <div className="hidden md:flex md:gap-x-6">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#why-payboss">Why PayBoss</NavLink>
              <NavLink href="#faqs">FAQs</NavLink>
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            {!session && (
              <div className="hidden gap-4 md:flex">
                <NavLink href="/login">
                  <UserIcon className="h-5 w-5 " />
                  <span>Sign in</span>
                </NavLink>
                <Button as={Link} href="/register" className={''}>
                  Register
                </Button>
              </div>
            )}
            {session && (
              <Button as={Link} href="/dashboard" className={''}>
                Dashboard
              </Button>
            )}
            <div className="-mr-1 md:hidden">
              <MobileNavigation />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  )
}
