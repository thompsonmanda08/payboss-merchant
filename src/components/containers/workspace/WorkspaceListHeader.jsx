'use client'
import { Logo } from '@/components/base'
import { Button } from '@/components/ui/Button'
import useAuthStore from '@/context/authStore'
import { Cog6ToothIcon, PowerIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import React from 'react'

function WorkspaceHeader({ user }) {
  const { handleUserLogOut } = useAuthStore((state) => state)

  return (
    <>
      <Logo isWhite className="absolute left-5 top-5 z-30 md:left-10 " />
      <div className="absolute right-5 top-5 flex gap-4 md:right-10">
        {(user?.role?.toLowerCase() == 'admin' ||
          user?.role?.toLowerCase() == 'owner') && (
          <Button
            as={Link}
            href={'/manage-account'}
            variant="light"
            className="data[hover=true]:bg-slate-900/30  z-30 aspect-square min-w-[120px] rounded-full bg-slate-900/20 text-white"
            startContent={<Cog6ToothIcon className=" h-6 w-6" />}
          >
            Manage
          </Button>
        )}
        <Button
          onClick={handleUserLogOut}
          variant="light"
          className="data[hover=true]:bg-slate-900/30 z-30 aspect-square min-w-[120px] rounded-full bg-slate-900/20 text-white"
          startContent={<PowerIcon className=" h-6 w-6" />}
        >
          Sign out
        </Button>
      </div>
    </>
  )
}

export default WorkspaceHeader
