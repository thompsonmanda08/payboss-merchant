'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
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
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { Logo, SettingsSideBar } from '.'
import { Button } from '../ui/Button'
import SideNavItems from './SideNavItems'
import useWorkspaces from '@/hooks/useWorkspaces'
import { Skeleton } from '../ui/skeleton'
import WorkspaceSelection from '../containers/workspace/WorkspaceSelection'
import useNavigation from '@/hooks/useNavigation'

function SideNavBar() {
  const pathname = usePathname()
  const [expandedSection, setExpandedSection] = useState(null)
  const { openMobileMenu, toggleMobileMenu } = useNavigationStore()
  const { activeWorkspace, workspaceID } = useWorkspaces()
  const { dashboardRoute, settingsPathname, isProfile, isSettingsPage } =
    useNavigation()

  const SIDE_BAR_OPTIONS = [
    {
      name: 'Dashboard',
      href: dashboardRoute,
      Icon: HomeIcon,
    },

    {
      name: 'Make Payments',
      Icon: BanknotesIcon,
      subMenuItems: [
        {
          name: 'Direct Payments',
          href: `${dashboardRoute}/payments/direct`,
          Icon: ArrowsRightLeftIcon,
        },
        {
          name: 'Payment Vouchers',
          href: `${dashboardRoute}/payments/vouchers`,
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
          href: `${dashboardRoute}/collections/invoicing`,
          Icon: NewspaperIcon,
        },

        {
          name: 'Payment Forms',
          href: `${dashboardRoute}/collections/payment-forms`,
          Icon: ClipboardDocumentIcon,
        },
        {
          name: 'Payment Links',
          href: `${dashboardRoute}/collections/payment-links`,
          Icon: LinkIcon,
        },

        {
          name: 'Subscriptions',
          href: `${dashboardRoute}/collections/subscriptions`,
          Icon: CreditCardIcon,
        },

        {
          name: 'Online Store',
          href: `${dashboardRoute}/collections/store`,
          Icon: BuildingStorefrontIcon,
        },
        {
          name: 'Till Payments',
          href: `${dashboardRoute}/collections/store`,
          Icon: CalculatorIcon,
        },
        {
          name: 'API Integration',
          href: `${dashboardRoute}/collections/api-integration`,
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
          href: `${dashboardRoute}/payments/zesco`,
          Icon: ReceiptPercentIcon,
        },
        {
          name: 'DSTV',
          href: `${dashboardRoute}/payments/dstv`,
          Icon: ReceiptPercentIcon,
        },
        {
          name: 'Airtime',
          href: `${dashboardRoute}/payments/airtime`,
          Icon: PhoneArrowDownLeftIcon,
        },
        {
          name: 'Data Bundles',
          href: `${dashboardRoute}/payments/data-bundles`,
          Icon: ReceiptPercentIcon,
        },
        {
          name: 'Expense Cards',
          href: `${dashboardRoute}/payments/data-bundles`,
          Icon: ReceiptPercentIcon,
        },
      ],
    },
    {
      name: 'Reports & Analytics',
      href: `${dashboardRoute}/reports`,
      Icon: DocumentChartBarIcon,
    },
    {
      name: 'Manage Account ',
      href: `${dashboardRoute}/settings`,
      Icon: WrenchScrewdriverIcon,
      subMenuItems: [
        {
          name: 'Products',
          href: `${dashboardRoute}/products`,
          Icon: ShoppingCartIcon,
        },
        {
          name: 'Online Store',
          href: `${dashboardRoute}/products`,
          Icon: ShoppingCartIcon,
        },
      ],
    },
  ]

  function handleExpand(index) {
    setExpandedSection(expandedSection === index ? null : index)
  }

  function handleMainLinkClick() {
    setExpandedSection(null)
    handleLinkClick()
  }

  function handleLinkClick() {
    if (openMobileMenu) {
      toggleMobileMenu()
    }
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

  // SETTINGS PAGE NEEDS A DIFFERENT SIDE BAR
  if (isSettingsPage) {
    return (
      <SettingsSideBar
        backButtonText="Dashboard Home"
        title={activeWorkspace?.workspace}
        isProfile={isProfile}
        settingsPathname={settingsPathname}
      />
    )
  }

  // SETTINGS PAGE NEEDS A DIFFERENT SIDE BAR
  if (workspaceID) {
    return (
      <div className="h-full max-w-[320px] lg:w-full">
        <Button
          size="sm"
          // isIconOnly
          className="absolute left-6 top-3 z-[99] h-8 min-w-5 bg-transparent p-2 hover:bg-primary/5 lg:hidden"
          onClick={toggleMobileMenu}
        >
          <Bars3BottomLeftIcon className="h-7 w-7  text-slate-700" />
        </Button>
        <nav
          className={cn(
            `z-20 hidden h-full w-full flex-col rounded-r-3xl bg-white p-5 transition-all duration-500 ease-in-out lg:flex`,
          )}
        >
          <Logo href={dashboardRoute} />
          <div className="relative py-2">
            <WorkspaceSelection />
          </div>
          <SideNavItems
            navBarItems={SIDE_BAR_OPTIONS}
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
          navBarItems={SIDE_BAR_OPTIONS}
        />
      </div>
    )
  }

  // LOADING SKELETON
  return (
    <div className="flex h-full max-w-[320px] flex-col space-y-6 p-5 lg:w-full lg:min-w-[220px]">
      <Skeleton className="h-[50px] w-[250px] rounded-xl" />
      <div className="space-y-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <Skeleton className="h-10 w-[250px]" key={index} />
        ))}
      </div>
      <Skeleton className="mt-auto h-[50px] w-[250px] rounded-xl" />
    </div>
  )
}

export default SideNavBar
