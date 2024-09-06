'use client'
import React from 'react'
import Link from 'next/link'
import { BellIcon, Cog6ToothIcon } from '@heroicons/react/24/solid'
import { cn, formatCurrency } from '@/lib/utils'
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
} from '@nextui-org/react'
import SelectField from '../ui/SelectField'
import useAuthStore from '@/context/authStore'
import { Skeleton } from '../ui/skeleton'
import useAccountProfile from '@/hooks/useProfileDetails'
import useNavigation from '@/hooks/useNavigation'
import useWorkspaces from '@/hooks/useWorkspaces'
import { WalletIcon } from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'

export default function TopNavBar({}) {
  const { user } = useAccountProfile()
  const { workspaceID, workspaceWalletBalance } = useWorkspaces()
  const { isProfile, currentPath, dashboardRoute } = useNavigation()

  return user && workspaceWalletBalance ? (
    <nav
      className={cn(
        `__TOPBAR rounded-blur top-navigation fixed left-0 right-0 top-5 z-50 flex w-full -translate-y-5 items-center py-2 pr-10 shadow-sm transition-all md:pl-2 lg:sticky lg:top-auto lg:flex-nowrap lg:justify-start lg:bg-transparent lg:pl-0 lg:shadow-none`,
        { 'bg-transparent px-10 pl-20 text-white': isProfile },
      )}
    >
      <div className="flex w-full items-center">
        <div
          className={cn(
            'relative left-16 hidden transition-all duration-300 ease-in-out lg:left-0 lg:block',
            { 'pl-5': isProfile },
          )}
        >
          <BreadCrumbLinks isProfile={isProfile} />
          {workspaceID && (
            <h2
              className={cn(
                'pl-2 text-lg font-bold uppercase leading-8 text-slate-800',
                { 'text-white': isProfile },
              )}
            >
              {currentPath}
            </h2>
          )}
        </div>
        <div className="relative z-50 ml-auto flex  items-center justify-center rounded-full">
          <div
            className={cn('flex items-center gap-4 text-gray-400', {
              'text-white': isProfile,
            })}
          >
            <Link
              href={dashboardRoute + '/workspace-settings?wallet=true'}
              className={cn(
                'mr-2 flex cursor-pointer items-start gap-3 text-primary',
                {
                  'text-white': isProfile,
                },
              )}
            >
              <WalletIcon className="h-5 w-5" />{' '}
              <div className="flex flex-col items-start">
                <span
                  className={cn('text-xs font-medium text-slate-600', {
                    'text-white': isProfile,
                  })}
                >
                  Wallet Balance
                </span>
                <span className="-mt-1 text-base font-bold">
                  {formatCurrency(workspaceWalletBalance)}
                </span>
              </div>
            </Link>
            <div className="relative flex cursor-pointer items-center gap-2 text-sm after:absolute after:right-1 after:top-0 after:h-2 after:w-2 after:rounded-full after:bg-primary-500 after:content-['']">
              <BellIcon className="top-0 h-6 w-6 " />
            </div>
            <AvatarDropdown user={user} isProfile={isProfile} />
          </div>
        </div>
      </div>
    </nav>
  ) : (
    <NavbarLoader isProfile />
  )
}

export function AvatarDropdown({ user, isProfile }) {
  const { handleUserLogOut } = useAuthStore((state) => state)
  const { dashboardRoute } = useNavigation()
  return (
    <Dropdown
      // showArrow
      radius="sm"
      classNames={{
        base: 'before:bg-default-200', // change arrow background
        content: cn('p-0 border-small border-divider bg-background', {
          'bg-background/80 backdrop-blur-md': isProfile,
        }),
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
            href={dashboardRoute + '/profile'}
            className="h-12 gap-2 px-1"
          >
            <Avatar
              firstName={user?.first_name}
              lastName={user?.last_name}
              email={user?.email}
              showUserInfo
            />
          </DropdownItem>
          {/* <DropdownItem key="Home" href="/workspaces">
            Exit to Workspaces
          </DropdownItem>
          <DropdownItem key="settings" href={settingsPathname + '/workspaces'}>
            Settings
          </DropdownItem> */}
        </DropdownSection>

        {/* <DropdownSection aria-label="Preferences" showDivider>
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
        </DropdownSection> */}

        <DropdownSection aria-label="Help & Feedback">
          <DropdownItem key="Home" href="/workspaces">
            Exit to Workspaces
          </DropdownItem>
          <DropdownItem key="help_and_feedback" href="/support">
            Help & Feedback
          </DropdownItem>
          <DropdownItem key="logout" onClick={handleUserLogOut}>
            Log Out
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}

export function NavbarLoader({ isProfile }) {
  return (
    <div className="relative -top-5 flex w-full justify-between">
      <div className="flex w-full flex-col gap-2">
        <Skeleton
          className={cn('aspect-square h-4 w-full max-w-xl rounded-lg', {
            'bg-background/10 p-4 backdrop-blur-md': isProfile,
          })}
        />
        <Skeleton
          className={cn('aspect-square h-5 w-full max-w-xs rounded-lg', {
            'bg-background/10 p-4 backdrop-blur-md': isProfile,
          })}
        />
      </div>
      <div className="flex items-center gap-2">
        <div className=" flex space-x-2">
          <Skeleton
            className={cn('aspect-square h-8 rounded-full', {
              'bg-background/10 p-4 backdrop-blur-md': isProfile,
            })}
          />
          <Skeleton
            className={cn('aspect-square h-8 rounded-full', {
              'bg-background/10 p-4 backdrop-blur-md': isProfile,
            })}
          />
        </div>
        <Skeleton
          className={cn('aspect-square h-12 rounded-full', {
            'bg-background/10 p-4 backdrop-blur-md': isProfile,
          })}
          div
        />
      </div>
    </div>
  )
}
