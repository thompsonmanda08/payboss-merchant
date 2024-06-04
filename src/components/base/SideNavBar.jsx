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
    handleLinkClick()
  }

  function handleLinkClick() {
    if (openMobileMenu) {
      toggleMobileMenu()
    }
  }

  return (
    <>
      <nav
        className={cn(
          `z-20 hidden h-full max-h-screen w-full min-w-[220px] max-w-[320px] px-4 pb-10 transition-all duration-500 ease-in-out lg:block`,
          { 'max-w-[96px] items-center': isSideNavCollapsed },
        )}
      >
        <SideNavItems
          pathname={pathname}
          expandedSection={expandedSection}
          isSideNavCollapsed={isSideNavCollapsed}
          handleExpand={handleExpand}
          handleMainLinkClick={handleMainLinkClick}
          toggleSideNav={toggleSideNav}
          logUserOut={logUserOut}
        />
      </nav>

      {/* MOBILE NAVIGATION */}
      <MobileNavBar
        isMobileMenuOpen={openMobileMenu}
        setIsMobileMenuOpen={toggleMobileMenu}
        pathname={pathname}
        expandedSection={expandedSection}
        isSideNavCollapsed={isSideNavCollapsed}
        handleExpand={handleExpand}
        handleMainLinkClick={handleMainLinkClick}
        toggleSideNav={toggleSideNav}
        logUserOut={logUserOut}
      />
    </>
  )
}

export function NavItemIcon({ isSelected, Icon, activeLayer }) {
  return (
    <div
      className={cn(
        'z-10 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-xl shadow-slate-700/10',
        {
          'bg-primary font-bold': isSelected,
          'bg-primary text-white': activeLayer,
        },
      )}
    >
      <Icon
        fontSize={18}
        className={cn('h-5 w-5', {
          'text-white': isSelected,
        })}
      />
    </div>
  )
}

export function SideNavItems({
  pathname,
  expandedSection,
  isSideNavCollapsed,
  handleExpand,
  handleMainLinkClick,
  toggleSideNav,
  handleLinkClick,
  logUserOut,
}) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="mt-6 flex h-full w-full flex-col gap-2">
        {SIDE_BAR_OPTIONS.map(({ name, href, Icon, subMenuItems }, index) => {
          const isExpanded = expandedSection === index

          const currentPage =
            subMenuItems != undefined && subMenuItems.length > 0
              ? subMenuItems.href
              : href
          const isSelected = pathname === currentPage

          const activeLayer = pathname
            .split('/')
            .includes(name.toLocaleLowerCase())

          return (
            <div key={index} className="flex flex-col">
              {subMenuItems ? (
                <button
                  onClick={() => handleExpand(index)}
                  className={cn(
                    `group flex items-center gap-3 rounded-sm bg-transparent p-3
                      text-sm font-medium text-gray-600 transition-all duration-200 ease-in-out`,
                    {
                      'justify-center': isSideNavCollapsed,
                      ' bg-white font-bold text-primary shadow-xl shadow-slate-700/10':
                        isExpanded,

                      'rounded-lg bg-white font-bold text-primary shadow-xl shadow-slate-400/10':
                        activeLayer,

                      'rounded-b-none': activeLayer && isExpanded,
                    },
                  )}
                >
                  <NavItemIcon
                    isSelected={isSelected}
                    activeLayer={activeLayer}
                    Icon={Icon}
                  />

                  <span
                    className={cn(' ', {
                      'font-bold text-primary': isSelected,
                    })}
                  >
                    {!isSideNavCollapsed && name}
                  </span>
                  <ChevronDownIcon
                    className={cn(
                      'ml-auto h-4 w-4 transition-all duration-300 ease-in-out',
                      {
                        'rotate-180': isExpanded,
                      },
                    )}
                  />
                </button>
              ) : (
                <Link
                  href={href}
                  className={cn(
                    `group flex items-center gap-3 rounded-sm bg-transparent p-3 text-sm font-medium text-slate-800 transition-all duration-200 ease-in-out `,
                    {
                      'rounded-lg bg-white font-medium text-primary shadow-xl shadow-slate-400/10':
                        isSelected,
                      'justify-center': isSideNavCollapsed,
                    },
                  )}
                  onClick={handleMainLinkClick}
                >
                  <NavItemIcon isSelected={isSelected} Icon={Icon} />

                  {!isSideNavCollapsed && name}
                </Link>
              )}
              {subMenuItems && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: isExpanded ? 'auto' : 0,
                    opacity: isExpanded ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden rounded-lg rounded-t-none bg-white pl-6 shadow-xl shadow-slate-700/5"
                >
                  {subMenuItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subItem.href}
                      onClick={handleLinkClick}
                      className={cn(
                        `group relative ml-4 flex items-center gap-3 rounded-sm  bg-transparent p-3 text-sm font-medium text-gray-600 text-primary/80 transition-all duration-200 ease-in-out before:absolute before:-left-5 before:-top-10 before:h-16 before:w-6 before:rounded-lg before:border-b before:border-l-[2px] before:border-r-8 before:border-t-8 before:border-[#e4ebf6] before:border-r-transparent before:border-t-transparent before:content-[""] md:ml-6`,
                        {
                          'bg-primary/5 font-medium': pathname === subItem.href,
                        },
                      )}
                    >
                      <subItem.Icon
                        className={cn('h-5 w-5 text-gray-600', {
                          'font-bold text-primary': pathname === subItem.href,
                        })}
                      />
                      <span
                        className={cn('text-gray-600', {
                          'font-bold text-primary': pathname === subItem.href,
                        })}
                      >
                        {' '}
                        {!isSideNavCollapsed && subItem.name}
                      </span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          )
        })}
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
  )
}

export default SideNavBar
