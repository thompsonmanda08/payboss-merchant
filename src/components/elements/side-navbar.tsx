'use client';

import {
  Banknote,
  BanknoteArrowDown,
  BanknoteArrowUp,
  BriefcaseBusiness,
  CalculatorIcon,
  ChevronRightIcon,
  FileChartColumn,
  FileSliders,
  FolderCog,
  HandCoins,
  HomeIcon,
  Menu,
  Receipt,
  Settings,
  SlidersVertical,
  WalletIcon,
} from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import Logo from '@/components/base/payboss-logo';
import SoftBoxIcon from '@/components/base/soft-box-icon';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/custom-spinner';
import DropdownButton from '@/components/ui/dropdown-button';
import { Skeleton } from '@/components/ui/skeleton';
import { useWorkspaceInit } from '@/hooks/use-query-data';
import { WORKSPACE_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';

import MobileNavBar from './mobile-menu';
import SideNavItems from './side-nav-items';
import { User } from '@/types/account';

type SideNavItem = {
  ID?: string;
  name: string;
  href?: string;
  Icon: any;
  subMenuItems?: SideNavItem[];
};

function SideNavBar({ user }: { user: User }) {
  const pathname = usePathname();

  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  function toggleMobileMenu() {
    setOpenMobileMenu(!openMobileMenu);
  }

  const params = useParams();
  const workspaceID = String(params.workspaceID);

  const {
    data: workspaceInit,
    isLoading,
    isPending,
  } = useWorkspaceInit(workspaceID);

  const dashboardRoute = `/dashboard/${workspaceID}`;

  const workspaceSession = workspaceInit?.data || {};
  const workspaces = workspaceSession.workspaces || [];
  const activeWorkspace = workspaceSession?.activeWorkspace || {};
  const workspaceType = workspaceSession?.workspaceType || '';

  // *************** COLLECTIONS AND INCOME *************** //
  const COLLECTION_SERVICES: SideNavItem[] = [
    {
      ID: 'collections',
      name: 'Manage Income',
      Icon: BanknoteArrowUp,
      subMenuItems: [
        {
          name: 'API Integration',
          href: `${dashboardRoute}/collections/api-integration`,
          Icon: SlidersVertical,
        },
        {
          name: 'Till Payments',
          href: `${dashboardRoute}/collections/till-collections`,
          Icon: CalculatorIcon,
        },
        // {
        //   name: 'Subscriptions',
        //   href: `${dashboardRoute}/collections/subscriptions`,
        //   Icon: TicketPercentIcon,
        // },
        {
          name: 'Invoicing',
          href: `${dashboardRoute}/collections/invoicing`,
          Icon: FileSliders,
        },

        // {
        //   name: 'Subscriptions',
        //   href: `${dashboardRoute}/collections/subscriptions`,
        //   Icon: CreditCardIcon,
        // },
      ],
    },
  ];

  // *************** DISBURSEMENTS AND PAYOUTS ************ //
  const DISBURSEMENT_SERVICES = [
    {
      ID: 'payments',
      name: 'Manage Payments',
      Icon: Banknote,
      // href: `${dashboardRoute}/payments`,
      subMenuItems: [
        {
          name: 'Disbursements',
          href: `${dashboardRoute}/payments`,
          Icon: BanknoteArrowDown,
        },
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
  ];

  // *************** BILL PAYMENTS ******************** //
  const BILL_PAYMENT_SERVICES: SideNavItem[] = [
    {
      name: 'Bill Payments',
      href: `${dashboardRoute}/bills`,
      Icon: HandCoins,
    },
  ];

  // *************** DISBURSEMENTS REPORTS ************ //
  const DISBURSEMENT_REPORTS: SideNavItem[] = [
    {
      name: 'Disbursements',
      href: `${dashboardRoute}/reports/disbursements`,
      Icon: BanknoteArrowDown,
    },
  ];

  // *************** COLLECTION REPORTS **************** //
  const COLLECTION_REPORTS: SideNavItem[] = [
    {
      name: 'Collections',
      href: `${dashboardRoute}/reports/collection`,
      Icon: BanknoteArrowUp,
    },
  ];

  const BILL_PAYMENTS_REPORTS: SideNavItem[] = [
    {
      name: 'Bill Payment Reports',
      href: `${dashboardRoute}/reports/bills`,
      Icon: Receipt,
    },
  ];

  // *************** ONLINE E-COMMERCE ******************** //
  const MISC_SERVICES: SideNavItem[] = [
    // {
    //   ID: 'ecommerce',
    //   name: 'Online Stores',
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
  ];

  // BASED ON WORKSPACE TYPE, SELECT SERVICES
  const SERVICES =
    workspaceType == WORKSPACE_TYPES[0].ID // "collection"
      ? COLLECTION_SERVICES
      : workspaceType == WORKSPACE_TYPES[1].ID //'disbursement'
        ? DISBURSEMENT_SERVICES
        : workspaceType == WORKSPACE_TYPES[2].ID //'bills'
          ? BILL_PAYMENT_SERVICES
          : [
              ...DISBURSEMENT_SERVICES,
              ...COLLECTION_SERVICES,
              ...BILL_PAYMENT_SERVICES,
            ];

  // BASED ON WORKSPACE TYPE, SELECT REPORTS
  const REPORTS =
    workspaceType == WORKSPACE_TYPES[0].ID
      ? COLLECTION_REPORTS
      : workspaceType == WORKSPACE_TYPES[1].ID
        ? DISBURSEMENT_REPORTS
        : workspaceType == WORKSPACE_TYPES[2].ID
          ? BILL_PAYMENTS_REPORTS
          : [
              ...DISBURSEMENT_REPORTS,
              ...COLLECTION_REPORTS,
              ...BILL_PAYMENTS_REPORTS,
            ];

  const SIDE_BAR_OPTIONS: SideNavItem[] = [
    {
      name: 'Overview',
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
      Icon: FileChartColumn,
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
      Icon: FolderCog,
      href: `${dashboardRoute}/workspace-settings`,
    },
  ];

  // *************** WORKSPACES DROPDOWN ***************** //
  const WORKSPACES_OPTIONS = [
    {
      key: 'home',
      name: 'Home',
      href: '/workspaces',
      shortcut: '⌘H',
      description: 'Go back Home',
      Icon: HomeIcon,
    },

    {
      key: 'workspaces',
      name: 'Workspaces',
      // shortcut: '>',
      description: 'Change your workspace',
      Icon: BriefcaseBusiness,
      subMenuItems: workspaces.map((item: any) => {
        return {
          key: item.ID,
          label: item.workspace,
          description: item?.description,
          // href: `/dashboard/${item?.ID}`,
          onSelect: () => {
            // setActiveWorkspace(item)
            // push(`/dashboard/${item?.ID}`)
            // refresh()
            window.location.href = `/dashboard/${item?.ID}`;
          },
          Icon: BriefcaseBusiness,
        };
      }),
    },
    {
      key: 'settings',
      name: 'Workspace Settings',
      href: dashboardRoute + '/workspace-settings',
      shortcut: '⌘S',
      description: 'Workspace preferences',
      Icon: Settings,
    },
    // {
    //   key: 'users',
    //   name: 'Manage Members',
    //   href: '/dashboard/settings/users',
    //   shortcut: '⌘M',
    //   description: 'Manage workspace members',
    //   Icon: UserGroupIcon,
    //   showDivider: true,
    // },

    // {
    //   key: 'new',
    //   name: 'New Workspace',
    //   onClick: '/workspaces/new',
    //   shortcut: '⌘N',
    //   description: 'Create a new workspaces',
    //   Icon: PlusIcon,
    // },
  ];

  function handleExpand(index: number) {
    setExpandedSection(expandedSection === index ? null : index);
  }

  function handleMainLinkClick() {
    setExpandedSection(null);
    handleLinkClick();
  }

  function handleLinkClick() {
    if (openMobileMenu) {
      toggleMobileMenu();
    }
  }

  useEffect(() => {
    SIDE_BAR_OPTIONS.forEach((option, index) => {
      if (option.subMenuItems) {
        option.subMenuItems.forEach((subItem: any) => {
          if (pathname === subItem.href) {
            setExpandedSection(index);
          }
        });
      }
    });
  }, [pathname]);

  return (
    <>
      <Button
        onClick={toggleMobileMenu}
        size="md"
        // isIconOnly
        className="absolute left-6 top-3 z-[99] h-8 min-w-5 bg-transparent p-2 hover:bg-primary/5 lg:hidden"
      >
        <Menu className="h-7 w-7 text-foreground/70" />
        <Logo href={'#'} />
      </Button>
      <div
        className={cn(
          'h-full hidden w-[380px] lg:flex border-r border-border',
          {
            'flex ': openMobileMenu,
          },
        )}
      >
        <nav
          className={cn(
            `h-full w-full flex-col bg-card p-5 transition-all duration-500 ease-in-out`,
          )}
        >
          <Logo href={dashboardRoute} />
          <div className="relative py-2">
            <DropdownButton
              backdropBlur={true}
              dropDownItems={WORKSPACES_OPTIONS}
              isDisabled={!workspaceID || isLoading || isPending}
            >
              <SoftBoxIcon className={'aspect-square h-10 w-10 p-2'}>
                <BriefcaseBusiness />
              </SoftBoxIcon>
              <div className="flex w-full items-center justify-between text-primary">
                {(() => {
                  const isFetching =
                    !activeWorkspace || !activeWorkspace?.workspace;

                  return (
                    <div className="flex flex-col items-start justify-start gap-0">
                      <div className="text-base font-semibold uppercase">
                        {isFetching ? (
                          <div className="flex gap-2 text-sm font-bold capitalize">
                            <Spinner size={18} /> Loading workspace...
                          </div>
                        ) : (
                          activeWorkspace?.workspace
                        )}
                      </div>
                      {!isFetching && (
                        <span className="-mt-1 text-xs font-medium capitalize tracking-wide text-foreground-600">
                          {`${activeWorkspace?.workspaceType}'s Workspace`}
                        </span>
                      )}
                    </div>
                  );
                })()}
                <ChevronRightIcon className={cn('h-5 w-5 ease-in-out')} />
              </div>
            </DropdownButton>
          </div>
          {Boolean(isLoading || isPending || !workspaceID) ? (
            <div className="flex h-full w-[380px] flex-col space-y-6 p-5">
              <Skeleton className="mb-4 h-16 w-full rounded-xl" />
              <div className="h-full space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 w-full rounded-lg" />
                ))}
              </div>
              <Skeleton className="mt-auto h-[40px] w-full rounded-xl" />
            </div>
          ) : (
            <SideNavItems
              user={user}
              workspaceID={workspaceID}
              expandedSection={expandedSection as number}
              handleExpand={handleExpand}
              handleLinkClick={handleLinkClick}
              handleMainLinkClick={handleMainLinkClick}
              navBarItems={SIDE_BAR_OPTIONS}
            />
          )}
        </nav>
      </div>
      {/* MOBILE NAVIGATION */}
      <MobileNavBar
        workspaceID={workspaceID}
        user={user}
        expandedSection={expandedSection}
        handleExpand={handleExpand}
        handleMainLinkClick={handleMainLinkClick}
        isMobileMenuOpen={openMobileMenu}
        navBarItems={SIDE_BAR_OPTIONS}
        pathname={pathname}
        toggleMobileMenu={toggleMobileMenu}
      />
    </>
  );
}

export default SideNavBar;
