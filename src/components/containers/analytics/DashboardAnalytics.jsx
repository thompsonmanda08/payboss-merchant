"use client";
import React, { useEffect } from "react";
import {
  ArrowDownOnSquareStackIcon,
  ArrowsRightLeftIcon,
  ArrowUpOnSquareStackIcon,
  BanknotesIcon,
  EllipsisVerticalIcon,
  QrCodeIcon,
  QueueListIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency } from "@/lib/utils";
import reportsBarChartData from "@/app/dashboard/[workspaceID]/data/reportsBarChartData";
import { WalletTransactionHistory } from "../workspace/Wallet";
import PendingApprovals from "./PendingAnalytics";
import { useDashboardAnalytics } from "@/hooks/useQueryHooks";
import { Chip } from "@nextui-org/react";
import useWorkspaces from "@/hooks/useWorkspaces";
import { useQueryClient } from "@tanstack/react-query";
import { SimpleDropdown } from "@/components/ui/dropdown-button";
import useNavigation from "@/hooks/useNavigation";
import Card from "@/components/base/Card";
import SimpleStats from "@/components/elements/simple-stats";
import CardHeader from "@/components/base/CardHeader";
import OverlayLoader from "@/components/ui/overlay-loader";
import { WORKSPACE_TYPES } from "@/lib/constants";

const pendingApprovals = [
  {
    label: "Bulk Direct Transfers",
    total: 0,
    icon: {
      color: "primary",
      component: <ArrowUpOnSquareStackIcon className="h-6 w-6 rotate-90" />,
    },
  },
  {
    label: "Bulk Voucher Transfers",
    total: 0,
    icon: {
      color: "success",
      component: <BanknotesIcon className="h-6 w-6" />,
    },
  },
  {
    label: "Sinlge Direct Transfers",
    total: 0,
    icon: {
      color: "secondary",
      component: <ArrowsRightLeftIcon className="h-6 w-6" />,
    },
  },
  {
    label: "Single Voucher Transfers",
    total: 0,
    icon: {
      color: "danger",
      component: <QrCodeIcon className="h-6 w-6 rotate-90" />,
    },
  },
];

