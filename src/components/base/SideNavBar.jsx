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
  BanknotesIcon,
  NewspaperIcon,
  IdentificationIcon,
  ArrowsRightLeftIcon,
  PhoneArrowDownLeftIcon,
  ChartBarSquareIcon,
  InboxArrowDownIcon,
  AdjustmentsVerticalIcon,
  ClipboardDocumentIcon,
  BuildingStorefrontIcon,
  CreditCardIcon,
  ReceiptPercentIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { ChevronDownIcon } from '@radix-ui/react-icons'

export const SIDE_BAR_OPTIONS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    Icon: HomeIcon,
  },
  {
    name: 'Invoicing',
    href: '/dashboard/collections/invoicing',
    Icon: NewspaperIcon,
  },
  {
    name: 'Payments',
    href: '/dashboard/payments',
    Icon: BanknotesIcon,
    subMenuItems: [
      {
        name: 'Direct Payments',
        href: '/dashboard/payments/direct',
        Icon: ArrowsRightLeftIcon,
      },
      {
        name: 'Payment Vouchers',
        href: '/dashboard/payments/vouchers',
        Icon: IdentificationIcon,
      },
      {
        name: 'Data Bundles',
        href: '/dashboard/payments/data-bundles',
        Icon: ChartBarSquareIcon,
      },
      {
        name: 'Airtime',
        href: '/dashboard/payments/airtime',
        Icon: PhoneArrowDownLeftIcon,
      },
    ],
  },
  {
    name: 'Collections',
    href: '/dashboard/collections',
    Icon: InboxArrowDownIcon,
    subMenuItems: [
      {
        name: 'API Integration',
        href: '/dashboard/collections/api-integration',
        Icon: AdjustmentsVerticalIcon,
      },
      {
        name: 'Payment Forms',
        href: '/dashboard/collections/payment-forms',
        Icon: ClipboardDocumentIcon,
      },
      {
        name: 'Subscriptions',
        href: '/dashboard/collections/subscriptions',
        Icon: CreditCardIcon,
      },

      {
        name: 'Store',
        href: '/dashboard/collections/store',
        Icon: BuildingStorefrontIcon,
      },
    ],
  },
  {
    name: 'Bill Payments',
    href: '/dashboard/bills',
    Icon: ReceiptPercentIcon,
    subMenuItems: [
      {
        name: 'Zesco',
        href: '/dashboard/bills/zesco',
        Icon: ReceiptPercentIcon,
      },
      {
        name: 'DSTV',
        href: '/dashboard/bills/dstv',
        Icon: ReceiptPercentIcon,
      },
      {
        name: 'Water',
        href: '/dashboard/bills/water',
        Icon: ReceiptPercentIcon,
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
        option.subMenuItems.forEach((subItem) => {
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
        className={cn(
          `z-20 hidden h-full max-h-screen w-full min-w-[220px] max-w-[320px] bg-white px-4 pb-10 shadow-md shadow-slate-800/5 transition-all duration-500 ease-in-out lg:block`,
          { 'max-w-[96px] items-center': isSideNavCollapsed },
        )}
      >
        <div className="flex h-full w-full flex-col">
          {/* MENU ITEMS CONTAINER */}
          <div className="mt-6 flex h-full w-full flex-col gap-4">
            {SIDE_BAR_OPTIONS.map(
              ({ name, href, Icon, subMenuItems }, index) => (
                <div key={index} className="flex flex-col">
                  {subMenuItems ? (
                    <button
                      onClick={() => handleExpand(index)}
                      className={cn(
                        `group flex items-center gap-3 rounded-sm bg-transparent p-3
                      text-sm font-medium text-slate-800 transition-all duration-200 ease-in-out hover:bg-primary/10`,
                        {
                          'bg-primary/10 font-medium text-primary':
                            pathname === href,
                          'justify-center': isSideNavCollapsed,
                        },
                      )}
                    >
                      <Icon fontSize={18} className="h-5 w-5" />
                      {!isSideNavCollapsed && name}
                      <ChevronDownIcon
                        className={cn(
                          'ml-auto h-4 w-4 transition-all duration-300 ease-in-out',
                          {
                            'rotate-180': expandedSection === index,
                          },
                        )}
                      />
                    </button>
                  ) : (
                    <Link
                      href={href}
                      className={cn(
                        `group flex items-center gap-3 rounded-sm bg-transparent p-3 text-sm font-medium text-slate-800 transition-all duration-200 ease-in-out hover:bg-primary/10`,
                        {
                          'bg-primary/10 font-medium text-primary':
                            pathname === href,
                          'justify-center': isSideNavCollapsed,
                        },
                      )}
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
                          className={cn(
                            `group flex items-center gap-3 rounded-sm bg-transparent p-3 text-sm font-medium text-slate-800 transition-all duration-200 ease-in-out hover:bg-primary/10`,
                            {
                              'bg-primary/10 font-medium text-primary':
                                pathname === subItem.href,
                              'justify-center': isSideNavCollapsed,
                            },
                          )}
                        >
                          <subItem.Icon className="h-5 w-5" />
                          {!isSideNavCollapsed && subItem.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ),
            )}
          </div>
          <button
            className={cn(
              `group relative mb-2 mt-auto flex cursor-pointer items-center gap-3 rounded-lg bg-primary/10 p-3 text-sm font-medium text-slate-600 transition-all duration-200 ease-in-out hover:bg-primary/20 hover:text-primary`,
              {
                'mx-auto w-12 justify-center bg-primary/20 text-primary hover:rounded-md hover:bg-primary hover:text-white':
                  isSideNavCollapsed,
              },
            )}
            onClick={logUserOut}
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
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
