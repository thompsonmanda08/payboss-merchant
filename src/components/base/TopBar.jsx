'use client'
import React from 'react'
import Avatar from './Avatar'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import useNavigationStore from '@/state/navigationStore'
import Logo from './Logo'
import Link from 'next/link'
import BreadCrumb from './BreadCrumb'
import {
  BellAlertIcon,
  BellIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  UserIcon,
} from '@heroicons/react/24/solid'
import { Tooltip } from '.'
import { usePathname } from 'next/navigation'
import { capitalize } from '@/lib/utils'
// import { useProfileData } from '@/hooks/useQueryHooks'

export default function TopNavBar({}) {
  // const { data: userData, isLoading } = useProfileData()
  const userData = [undefined]
  const { toggleMobileMenu } = useNavigationStore()

  // const user = userData?.data?.profile

  // console.log('USER: ', user)
  capitalize

  const pathname = usePathname()
  const currentPath =
    pathname.split('/')[2]?.replaceAll('-', ' ') || pathname.split('/')[1]
  return (
    <nav className="sticky z-20 flex w-full -translate-y-5 items-center py-2 pr-10 ">
      <div className="flex w-full items-center rounded-3xl">
        <div>
          <BreadCrumb />
          <h2 className="pl-2 text-lg font-semibold capitalize leading-8 text-slate-800 md:text-xl">
            {currentPath}
          </h2>
        </div>
        <div className="relative z-50 ml-auto flex  items-center justify-center rounded-full">
          <div className="flex items-center gap-2 text-gray-400">
            {userData ? (
              <Link href={'/dashboard/profile'}>
                <Avatar userData={userData} />
              </Link>
            ) : (
              <div className="mr-4 flex cursor-pointer items-center gap-2 text-sm">
                <UserIcon className="h-4 w-4 " />
                <span>Sign in</span>
              </div>
            )}
            <Link
              href={'/dashboard/settings'}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <Cog6ToothIcon className="h-5 w-6 " />
            </Link>
            <div className="relative flex cursor-pointer items-center gap-2 text-sm after:absolute after:right-1 after:top-0 after:h-2 after:w-2 after:rounded-full after:bg-rose-600 after:content-['']">
              <BellIcon className="top-0 h-5 w-6 " />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
