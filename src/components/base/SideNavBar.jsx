'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

import useAuthStore from '@/context/authStore'
import useNavigationStore from '@/context/navigationStore'
import MobileNavBar from './MobileNavBar'
import Link from 'next/link'

import {
  HomeIcon,
  Cog6ToothIcon,
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
  Bars3BottomLeftIcon,
  ChevronDownIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  DocumentChartBarIcon,
  LinkIcon,
  CalculatorIcon,
  TicketIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  BriefcaseIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { Logo } from '.'
import { PowerIcon } from '@heroicons/react/24/solid'
import { Button } from '../ui/Button'

export const SIDE_BAR_OPTIONS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    Icon: HomeIcon,
  },

  {
    name: 'Make Payments',
    href: '/dashboard/make-payments',
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
        Icon: TicketIcon,
      },
    ],
  },
  {
    name: 'Manage Income',
    href: '/dashboard/collections',
    Icon: InboxArrowDownIcon,
    subMenuItems: [
      {
        name: 'Invoicing',
        href: '/dashboard/collections/invoicing',
        Icon: NewspaperIcon,
      },

      {
        name: 'Payment Forms',
        href: '/dashboard/collections/payment-forms',
        Icon: ClipboardDocumentIcon,
      },
      {
        name: 'Payment Links',
        href: '/dashboard/collections/payment-links',
        Icon: LinkIcon,
      },

      {
        name: 'Subscriptions',
        href: '/dashboard/collections/subscriptions',
        Icon: CreditCardIcon,
      },

      {
        name: 'Online Store',
        href: '/dashboard/collections/store',
        Icon: BuildingStorefrontIcon,
      },
      {
        name: 'Till Payments',
        href: '/dashboard/collections/store',
        Icon: CalculatorIcon,
      },
      {
        name: 'API Integration',
        href: '/dashboard/collections/api-integration',
        Icon: AdjustmentsVerticalIcon,
      },
    ],
  },
  {
    name: 'Manage Expenses',
    href: '/dashboard/payments',
    Icon: ReceiptPercentIcon,
    subMenuItems: [
      {
        name: 'ZESCO',
        href: '/dashboard/payments/zesco',
        Icon: ReceiptPercentIcon,
      },
      {
        name: 'DSTV',
        href: '/dashboard/payments/dstv',
        Icon: ReceiptPercentIcon,
      },
      {
        name: 'Airtime',
        href: '/dashboard/payments/airtime',
        Icon: PhoneArrowDownLeftIcon,
      },
      {
        name: 'Data Bundles',
        href: '/dashboard/payments/data-bundles',
        Icon: ReceiptPercentIcon,
      },
      {
        name: 'Expense Cards',
        href: '/dashboard/payments/data-bundles',
        Icon: ReceiptPercentIcon,
      },
    ],
  },
  {
    name: 'Reports & Analytics',
    href: '/dashboard/reports',
    Icon: DocumentChartBarIcon,
  },
  {
    name: 'Manage Account ',
    href: '/dashboard/settings',
    Icon: WrenchScrewdriverIcon,
    subMenuItems: [
      {
        name: 'Account Verification',
        href: '/dashboard/approval-status',
        Icon: CheckBadgeIcon,
      },
      {
        name: 'Team',
        href: '/dashboard/users',
        Icon: UserGroupIcon,
      },
      {
        name: 'Products',
        href: '/dashboard/products',
        Icon: ShoppingCartIcon,
      },
      {
        name: 'Services',
        href: '/dashboard/services',
        Icon: BriefcaseIcon,
      },
      {
        name: 'Preferences',
        href: '/dashboard/settings',
        Icon: Cog6ToothIcon,
      },
    ],
  },
]

function SideNavBar() {
  const pathname = usePathname()
  const { logUserOut } = useAuthStore()
  const [expandedSection, setExpandedSection] = useState(null)

  const { openMobileMenu, toggleMobileMenu } = useNavigationStore()

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
      <Button
        isIconOnly
        className="absolute left-6 top-0 z-50 w-fit bg-transparent p-2 hover:bg-primary/5 lg:hidden"
        onClick={toggleMobileMenu}
      >
        <Bars3BottomLeftIcon className="h-7 w-7 text-slate-700" />
      </Button>
      <nav
        className={cn(
          `sticky z-20 hidden h-[95svh] w-full min-w-[220px] max-w-[320px] bg-white px-4 pb-10 transition-all duration-500 ease-in-out lg:block `,
        )}
      >
        <div className="group flex justify-start p-2">
          <div
            className={`flex translate-x-2 flex-col items-center transition-all duration-300 ease-in-out md:translate-x-4 lg:translate-x-0`}
          >
            <Link href="/" aria-label="Home">
              <Logo className="my-auto mt-2" />
            </Link>
          </div>
        </div>
        <SideNavItems
          pathname={pathname}
          expandedSection={expandedSection}
          handleExpand={handleExpand}
          handleMainLinkClick={handleMainLinkClick}
          toggleSideNav={toggleSideNav}
          logUserOut={logUserOut}
          isMobileMenuOpen={openMobileMenu}
          toggleMobileMenu={toggleMobileMenu}
        />
      </nav>

      {/* MOBILE NAVIGATION */}
      <MobileNavBar
        isMobileMenuOpen={openMobileMenu}
        toggleMobileMenu={toggleMobileMenu}
        pathname={pathname}
        expandedSection={expandedSection}
        handleExpand={handleExpand}
        handleMainLinkClick={handleMainLinkClick}
        logUserOut={logUserOut}
      />
    </>
  )
}

export function NavItemIcon({ isSelected, Icon, activeLayer, isExpanded }) {
  return (
    <div
      className={cn(
        'z-10 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-none shadow-slate-700/10',
        {
          'bg-primary font-bold': isSelected,
          'bg-primary text-white': activeLayer,
          ' shadow-none': isExpanded,
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
  handleExpand,
  handleMainLinkClick,
  handleLinkClick,
  logUserOut,
}) {
  return (
    <div className="flex h-full w-full flex-col overflow-clip ">
      <div className="no-scrollbar flex h-full w-full flex-col gap-2 divide-y divide-slate-100/50 overflow-y-auto ">
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
                      '  font-bold text-primary shadow-none shadow-slate-700/10':
                        isExpanded,

                      'rounded-lg bg-primary/10 font-bold text-primary shadow-none shadow-slate-400/10':
                        activeLayer,

                      'rounded-b-none': activeLayer && isExpanded,
                    },
                  )}
                >
                  <NavItemIcon
                    isSelected={isSelected}
                    activeLayer={activeLayer}
                    isExpanded={isExpanded}
                    Icon={Icon}
                  />

                  <span
                    className={cn({
                      'font-bold text-primary': isSelected,
                    })}
                  >
                    {name}
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
                      'rounded-lg bg-primary/10 font-medium text-primary shadow-none shadow-slate-400/10':
                        isSelected,
                    },
                  )}
                  onClick={handleMainLinkClick}
                >
                  <NavItemIcon
                    isSelected={isSelected}
                    isExpanded={isExpanded}
                    Icon={Icon}
                  />

                  {name}
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
                  className="overflow-hidden rounded-lg rounded-t-none bg-white pl-6 shadow-none shadow-slate-700/5"
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
                        {subItem.name}
                      </span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          )
        })}
      </div>
      <Button className={'flex items-center gap-2'} onClick={logUserOut}>
        <PowerIcon className="h-5 w-5" />
        Logout
      </Button>
    </div>
  )
}

export default SideNavBar
