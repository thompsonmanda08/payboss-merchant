'use client'
import React, { useEffect, useState } from 'react'
import useNavigationStore from '@/context/navigationStore'
import Link from 'next/link'
import { BellIcon, Cog6ToothIcon, UserIcon } from '@heroicons/react/24/solid'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import Avatar from '../ui/Avatar'
import BreadCrumbLinks from './BreadCrumbLinks'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
  User,
  user,
} from '@nextui-org/react'
import { PlusIcon } from '@heroicons/react/24/outline'
import useConfigStore from '@/context/configStore'
import { useSetupConfig } from '@/hooks/useQueryHooks'
import SelectField from '../ui/SelectField'

export default function TopNavBar({}) {
  const pathname = usePathname()
  const { activeWorkspace } = useConfigStore((state) => state)
  const { data: response } = useSetupConfig()
  const user = response?.data?.userDetails
  const workspaceID = activeWorkspace?.ID
  const settingsPathname = `/dashboard/${workspaceID}/settings`

  console.log(user)

  const currentPath =
    pathname.split('/')[3]?.replaceAll('-', ' ') || activeWorkspace?.workspace

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
              'pl-2 text-lg font-bold uppercase leading-8 text-slate-800',
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
              href={settingsPathname}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <Cog6ToothIcon className="h-5 w-6 " />
            </Link>
            <div className="relative flex cursor-pointer items-center gap-2 text-sm after:absolute after:right-1 after:top-0 after:h-2 after:w-2 after:rounded-full after:bg-rose-600 after:content-['']">
              <BellIcon className="top-0 h-5 w-6 " />
            </div>
            {user ? (
              <AvatarDropdown
                user={user}
                isProfile={isProfile}
                settingsPathname={settingsPathname}
              />
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

export function AvatarDropdown({ user, settingsPathname, isProfile }) {
  return (
    <Dropdown
      // showArrow
      radius="sm"
      classNames={{
        base: 'before:bg-default-200', // change arrow background
        content: 'p-0 border-small border-divider bg-background',
      }}
    >
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="light"
          disableRipple
          className="rounded-full"
        >
          <Avatar
            isProfile
            firstName={user?.first_name}
            lastName={user?.last_name}
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Custom item styles"
        // disabledKeys={['profile']}
        className="p-3"
        itemClasses={{
          base: [
            'rounded-md',
            'text-slate-700',
            'transition-opacity',
            'data-[hover=true]:text-foreground',
            'data-[hover=true]:bg-primary-100',
            'dark:data-[hover=true]:bg-default-50',
            'data-[selectable=true]:focus:bg-default-50',
            'data-[pressed=true]:opacity-70',
            'data-[focus-visible=true]:ring-default-500',
          ],
        }}
      >
        <DropdownSection aria-label="Profile & Actions" showDivider>
          <DropdownItem
            isReadOnly
            key="profile"
            href="/settings/profile"
            className="h-14 gap-2"
          >
            <User
              name={user?.first_name}
              description={user?.email}
              classNames={{
                name: 'text-default-600',
                description: 'text-default-500',
              }}
              avatarProps={{
                size: 'sm',
                src:
                  user?.image ||
                  'https://avatars.githubusercontent.com/u/30373425?v=4',
              }}
            />
          </DropdownItem>
          <DropdownItem key="Home" href="/workspaces">
            Go to Workspaces
          </DropdownItem>
          <DropdownItem key="settings" href={settingsPathname}>
            Settings
          </DropdownItem>
          {/* <DropdownItem
            key="new_workspace"
            endContent={<PlusIcon className="aspect-square h-5 w-5" />}
            //TODO => BUTTON TO OPEN A 
          >
            New Workspace
          </DropdownItem> */}
        </DropdownSection>

        <DropdownSection aria-label="Preferences" showDivider>
          <DropdownItem key="quick_search" shortcut="⌘K">
            Quick search
          </DropdownItem>
          <DropdownItem
            isReadOnly
            key="theme"
            className="flex cursor-default justify-between"
          >
            <div className="flex h-12 w-full cursor-default items-center justify-between">
              <span>Theme</span>
              <SelectField
                // className="z-10 h-8 w-24 rounded-md border-small border-default-300  bg-transparent py-1 text-tiny text-default-500 outline-none group-data-[hover=true]:border-default-500 dark:border-default-200"
                className={'ml-auto w-[100px]'}
                wrapperClassName={'h-8'}
                id="theme"
                name="theme"
                options={['System', 'Light', 'Dark']}
              />
            </div>
          </DropdownItem>
        </DropdownSection>

        <DropdownSection aria-label="Help & Feedback">
          <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
          <DropdownItem key="logout">Log Out</DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
