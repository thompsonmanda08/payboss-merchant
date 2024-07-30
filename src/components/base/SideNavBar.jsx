'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
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
  ArrowsRightLeftIcon,
  PhoneArrowDownLeftIcon,
  InboxArrowDownIcon,
  AdjustmentsVerticalIcon,
  ClipboardDocumentIcon,
  BuildingStorefrontIcon,
  CreditCardIcon,
  ReceiptPercentIcon,
  Bars3BottomLeftIcon,
  ChevronDownIcon,
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
import { PlusIcon, PowerIcon } from '@heroicons/react/24/solid'
import { Button } from '../ui/Button'
import { logUserOut } from '@/app/_actions/auth-actions'
import WorkspaceSelection from './WorkspaceSelection'

export const SIDE_BAR_OPTIONS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    Icon: HomeIcon,
  },

  {
    name: 'Make Payments',
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
        name: 'Products',
        href: '/dashboard/products',
        Icon: ShoppingCartIcon,
      },
      {
        name: 'Online Store',
        href: '/dashboard/products',
        Icon: ShoppingCartIcon,
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
    <div className="h-full w-full min-w-[220px] max-w-[320px]">
      <Button
        size="sm"
        // isIconOnly
        className="absolute left-6 top-3 z-50 h-8 min-w-5 bg-transparent p-2 hover:bg-primary/5 lg:hidden"
        onClick={toggleMobileMenu}
      >
        <Bars3BottomLeftIcon className="h-7 w-7  text-slate-700" />
      </Button>
      <nav
        className={cn(
          `z-20 hidden h-full flex-col rounded-r-3xl bg-white p-5 transition-all duration-500 ease-in-out lg:flex`,
        )}
      >
        <Logo />
        <div className="relative py-2">
          <WorkspaceSelection />
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
    </div>
  )
}

export function NavItemIcon({ isSelected, Icon, activeLayer, isExpanded }) {
  return (
    <Button
      isIconOnly
      className={cn(
        'z-10 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-none shadow-slate-700/10 transition-all duration-500 ease-in-out group-hover:bg-primary group-hover:text-white',
        {
          'bg-primary font-bold': isSelected,
          'bg-primary text-white': activeLayer,
          ' shadow-none': isExpanded,
        },
      )}
    >
      <Icon
        fontSize={18}
        className={cn('h-5 w-5 text-slate-500 group-hover:text-white', {
          'text-white': isSelected,
        })}
      />
    </Button>
  )
}

export function SideNavItems({
  pathname,
  expandedSection,
  handleExpand,
  handleMainLinkClick,
  handleLinkClick,
}) {
  async function handleLogOut() {
    const isLoggedOut = await logUserOut()
    if (isLoggedOut) {
      window.location.href = '/'
    }
  }
  return (
    <>
      <ul className="mb-auto flex w-full flex-col divide-y divide-slate-100/50 ">
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
            <li key={index} className="flex flex-col">
              {subMenuItems ? (
                <div
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
                </div>
              ) : (
                <Link
                  href={href}
                  className={cn(
                    `group flex items-center gap-3 rounded-sm bg-transparent p-3 text-sm font-medium text-slate-600 transition-all duration-200 ease-in-out `,
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
            </li>
          )
        })}
      </ul>
      <hr className="mt-auto" />
      <div
        onClick={handleLogOut}
        className={cn(
          `group flex items-center gap-3 rounded-lg bg-transparent p-3 text-sm font-bold text-slate-500 shadow-none transition-all duration-200 ease-in-out hover:text-primary`,
        )}
      >
        <NavItemIcon isSelected={true} activeLayer={false} Icon={PowerIcon} />
        Log out
      </div>
    </>
  )
}

export default SideNavBar
