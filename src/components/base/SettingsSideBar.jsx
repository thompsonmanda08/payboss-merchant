'use client'
import { logUserOut } from '@/app/_actions/auth-actions'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import {
  BriefcaseIcon,
  CheckBadgeIcon,
  Cog6ToothIcon,
  PowerIcon,
  UserCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

const WORKSPACE_SETTINGS = [
  {
    name: 'People',
    Icon: UserGroupIcon,
    href: '/settings/users',
  },
  {
    name: 'Workspaces',
    Icon: BriefcaseIcon,
    href: '/settings/workspaces',
  },
]

const ACCOUNT_SETTINGS = [
  {
    name: 'My Settings',
    Icon: UserCircleIcon,
    href: '/settings/profile',
  },
  {
    name: 'Account Verification',
    Icon: CheckBadgeIcon,
    href: '/settings/account-verification',
  },
]

export function SettingsSideBar() {
  const router = useRouter()

  return (
    <>
      <nav
        className={cn(
          `sticky z-20 hidden h-full min-h-screen w-full min-w-[200px] max-w-[280px] rounded-r-3xl bg-popover px-2 py-5 transition-all duration-500 ease-in-out lg:block`,
        )}
      >
        <div className="flex h-full w-full flex-col ">
          <Button
            variant="light"
            // size="sm"
            className="mb-2 h-auto w-full justify-start p-2 text-slate-600 hover:text-primary-600 data-[hover=true]:bg-primary-50"
            onClick={() => router.back()}
            startContent={<ArrowLeftIcon className="h-4 w-4" />}
          >
            Back to Workspace
          </Button>
          <hr />
          {/* ******************** WORKSPACE SETTINGS ******************************* */}
          <div
            role="workspace_settings"
            className="p- flex flex-col justify-start p-2"
          >
            <p className="m-2 text-xs font-medium uppercase tracking-wide text-slate-600">
              WORKSPACE NAME
            </p>
            {WORKSPACE_SETTINGS.map(({ href, Icon, name }, index) => {
              return (
                <Button
                  as={Link}
                  key={href + index}
                  href={href}
                  variant="light"
                  className="h-auto w-full justify-start p-2 text-slate-600 hover:text-primary-600 data-[hover=true]:bg-primary-50"
                  startContent={<Icon className="h-5 w-5" />}
                >
                  {name}
                </Button>
              )
            })}
          </div>
          <hr />
          {/* ******************* ACCOUNT SETTINGS **************************** */}
          <div
            role="account_settings"
            className="p- flex flex-col justify-start p-2"
          >
            <p className="m-2 text-xs font-medium uppercase tracking-wide text-slate-600">
              ACCOUNT
            </p>
            {ACCOUNT_SETTINGS.map(({ href, Icon, name }, index) => {
              return (
                <Button
                  as={Link}
                  key={href + index}
                  href={href}
                  variant="light"
                  className="h-auto w-full justify-start p-2 text-slate-600 hover:text-primary-600 data-[hover=true]:bg-primary-50"
                  startContent={<Icon className="h-5 w-5" />}
                >
                  {name}
                </Button>
              )
            })}
          </div>
          {/* ************************************************************* */}

          <hr className="mt-auto" />
          <Button
            variant="light"
            // size="sm"
            className="my-2 h-auto w-full justify-start p-2 text-slate-600 hover:text-primary-600 data-[hover=true]:bg-primary-50"
            onClick={logUserOut}
            startContent={<PowerIcon className="h-4 w-4" />}
          >
            Log out
          </Button>
        </div>
      </nav>
    </>
  )
}