function DashboardAnalytics({ workspaceID, userRole, workspaceType }) {
  const { chart, items } = reportsBarChartData;
  const queryClient = useQueryClient();

  const {
    data: analytics,
    isFetching,
    isLoading,
  } = useDashboardAnalytics(workspaceID);
  const dashboardAnalytics = analytics?.data;

  const { workspaceWalletBalance } = useWorkspaces();
  const { dashboardRoute, pathname } = useNavigation();

  const walletOptions = [
    {
      ID: 1,
      label: "View wallet Statement",
      href: `/${dashboardRoute}/reports/statement`,
    },
    {
      ID: 2,
      label: "View deposit history",
      href: `/${dashboardRoute}/workspace-settings?wallet`,
    },

    {
      ID: 3,
      label: "Deposit funds",
      href: `/${dashboardRoute}/workspace-settings?deposit=true`,
    },
  ];

  const {
    today,
    yesterday,
    collectionsToday,
    disbursementsToday,
    allCollections,
    allDisbursements,
  } = dashboardAnalytics || {};

  // Invalidate all the queries when the pathname changes
  useEffect(() => {
    queryClient.invalidateQueries();
  }, [pathname]);

  const dataNotReady = isFetching || isLoading;

  return (
    <>
      {dataNotReady && <OverlayLoader show={dataNotReady} />}

      <div className="flex w-full flex-col gap-4 md:gap-6">
        {/* TOP ROW - WALLET BALANCE && OVERALL VALUES */}
        <div className="flex-cols flex w-full flex-wrap items-start gap-4 md:flex-row">
          <Card className="flex-1 gap-4 border-none bg-gradient-to-br from-primary to-primary-400 shadow-lg shadow-primary-300/50">
            <Chip
              classNames={{
                base: "border-1 border-white/30",
                content: "text-white/90 text-small font-semibold",
              }}
              variant="bordered"
            >
              Available Wallet Balance
            </Chip>
            <p className="text-[1.75rem] font-black leading-7 tracking-tight text-white">
              {workspaceWalletBalance
                ? `${formatCurrency(workspaceWalletBalance)}`
                : `ZMW 0.00`}
            </p>
          </Card>

          {/* DISPLAY COLLECTIONS ANALYTICS DATA */}
          {(workspaceType == WORKSPACE_TYPES[0]?.ID ||
            workspaceType == WORKSPACE_TYPES[2]?.ID) && (
            <>
              {/* ONLY SHOW COLLECTIONS ANALYTICS IF WORKSPACE TYPE IS COLLECTION */}
              {workspaceType == WORKSPACE_TYPES[0]?.ID && (
                <SimpleStats
                  title={"Today's Collections"}
                  figure={collectionsToday?.count || 0}
                  smallFigure={
                    collectionsToday?.value
                      ? `(${formatCurrency(collectionsToday?.value)})`
                      : `(ZMW 0.00)`
                  }
                  classNames={{
                    smallFigureClasses: "md:text-base font-semibold",
                  }}
                  Icon={ArrowDownOnSquareStackIcon}
                />
              )}
              <SimpleStats
                title={"Overall Collections"}
                figure={allCollections?.count || 0}
                smallFigure={
                  allCollections?.value
                    ? `(${formatCurrency(allCollections?.value)})`
                    : `(ZMW 0.00)`
                }
                classNames={{
                  smallFigureClasses: "md:text-base font-bold",
                }}
                isGood={true}
                Icon={ArrowDownOnSquareStackIcon}
              />
            </>
          )}

          {/* DISPLAY DISBURSEMENTS ANALYTICS DATA */}
          {(workspaceType == WORKSPACE_TYPES[1]?.ID ||
            workspaceType == WORKSPACE_TYPES[2]?.ID) && (
            <>
              {/* ONLY SHOW DISBURSEMENTS ANALYTICS IF WORKSPACE TYPE IS DISBURSEMENT */}
              {workspaceType == WORKSPACE_TYPES[1]?.ID && (
                <SimpleStats
                  title={"Today's Disbursements"}
                  figure={disbursementsToday?.count || 0}
                  smallFigure={
                    disbursementsToday?.value
                      ? `(${formatCurrency(disbursementsToday?.value)})`
                      : `(ZMW 0.00)`
                  }
                  classNames={{
                    smallFigureClasses: "md:text-base font-semibold",
                  }}
                  Icon={ArrowUpOnSquareStackIcon}
                />
              )}
              <SimpleStats
                title={"Overall Disbursements"}
                figure={allDisbursements?.count || 0}
                smallFigure={
                  allDisbursements?.value
                    ? `(${formatCurrency(allDisbursements?.value)})`
                    : `(ZMW 0.00)`
                }
                classNames={{
                  smallFigureClasses: "md:text-base font-bold",
                }}
                isBad={true}
                Icon={ArrowUpOnSquareStackIcon}
              />
            </>
          )}
        </div>
        {/*  2ND ROW - DAILY FIGURES AND VALUES */}

        <div className="grid w-full grid-cols-1 gap-4 2xl:grid-cols-2">
          {userRole?.can_approve && (
            <div className="flex flex-1 flex-col gap-4">
              <SimpleStats
                title={"Todays Transactions"}
                figure={today?.count || 0}
                smallFigure={
                  today?.value
                    ? `(${formatCurrency(today?.value)})`
                    : `(ZMW 0.00)`
                }
                classNames={{
                  smallFigureClasses: "md:text-base font-semibold",
                }}
                // isGood={true}
                Icon={QueueListIcon}
              />
              <SimpleStats
                title={"Yesterday's Transactions"}
                figure={yesterday?.count || 0}
                smallFigure={
                  yesterday?.value
                    ? `(${formatCurrency(yesterday?.value)})`
                    : `(ZMW 0.00)`
                }
                classNames={{
                  smallFigureClasses: "md:text-base font-semibold",
                }}
                Icon={QueueListIcon}
              />
              <PendingApprovals data={pendingApprovals} />
            </div>
          )}
          {/* <Batches /> */}
          <Card className={""}>
            <div className="flex items-center justify-between">
              <CardHeader
                title={"Wallet Statement Summary"}
                infoText={
                  "Brief overview of your latest statement transactions"
                }
              />
              {/* <SimpleDropdown
                isIconOnly
                classNames={{
                  trigger:
                    'bg-transparent-500 w-auto max-w-max shadow-none items-center justify-center',
                  // innerWrapper,
                  dropdownItem: 'py-2',
                  chevronIcon: 'hidden',
                }}
                name={
                  <EllipsisVerticalIcon className="h-5 w-5 cursor-pointer hover:text-primary" />
                }
                dropdownItems={walletOptions}
              /> */}
            </div>

            <WalletTransactionHistory
              transactionData={dashboardAnalytics?.walletSummary}
              workspaceID={workspaceID}
              limit={5}
            />
          </Card>
        </div>
      </div>
    </>
  );
}

export default DashboardAnalytics;
