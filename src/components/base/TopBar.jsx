'use client'
import React, { useEffect, useState } from 'react'
import useNavigationStore from '@/context/navigationStore'
import Link from 'next/link'
import { BellIcon, Cog6ToothIcon, UserIcon } from '@heroicons/react/24/solid'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import Avatar from '../ui/Avatar'
import BreadCrumbLinks from './BreadCrumbLinks'

export default function TopNavBar({}) {
  const userData = [undefined]
  const [isFloating, setIsFloating] = useState(false)
  const pathname = usePathname()

  const currentPath =
    pathname.split('/')[2]?.replaceAll('-', ' ') || pathname.split('/')[1]

  const isProfile = currentPath.toLowerCase() === 'profile'

  return (
    <nav
      className={cn(
        `rounded-blur fixed left-0 right-0 top-5 z-30 flex w-full -translate-y-5 items-center bg-white py-2 pr-5 shadow-sm transition-all lg:sticky lg:top-auto lg:flex-nowrap lg:justify-start lg:bg-transparent lg:shadow-none`,
      )}
    >
      <div className="flex w-full items-center rounded-3xl">
        <div className="relative left-16 transition-all duration-300 ease-in-out lg:left-0">
          <BreadCrumbLinks isProfile={isProfile} />
          <h2
            className={cn(
              'pl-2 text-lg font-semibold capitalize leading-8 text-slate-800 md:text-xl',
              { 'text-white': isProfile },
            )}
          >
            {currentPath}
          </h2>
        </div>
        <div className="relative z-50 ml-auto flex  items-center justify-center rounded-full">
          <div
            className={cn('flex items-center gap-4 text-gray-400', {
              'text-white': isProfile,
            })}
          >
            <Link
              href={'/dashboard/settings'}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <Cog6ToothIcon className="h-5 w-6 " />
            </Link>
            <div className="relative flex cursor-pointer items-center gap-2 text-sm after:absolute after:right-1 after:top-0 after:h-2 after:w-2 after:rounded-full after:bg-rose-600 after:content-['']">
              <BellIcon className="top-0 h-5 w-6 " />
            </div>
            {userData ? (
              <Link href={'/dashboard/profile'}>
                <Avatar userData={userData} isProfile={isProfile} />
              </Link>
            ) : (
              <Link
                href={'/login'}
                className="mr-4 flex cursor-pointer items-center gap-2 text-sm"
              >
                <UserIcon className="h-4 w-4 " />
                <span>Sign in</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
