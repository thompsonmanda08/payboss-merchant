"use client";

import { useState, useEffect } from "react";
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
  WalletIcon,
  ReceiptPercentIcon,
  ArrowLeftEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  BriefcaseIcon,
  ChevronRightIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

import useNavigationStore from "@/context/navigation-store.js";
import DropdownButton from "@/components/ui/dropdown-button";
import Spinner from "@/components/ui/spinner";
import SoftBoxIcon from "@/components/base/soft-box-icon";
import { cn } from "@/lib/utils";
import useNavigation from "@/hooks/useNavigation";
import { WORKSPACE_TYPES } from "@/lib/constants";

import SideNavItems from "./side-nav-items";
import { Skeleton } from "./ui/skeleton";
import Logo from "./base/payboss-logo";
import MobileNavBar from "./mobile-menu";
import { Button } from "./ui/button";

function SideNavBar({ workspaceSession }) {
  const { dashboardRoute, pathname, activeWorkspace, workspaces, isLoading } =
    useNavigation();
  const { openMobileMenu, toggleMobileMenu } = useNavigationStore();
  const [expandedSection, setExpandedSection] = useState(null);
  const { workspaceType } = workspaceSession;

  // *************** COLLECTIONS AND INCOME *************** //
  const COLLECTION_SERVICES = [
    {
      ID: "collections",
      name: "Manage Income",
      Icon: InboxArrowDownIcon,
      subMenuItems: [
        {
          name: "Till Payments",
          href: `${dashboardRoute}/collections/till-collections`,
          Icon: CalculatorIcon,
        },
        {
          name: "API Integration",
          href: `${dashboardRoute}/collections/api-integration`,
          Icon: AdjustmentsVerticalIcon,
        },
        {
          name: "Checkout & Invoicing",
          href: `${dashboardRoute}/collections/invoicing`,
          Icon: CreditCardIcon,
        },

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
      ],
    },
  ];

  // *************** DISBURSEMENTS AND PAYOUTS ************ //
  const DISBURSEMENT_SERVICES = [
    {
      ID: "payments",
      name: "Manage Payments",
      Icon: BanknotesIcon,
      // href: `${dashboardRoute}/payments`,
      subMenuItems: [
        {
          name: "Disbursements",
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
  ];

  // *************** BILL PAYMENTS ******************** //
  const BILL_PAYMENT_SERVICES = [
    {
      name: "Bill Payments",
      href: `${dashboardRoute}/bills`,
      Icon: ReceiptPercentIcon,
    },
  ];

  // *************** DISBURSEMENTS REPORTS ************ //
  const DISBURSEMENT_REPORTS = [
    {
      name: "Disbursements",
      href: `${dashboardRoute}/reports/disbursements`,
      Icon: ArrowRightStartOnRectangleIcon,
    },
  ];

  // *************** COLLECTION REPORTS **************** //
  const COLLECTION_REPORTS = [
    {
      name: "Collections",
      href: `${dashboardRoute}/reports/collection`,
      Icon: ArrowLeftEndOnRectangleIcon,
    },
  ];

  const BILL_PAYMENTS_REPORTS = [
    {
      name: "Bill Payment Reports",
      href: `${dashboardRoute}/reports/bills`,
      Icon: ReceiptPercentIcon,
    },
  ];

  // *************** ONLINE E-COMMERCE ******************** //
  const MISC_SERVICES = [
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

  const SIDE_BAR_OPTIONS = [
    {
      name: "Dashboard",
      ID: "dashboard",
      href: dashboardRoute,
      Icon: HomeIcon,
    },
    // ****************************************************** //
    ...SERVICES,
    // ****************************************************** //

    // *************** REPORTS AND ANALYSIS ***************** //
    {
      ID: "reports",
      name: "Reports & Analytics",
      href: `${dashboardRoute}/reports`,
      Icon: DocumentChartBarIcon,
      subMenuItems: [
        {
          name: "Wallet Statement",
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
      ID: "workspace",
      name: "Manage Workspace",
      Icon: WrenchScrewdriverIcon,
      href: `${dashboardRoute}/workspace-settings`,
    },
  ];

  // *************** WORKSPACES DROPDOWN ***************** //
  const WORKSPACES_OPTIONS = [
    {
      key: "home",
      name: "Home",
      href: "/workspaces",
      shortcut: "⌘H",
      description: "Go back Home",
      Icon: HomeIcon,
    },

    {
      key: "workspaces",
      name: "Workspaces",
      // shortcut: '>',
      description: "Change your workspace",
      Icon: BriefcaseIcon,
      subMenuItems: workspaces.map((item) => {
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
          Icon: BriefcaseIcon,
        };
      }),
    },
    {
      key: "settings",
      name: "Workspace Settings",
      href: dashboardRoute + "/workspace-settings",
      shortcut: "⌘S",
      description: "Workspace preferences",
      Icon: WrenchScrewdriverIcon,
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

  function handleExpand(index) {
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
        option.subMenuItems.forEach((subItem) => {
          if (pathname === subItem.href) {
            setExpandedSection(index);
          }
        });
      }
    });
  }, [pathname]);

  return isLoading || !workspaceType ? (
    <div className="flex h-full w-[380px] flex-col space-y-6 p-5">
      <Skeleton className="mb-4 h-16 w-full rounded-xl" />
      <div className="h-full space-y-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-full rounded-lg" />
        ))}
      </div>
      <Skeleton className="mt-auto h-[50px] w-full rounded-xl" />
    </div>
  ) : (
    <>
      <Button
        onClick={toggleMobileMenu}
        size="md"
        // isIconOnly
        className="absolute left-6 top-3 z-[99] h-8 min-w-5 bg-transparent p-2 hover:bg-primary/5 lg:hidden"
      >
        <Bars3BottomLeftIcon className="h-7 w-7 text-foreground/70" />
        <Logo href={"#"} />
      </Button>
      <div
        className={cn("h-full hidden w-[380px] lg:flex", {
          "flex ": openMobileMenu,
        })}
      >
        <nav
          className={cn(
            `h-full w-full flex-col bg-card p-5 transition-all duration-500 ease-in-out`
          )}
        >
          <Logo href={dashboardRoute} />
          <div className="relative py-2">
            <DropdownButton
              backdropBlur={true}
              dropDownItems={WORKSPACES_OPTIONS}
            >
              <SoftBoxIcon className={"aspect-square h-9 w-10 p-2"}>
                <BriefcaseIcon />
              </SoftBoxIcon>
              <div className="flex w-full items-center justify-between text-primary">
                <div className="flex flex-col items-start justify-start gap-0">
                  <div className="text-base font-semibold uppercase">
                    {!activeWorkspace || !activeWorkspace?.workspace ? (
                      <div className="flex gap-2 text-sm font-bold capitalize">
                        <Spinner size={18} /> Loading workspace...
                      </div>
                    ) : (
                      activeWorkspace?.workspace
                    )}
                  </div>
                  <span className="-mt-1 text-xs font-medium capitalize tracking-wide text-foreground-600">
                    {`${activeWorkspace?.workspaceType}'s Workspace`}
                  </span>
                </div>
                <ChevronRightIcon className={cn("h-4 w-4 ease-in-out")} />
              </div>
            </DropdownButton>
          </div>
          <SideNavItems
            expandedSection={expandedSection}
            handleExpand={handleExpand}
            handleMainLinkClick={handleMainLinkClick}
            isMobileMenuOpen={openMobileMenu}
            navBarItems={SIDE_BAR_OPTIONS}
            pathname={pathname}
            toggleMobileMenu={toggleMobileMenu}
          />
        </nav>
      </div>
      {/* MOBILE NAVIGATION */}
      <MobileNavBar
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
