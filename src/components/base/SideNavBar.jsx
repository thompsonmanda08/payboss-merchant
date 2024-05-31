'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'

import useAuthStore from '@/state/authStore'
import useNavigationStore from '@/state/navigationStore'
import MobileNavBar from './MobileNavBar'
import Link from 'next/link'

import {
  HomeIcon,
  XMarkIcon,
  Cog6ToothIcon,
  QueueListIcon,
  ArrowLeftStartOnRectangleIcon,
} from '@heroicons/react/24/outline'

export const SIDE_BAR_OPTIONS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    Icon: HomeIcon,
  },
  {
    name: 'Disbursements',
    href: '/dashboard/disbursements',
    Icon: QueueListIcon,
  },

  {
    name: 'Settings',
    href: '/dashboard/settings',
    Icon: Cog6ToothIcon,
  },
]

function SideNavBar() {
  const pathname = usePathname()
  const { logUserOut } = useAuthStore()

  const [isSideNavCollapsed, setIsSideNavCollapsed] = useState(false)

  const {
    currentPage,
    setCurrentPage,
    setPage,
    openMobileMenu,
    toggleMobileMenu,
  } = useNavigationStore()

  function toggleSideNav() {
    setIsSideNavCollapsed(!isSideNavCollapsed)
  }

  return (
    <>
      <nav
        className={`${
          isSideNavCollapsed
            ? 'max-w-[96px] items-center'
            : 'min-w-[220px] max-w-[320px]'
        } z-20 hidden h-full max-h-screen w-full bg-white px-4 pb-10 shadow-md shadow-slate-800/5 transition-all duration-500 ease-in-out lg:block`}
      >
        <div className="flex h-full w-full flex-col">
          {/* MENU ITEMS CONTAINER */}
          <div className="mt-6 flex h-full w-full flex-col gap-4">
            {SIDE_BAR_OPTIONS.map(({ name, href, Icon }, index) => (
              <Link
                key={index}
                href={href}
                onClick={() => {
                  // setCurrentPage(index)
                  // setPage(href)
                }}
                // shallow={true}
                className={`group ${
                  pathname.split('/')[0] == name.toLowerCase() ||
                  pathname == href
                    ? // currentPage === index
                      'rounded-sm bg-primary/10 font-medium text-primary'
                    : 'bg-transparent font-normal text-slate-800 hover:bg-primary/10 '
                } 

                ${isSideNavCollapsed ? 'justify-center' : 'gap-3'}
                  flex max-h-14 flex-grow-0 cursor-pointer items-center rounded-lg p-3 text-sm font-medium`}
              >
                <Icon className="h-6 w-6" />
                {isSideNavCollapsed ? (
                  <span
                    className={`${
                      isSideNavCollapsed
                        ? 'absolute left-[110%] hidden bg-primary text-white opacity-0 group-hover:block group-hover:rounded-md group-hover:bg-primary group-hover:opacity-100 '
                        : 'hidden'
                    } w-fit text-nowrap px-3 py-1 text-base transition-all duration-500 ease-in-out group-hover:delay-500`}
                  >
                    {name}
                  </span>
                ) : (
                  name
                )}
              </Link>
            ))}
          </div>
          <button
            className={`group ${
              isSideNavCollapsed
                ? ' mx-auto w-12 justify-center bg-primary/20 text-primary hover:rounded-md hover:bg-primary hover:text-white'
                : 'bg-primary/10 font-medium text-slate-600 hover:bg-primary/20 hover:text-primary'
            } relative mb-2 mt-auto flex cursor-pointer items-center gap-3 rounded-lg p-3 text-sm font-medium transition-all duration-200 ease-in-out`}
            onClick={logUserOut}
          >
            <ArrowLeftStartOnRectangleIcon className="h-6 w-6" />
            {isSideNavCollapsed ? (
              <span
                className={`${
                  isSideNavCollapsed
                    ? 'absolute left-[130%] hidden bg-primary text-white opacity-0 group-hover:block group-hover:rounded-md group-hover:bg-primary group-hover:opacity-100 '
                    : 'hidden'
                } group-hover:delay-400 w-fit px-3 py-1 text-base transition-all duration-500 ease-in-out`}
              >
                {'Logout'}
              </span>
            ) : (
              'Logout'
            )}
          </button>
        </div>
      </nav>

      {/* MOBILE NAVIGATION */}
      <MobileNavBar
        isMobileMenuOpen={openMobileMenu}
        setIsMobileMenuOpen={toggleMobileMenu}
        pathname={pathname}
        currentPage={currentPage}
        setPage={setPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  )
}

export default SideNavBar
