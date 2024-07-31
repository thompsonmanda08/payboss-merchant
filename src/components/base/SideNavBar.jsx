'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

import useAuthStore from '@/context/authStore'
import useNavigationStore from '@/context/navigationStore'
import MobileNavBar from './MobileNavBar'

import {
  HomeIcon,
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
  DocumentChartBarIcon,
  LinkIcon,
  CalculatorIcon,
  TicketIcon,
  WrenchScrewdriverIcon,
  ShoppingCartIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { Logo, SettingsSideBar } from '.'
import { Button } from '../ui/Button'
import WorkspaceSelection from './WorkspaceSelection'
import SideNavItems from './SideNavItems'
import useConfigStore from '@/context/configStore'
import { Card, Skeleton } from '@nextui-org/react'

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
  const [expandedSection, setExpandedSection] = useState(null)
  const { openMobileMenu, toggleMobileMenu } = useNavigationStore()
  const { activeWorkspace } = useConfigStore((state) => state)
  const workspaceID = activeWorkspace?.ID

  const settingsPathname = `/dashboard/${workspaceID}/settings`
  const isProfile = settingsPathname == pathname
  const isSettingsPage = pathname.split('/')[3]?.toLowerCase() == 'settings'

  const WORKSPACE_SETTINGS = [
    {
      name: 'People',
      Icon: UserGroupIcon,
      href: settingsPathname + '/users',
    },
  ]

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

  // SETTINGS PAGE NEEDS A DIFFERENT SIDE BAR
  if (isSettingsPage) {
    return (
      <SettingsSideBar
        backButtonText="Dashboard Home"
        title={activeWorkspace?.workspace}
        options={{ title: 'workspace_settings', links: WORKSPACE_SETTINGS }}
        isProfile={isProfile}
        settingsPathname={settingsPathname}
      />
    )
  }

  // SETTINGS PAGE NEEDS A DIFFERENT SIDE BAR
  if (workspaceID) {
    return (
      <div className="h-full max-w-[320px] lg:w-full lg:min-w-[220px]">
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
            `z-20 hidden h-full max-w-[280px] flex-col rounded-r-3xl bg-white p-5 transition-all duration-500 ease-in-out lg:flex`,
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
        />
      </div>
    )
  }

  return <></>
}

export default SideNavBar
