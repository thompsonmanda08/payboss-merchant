'use client'

import { useState, useEffect } from 'react'
import useNavigationStore from '@/context/navigationStore'
import MobileNavBar from './MobileNavBar'

import {
  HomeIcon,
  BanknotesIcon,
  ArrowsRightLeftIcon,
  InboxArrowDownIcon,
  AdjustmentsVerticalIcon,
  Bars3BottomLeftIcon,
  DocumentChartBarIcon,
  CalculatorIcon,
  WrenchScrewdriverIcon,
  ArrowDownOnSquareStackIcon,
  ArrowUpOnSquareStackIcon,
  WalletIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { Button } from '../ui/Button'
import SideNavItems from './SideNavItems'
import { Skeleton } from '../ui/skeleton'
import WorkspaceSelection from '../containers/workspace/WorkspaceOptions'
import useNavigation from '@/hooks/useNavigation'
import Logo from '../base/Logo'
import { WORKSPACE_TYPES } from '@/lib/constants'

function SideNavBar({ workspaceSession }) {
  const { dashboardRoute, workspaceID, pathname } = useNavigation()
  const { openMobileMenu, toggleMobileMenu } = useNavigationStore()
  const [expandedSection, setExpandedSection] = useState(null)
  const { workspaceType } = workspaceSession

  // *************** COLLECTIONS AND INCOME *************** //
  const COLLECTION_SERVICES = [
    {
      ID: 'collections',
      name: 'Manage Income',
      Icon: InboxArrowDownIcon,
      subMenuItems: [
        // {
        //   name: 'Invoicing',
        //   href: `${dashboardRoute}/collections/invoicing`,
        //   Icon: NewspaperIcon,
        // },

        // {
        //   name: 'Payment Forms',
        //   href: `${dashboardRoute}/collections/payment-forms`,
        //   Icon: ClipboardDocumentIcon,
        // },
        // {
        //   name: 'Payment Links',
        //   href: `${dashboardRoute}/collections/payment-links`,
        //   Icon: LinkIcon,
        // },

        // {
        //   name: 'Subscriptions',
        //   href: `${dashboardRoute}/collections/subscriptions`,
        //   Icon: CreditCardIcon,
        // },

        // {
        //   name: 'Online Store',
        //   href: `${dashboardRoute}/collections/store`,
        //   Icon: BuildingStorefrontIcon,
        // },
        {
          name: 'Till Payments',
          href: `${dashboardRoute}/collections/till-collections`,
          Icon: CalculatorIcon,
        },
        {
          name: 'API Integration',
          href: `${dashboardRoute}/collections/api-integration`,
          Icon: AdjustmentsVerticalIcon,
        },
      ],
    },
  ]

  // *************** DISBURSEMENTS AND PAYOUTS ************ //
  const DISBURSEMENT_SERVICES = [
    {
      ID: 'payments',
      name: 'Make Payments',
      Icon: BanknotesIcon,
      // href: `${dashboardRoute}/payments`,
      subMenuItems: [
        {
          name: 'Transfers',
          href: `${dashboardRoute}/payments`,
          Icon: ArrowsRightLeftIcon,
        },
        // {
        //   name: 'ZESCO',
        //   href: `${dashboardRoute}/payments/zesco`,
        //   Icon: ReceiptPercentIcon,
        // },
        // {
        //   name: 'DSTV',
        //   href: `${dashboardRoute}paymentsexpenses/dstv`,
        //   Icon: ReceiptPercentIcon,
        // },
        // {
        //   name: 'Airtime',
        //   href: `${dashboardRoute}/payments/airtime`,
        //   Icon: PhoneArrowDownLeftIcon,
        // },
        // {
        //   name: 'Data Bundles',
        //   href: `${dashboardRoute}/payments/data-bundles`,
        //   Icon: ReceiptPercentIcon,
        // },
        // {
        //   name: 'Expense Cards',
        //   href: `${dashboardRoute}/payments/cards`,
        //   Icon: ReceiptPercentIcon,
        // },
      ],
    },
  ]

  // *************** DISBURSEMENTS REPORTS ************ //
  const DISBURSEMENT_REPORTS = [
    {
      name: 'Disbursement Reports',
      href: `${dashboardRoute}/reports/bulk-payments`,
      Icon: ArrowUpOnSquareStackIcon,
    },
    // {
    //   name: 'Single Payments',
    //   href: `${dashboardRoute}/reports/single-payments`,
    //   Icon: ArrowRightCircleIcon,
    // },
  ]

  // *************** COLLECTION REPORTS **************** //
  const COLLECTION_REPORTS = [
    {
      name: 'Collection Reports',
      href: `${dashboardRoute}/reports/collection`,
      Icon: ArrowDownOnSquareStackIcon,
    },
  ]

  // *************** ONLINE E-COMMERCE ******************** //
  const MISC_SERVICES = [
    // {
    //   ID: 'ecommerce',
    //   name: 'E-Commerce',
    //   Icon: BuildingStorefrontIcon,
    //   subMenuItems: [
    //     {
    //       name: 'Products',
    //       href: `${dashboardRoute}/ecommerce/products`,
    //       Icon: SwatchIcon,
    //     },
    //     {
    //       name: 'Online Store',
    //       href: `${dashboardRoute}/ecommerce/stores`,
    //       Icon: ShoppingCartIcon,
    //     },
    //   ],
    // },
  ]

  const SERVICES =
    workspaceType == WORKSPACE_TYPES[0].ID // "collection"
      ? COLLECTION_SERVICES
      : workspaceType == WORKSPACE_TYPES[1].ID //'disbursement'
        ? DISBURSEMENT_SERVICES
        : [...DISBURSEMENT_SERVICES, ...COLLECTION_SERVICES]

  const REPORTS =
    workspaceType == WORKSPACE_TYPES[0].ID
      ? COLLECTION_REPORTS
      : workspaceType == WORKSPACE_TYPES[1].ID
        ? DISBURSEMENT_REPORTS
        : [...DISBURSEMENT_REPORTS, ...COLLECTION_REPORTS]

  const SIDE_BAR_OPTIONS = [
    {
      name: 'Dashboard',
      ID: 'dashboard',
      href: dashboardRoute,
      Icon: HomeIcon,
    },
    // ****************************************************** //
    ...SERVICES,
    // ****************************************************** //

    // *************** REPORTS AND ANALYSIS ***************** //
    {
      ID: 'reports',
      name: 'Reports & Analytics',
      href: `${dashboardRoute}/reports`,
      Icon: DocumentChartBarIcon,
      subMenuItems: [
        {
          name: 'Wallet Statement',
          href: `${dashboardRoute}/reports/statement`,
          Icon: WalletIcon,
        },
        ...REPORTS,
      ],
    },
    // ****************************************************** //
    ...MISC_SERVICES,
    // ****************************************************** //
    {
      ID: 'workspace',
      name: 'Manage Workspace',
      Icon: WrenchScrewdriverIcon,
      href: `${dashboardRoute}/workspace-settings`,
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

  const currentWorkspaceID = pathname.split('')[2] || workspaceID

  if (!currentWorkspaceID) {
    // LOADING SKELETON
    return (
      <div className="flex h-full w-[380px] flex-col space-y-6 p-5">
        <Skeleton className="mb-4 h-16 w-full rounded-xl" />
        <div className="h-full space-y-4">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton className="h-10 w-full rounded-lg" key={index} />
          ))}
        </div>
        <Skeleton className="mt-auto h-[50px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <>
      <Button
        size="md"
        // isIconOnly
        className="absolute left-6 top-3 z-[99] h-8 min-w-5 bg-transparent p-2 hover:bg-primary/5 lg:hidden"
        onClick={toggleMobileMenu}
      >
        <Bars3BottomLeftIcon className="h-7 w-7  text-slate-700" />
      </Button>
      <div
        className={cn('hidden h-full w-[380px] lg:flex', {
          'flex-red-500': toggleMobileMenu,
        })}
      >
        <nav
          className={cn(
            `h-full w-full flex-col rounded-r-3xl bg-white p-5 transition-all duration-500 ease-in-out`,
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
      </div>
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
    </>
  )
}

export default SideNavBar
