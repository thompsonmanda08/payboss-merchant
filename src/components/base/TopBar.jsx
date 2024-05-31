'use client'
import React from 'react'
import Avatar from './Avatar'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import useNavigationStore from '@/state/navigationStore'
import Logo from './Logo'
import Link from 'next/link'
// import { useProfileData } from '@/hooks/useQueryHooks'

export default function TopNavBar({}) {
  // const { data: userData, isLoading } = useProfileData()
  const { toggleMobileMenu } = useNavigationStore()

  // const user = userData?.data?.profile

  // console.log('USER: ', user)
  return (
    <nav className="fixed left-0 right-0 top-0 z-20 flex h-[3rem] w-full items-center bg-white py-10 pl-6 pr-10 shadow-md shadow-slate-800/5">
      <div className="flex w-full items-center rounded-3xl">
        <div className="w-fit p-2 lg:hidden" onClick={toggleMobileMenu}>
          <HamburgerMenuIcon className="h-6 w-6 text-slate-700" />
        </div>
        <div
          className={`flex translate-x-2 flex-col items-center transition-all duration-300 ease-in-out md:translate-x-4 lg:translate-x-0`}
        >
          <Link href="/" aria-label="Home">
            <Logo className="my-auto mt-2" />
          </Link>
        </div>

        <div className="relative z-50 ml-auto h-[40px] cursor-pointer items-center justify-center rounded-full">
          <Avatar userData={'user'} />
        </div>
      </div>
    </nav>
  )
}
