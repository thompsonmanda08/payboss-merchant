'use client'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import {
  Bars3BottomLeftIcon,
  BriefcaseIcon,
  CheckBadgeIcon,
  PowerIcon,
  UserCircleIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useAuthStore from '@/context/authStore'

const ACCOUNT_SETTINGS = [
  {
    name: 'My Settings',
    Icon: UserCircleIcon,
    href: '/manage-account/profile',
  },

  {
    name: 'People',
    Icon: UserGroupIcon,
    href: '/manage-account/users',
  },
  {
    name: 'Workspaces',
    Icon: BriefcaseIcon,
    href: '/manage-account/workspaces',
  },
  {
    name: 'Account Verification',
    Icon: CheckBadgeIcon,
    href: '/manage-account/account-verification',
  },
]

function SettingsSideBar({
  title,
  backButtonText,
  isProfile,
  settingsPathname,
}) {
  const pathname = usePathname()
  const [openSettingsSideBar, setOpenSettingsSideBar] = useState(false)
  const handleUserLogOut = useAuthStore((state) => state.handleUserLogOut)

  function toggleSideBar() {
    setOpenSettingsSideBar(!openSettingsSideBar)
  }

  // const router = useRouter()
  // const activeWorkspace = useConfigStore((state) => state?.activeWorkspace)
  // console.log(settingsPathname)
  const dashboardHome = settingsPathname?.split('/')?.slice(0, 3)?.join('/')
  const homeRoute = dashboardHome || '/workspaces'

  const WORKSPACE_SETTINGS = [
    {
      name: 'People',
      Icon: UserGroupIcon,
      href: `${settingsPathname}/users`,
    },
  ]

  // SETTINGS OPTIONS
  const SETTINGS_LINKS = {
    title: 'account_settings',
    links: settingsPathname ? WORKSPACE_SETTINGS : ACCOUNT_SETTINGS,
  }

  useEffect(() => {}, [pathname, settingsPathname])

  return (
    <>
      <div className="fixed z-[77] flex h-16 w-screen bg-white shadow-sm lg:hidden">
        <Button
          className={cn(
            'absolute left-6 top-3 z-50 h-8 min-w-5 items-center bg-transparent p-2 py-3 text-slate-700 hover:bg-transparent lg:hidden',
            { 'text-white': isProfile },
          )}
          onClick={toggleSideBar}
          startContent={<Bars3BottomLeftIcon className="h-7 w-7  " />}
        >
          {homeRoute == '/workspaces' ? 'Manage Account' : null}
        </Button>
      </div>

      {openSettingsSideBar && (
        <motion.div
          whileInView={{ opacity: [0, 1], transition: { duration: 0.3 } }}
          onClick={toggleSideBar}
          className={cn(`absolute left-[-100%] z-[99] hidden bg-slate-900/60`, {
            'inset-0 block': openSettingsSideBar,
          })}
        />
      )}
      <motion.nav
        className={cn(
          `sticky -left-[110%] z-50 hidden h-full min-h-screen w-full min-w-[200px] max-w-[280px] rounded-r-3xl bg-popover px-2 py-5 transition-all duration-500 ease-in-out lg:left-0 lg:block`,
          { 'absolute left-0 z-[100] block': openSettingsSideBar },
        )}
      >
        <div className="relative flex h-full w-full flex-col">
          <Button
            isIconOnly
            variant="light"
            className="absolute -right-16 -top-2 aspect-square rounded-full p-2 data-[hover=true]:bg-primary-900/10 lg:hidden"
            onClick={() => setOpenSettingsSideBar(false)}
          >
            <XMarkIcon className="h-5 w-5 text-white transition-all duration-200 ease-in hover:text-primary/80 hover:text-white" />
          </Button>
          <Button
            variant="light"
            as={Link}
            href={homeRoute}
            className="mb-2 h-auto w-full justify-start p-2 text-slate-600 hover:text-primary-600 data-[hover=true]:bg-primary-50"
            startContent={<ArrowLeftIcon className="h-4 w-4" />}
          >
            {backButtonText || 'Back to Workspaces'}
          </Button>
          <hr />
          {/* ******************** WORKSPACE SETTINGS ******************************* */}
          <div
            role="`workspace_settings`"
            className="p- flex flex-col justify-start p-2"
          >
            <p className="m-2 text-xs font-medium uppercase tracking-wide text-slate-600">
              {title || 'ACCOUNT SETTINGS'}
            </p>
            {SETTINGS_LINKS.links?.map(({ href, Icon, name }, index) => {
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
            onClick={handleUserLogOut}
            startContent={<PowerIcon className="h-4 w-4" />}
          >
            Log out
          </Button>
        </div>
      </motion.nav>
    </>
  )
}

export default SettingsSideBar
