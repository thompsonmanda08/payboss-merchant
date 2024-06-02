'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

import useAuthStore from '@/state/authStore'
import useNavigationStore from '@/state/navigationStore'
import MobileNavBar from './MobileNavBar'
import Link from 'next/link'

import {
  HomeIcon,
  Cog6ToothIcon,
  QueueListIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline'

export const SIDE_BAR_OPTIONS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    Icon: HomeIcon,
  },
  {
    name: 'Disbursements',
    href: '/dashboard/payments',
    Icon: QueueListIcon,
    subMenuItems: [
      {
        name: 'Bulk Payments',
        href: '/dashboard/payments/bulkpayments',
        Icon: QueueListIcon,
      },
      {
        name: 'Bulk Vouchers',
        href: '/dashboard/payments/bulkvouchers',
        Icon: QueueListIcon,
      },
      {
        name: 'Data Bundles',
        href: '/dashboard/payments/databundles',
        Icon: QueueListIcon,
      },
      {
        name: 'Airtime',
        href: '/dashboard/payments/airtime',
        Icon: QueueListIcon,
      },
    ],
  },
  {
    name: 'Collections',
    href: '/dashboard/collections',
    Icon: QueueListIcon,
    subMenuItems: [
      {
        name: 'API Integration',
        href: '/dashboard/collections/apiintegration',
        Icon: QueueListIcon,
      },
      {
        name: 'Payment Forms',
        href: '/dashboard/collections/paymentforms',
        Icon: QueueListIcon,
      },
      {
        name: 'Subscriptions',
        href: '/dashboard/collections/subscriptions',
        Icon: QueueListIcon,
      },
      {
        name: 'Invoicing',
        href: '/dashboard/collections/invoicing',
        Icon: QueueListIcon,
      },
      {
        name: 'Store',
        href: '/dashboard/collections/store',
        Icon: QueueListIcon,
      },
    ],
  },
  {
    name: 'Bill Payments',
    href: '/dashboard/bills',
    Icon: QueueListIcon,
    subMenuItems: [
      {
        name: 'Zesco',
        href: '/dashboard/bills/zesco',
        Icon: QueueListIcon,
      },
      {
        name: 'DSTV',
        href: '/dashboard/bills/dstv',
        Icon: QueueListIcon,
      },
      {
        name: 'Water',
        href: '/dashboard/bills/water',
        Icon: QueueListIcon,
      },
    ],
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
  const [expandedSection, setExpandedSection] = useState(null)

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

  function handleExpand(index) {
    setExpandedSection(expandedSection === index ? null : index)
  }

  useEffect(() => {
    SIDE_BAR_OPTIONS.forEach((option, index) => {
      if (option.subMenuItems) {
        option.subMenuItems.forEach(subItem => {
          if (pathname === subItem.href) {
            setExpandedSection(index)
          }
        })
      }
    })
  }, [pathname])

  function handleMainLinkClick() {
    setExpandedSection(null)
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
            {SIDE_BAR_OPTIONS.map(({ name, href, Icon, subMenuItems }, index) => (
              <div key={index} className="flex flex-col">
                {subMenuItems ? (
                  <button
                    onClick={() => handleExpand(index)}
                    className={`group rounded-sm  ${
                      pathname === href
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'bg-transparent font-normal text-slate-800 hover:bg-primary/10'
                    } 
                    ${isSideNavCollapsed ? 'justify-center' : 'gap-3'}
                      flex items-center p-3 text-sm font-medium transition-all duration-200 ease-in-out`}
                  >
                    <Icon className="h-6 w-6" />
                    {!isSideNavCollapsed && name}
                  </button>
                ) : (
                  <Link
                    href={href}
                    className={`group rounded-sm  ${
                      pathname === href
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'bg-transparent font-normal text-slate-800 hover:bg-primary/10'
                    } 
                    ${isSideNavCollapsed ? 'justify-center' : 'gap-3'}
                      flex items-center p-3 text-sm font-medium transition-all duration-200 ease-in-out`}
                    onClick={handleMainLinkClick}
                  >
                    <Icon className="h-6 w-6" />
                    {!isSideNavCollapsed && name}
                  </Link>
                )}
                {subMenuItems && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: expandedSection === index ? 'auto' : 0,
                      opacity: expandedSection === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden pl-6"
                  >
                    {subMenuItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className={`group rounded-sm ${
                          pathname === subItem.href
                            ? 'bg-primary/10 font-medium text-primary'
                            : 'bg-transparent font-normal text-slate-800 hover:bg-primary/10'
                        } 
                        ${isSideNavCollapsed ? 'justify-center' : 'gap-3'}
                          flex items-center p-3 text-sm font-medium transition-all duration-200 ease-in-out`}
                      >
                        <subItem.Icon className="h-6 w-6" />
                        {!isSideNavCollapsed && subItem.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
          <button
            className={`group ${
              isSideNavCollapsed
                ? 'mx-auto w-12 justify-center bg-primary/20 text-primary hover:rounded-md hover:bg-primary hover:text-white'
                : 'bg-primary/10 font-medium text-slate-600 hover:bg-primary/20 hover:text-primary'
            } relative mb-2 mt-auto flex cursor-pointer items-center gap-3 rounded-lg p-3 text-sm font-medium transition-all duration-200 ease-in-out`}
            onClick={logUserOut}
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
            {!isSideNavCollapsed && 'Logout'}
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
