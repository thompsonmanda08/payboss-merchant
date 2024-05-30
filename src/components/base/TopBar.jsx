'use client'
import React from 'react'
import Avatar from './Avatar'
import { Logo } from '..'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useProfileData } from '@/hooks/useQueryHooks'

export default function TopNavBar({}) {
  const { data: userData, isLoading } = useProfileData()

  const user = userData?.data?.profile

  console.log('USER: ', user)
  return (
    <nav className="fixed left-0 right-0 top-0 z-20 flex h-[3rem] w-full items-center bg-white p-10 shadow-md shadow-slate-800/5">
      <div className="flex h-[2.7rem] w-full items-center gap-[1rem] rounded-3xl">
        <div className={`${''} z-[0] ml-8 min-w-[180px]`}>
          <Logo />
        </div>

        {/* COMPONENT SWAP */}

        <div className="relative z-50 ml-auto h-[40px] cursor-pointer items-center justify-center rounded-full">
          <Avatar userData={user} />
        </div>
      </div>
    </nav>
  )
}
