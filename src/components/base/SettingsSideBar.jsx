'use client'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import React from 'react'

export function SettingsSideBar() {
  const router = useRouter()
  return (
    <>
      <nav
        className={cn(
          `sticky z-20 hidden h-full min-h-screen w-full min-w-[220px] max-w-[320px] rounded-r-3xl bg-primary-50 px-2 py-5 transition-all duration-500 ease-in-out lg:block`,
        )}
      >
        <div className="p- flex justify-start">
          <Button variant="light" size="sm" className="w-full justify-start">
            <ArrowLeftIcon
              className="h-4 w-4  text-slate-500"
              onClick={() => router.back()}
            />{' '}
            Back to Workspace
          </Button>
        </div>
        <SettingsSideBarItems />

        {/* MOBILE NAVIGATION */}
        <MobileSettingsMenu />
      </nav>
    </>
  )
}

export function SettingsSideBarItems() {
  return <div>SettingsSideBarItems</div>
}

export function MobileSettingsMenu() {
  return <div>MobileSettingsMenu</div>
}
