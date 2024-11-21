"use client";
import React from "react";
import {
  ArrowDownOnSquareStackIcon,
  ArrowUpOnSquareStackIcon,
  BanknotesIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { cn, formatCurrency } from "@/lib/utils";
import { WalletTransactionHistory } from "../../../components/containers/workspace/Wallet";
import PendingApprovals from "../../../components/containers/analytics/PendingAnalytics";
import { Chip } from "@nextui-org/react";
import Card from "@/components/base/Card";
import SimpleStats from "@/components/elements/simple-stats";
import CardHeader from "@/components/base/CardHeader";
import OverlayLoader from "@/components/ui/overlay-loader";
import { MONTHS, WORKSPACE_TYPES } from "@/lib/constants";
import CustomTable from "../../../components/containers/tables/Table";
import ReportsBarChart from "@/components/charts/ReportsBarChart/ReportsBarChart";

const TRANSACTION_COLUMNS = [
  { name: "DATE", uid: "created_at", sortable: true },
  { name: "NARRATION", uid: "narration" },
  { name: "PROVIDER", uid: "service_provider", sortable: true },
  { name: "SOURCE ACCOUNT", uid: "destination", sortable: true },
  { name: "AMOUNT", uid: "amount", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
];

const pendingApprovals = [
  {
    label: "Bulk Direct Transfers",
    workspaceType: WORKSPACE_TYPES[1].ID,
    total: 0,
    icon: {
      color: "primary",
      component: <ArrowUpOnSquareStackIcon className="h-6 w-6 rotate-90" />,
    },
  },
  {
    label: "Wallet Settlements",
    workspaceType: WORKSPACE_TYPES[0].ID,
    total: 0,
    icon: {
      color: "success",
      component: <BanknotesIcon className="h-6 w-6" />,
    },
  },
  {
    label: "Wallet Prefund Requests",
    workspaceType: WORKSPACE_TYPES[1].ID,
    total: 0,
    icon: {
      color: "secondary",
      component: <WalletIcon className="h-6 w-6" />,
    },
  },
  // {
  //   label: "Single Voucher Transfers",
  //   total: 0,
  //   icon: {
  //     color: "danger",
  //     component: <QrCodeIcon className="h-6 w-6 rotate-90" />,
  //   },
  // },
];

function DashboardAnalytics({
  workspaceID,
  permissions,
  workspaceType,
  dashboardAnalytics,
  workspaceWalletBalance,
}) {
  // const { chart, items } = reportsBarChartData;

  // const { workspaceWalletBalance } = useWorkspaces();
  // const { dashboardRoute, pathname } = useNavigation();

  // const walletOptions = [
  //   {
  //     ID: 1,
  //     label: "View wallet Statement",
  //     href: `/${dashboardRoute}/reports/statement`,
  //   },
  //   {
  //     ID: 2,
  //     label: "View deposit history",
  //     href: `/${dashboardRoute}/workspace-settings?wallet`,
  //   },

  //   {
  //     ID: 3,
  //     label: "Deposit funds",
  //     href: `/${dashboardRoute}/workspace-settings?deposit=true`,
  //   },
  // ];

  const {
    today,
    yesterday,
    collectionsToday,
    disbursementsToday,
    allCollections,
    allDisbursements,
    walletSummary,
    latestTransactions,
    monthlyCollections,
    monthlyDisbursements,
  } = dashboardAnalytics || {};

  const monthlyTransactionRecords =
    workspaceType == WORKSPACE_TYPES[0]?.ID
      ? monthlyCollections
      : WORKSPACE_TYPES[1]?.ID
      ? monthlyDisbursements
      : [...monthlyDisbursements, ...monthlyCollections]; // HYBRID WORKSPACE

  const monthlyTransactions = {
    chart: {
      labels: MONTHS,
      datasets: {
        label: "Transactions",
        data: MONTHS.map((month) => {
          const transaction = monthlyTransactionRecords?.find((item) =>
            String(item.month).toLowerCase().startsWith(month.toLowerCase())
          );
          return transaction ? transaction.count : 0;
        }), // Total Transactions
      },
    },
  };

  const thisMonth = new Date().getMonth();
  const currentMonth = MONTHS[thisMonth];
  const previousMonth = MONTHS[(thisMonth - 1 + MONTHS.length) % MONTHS.length]; // Handle January to December wrap-around

  const previousMonthTransactions = monthlyTransactionRecords?.find((item) =>
    String(item.month).toLowerCase().startsWith(previousMonth.toLowerCase())
  );

  const currentMonthTransactions = monthlyTransactionRecords?.find((item) =>
    String(item.month).toLowerCase().startsWith(currentMonth.toLowerCase())
  );

  // Extract counts or default to 0 if no transactions
  const previousCount = previousMonthTransactions?.count || 0;
  const currentCount = currentMonthTransactions?.count || 0;

  // Calculate the percentage change between the current month and the previous month
  const percentageChange = previousCount
    ? ((currentCount - previousCount) / previousCount) * 100
    : 0; // Avoid division by zero

  // Determine if it was an increase, decrease, or no change
  const changeType =
    currentCount > previousCount
      ? true // increse
      : currentCount < previousCount
      ? false // decrease
      : "none"; // no change

  console.log(currentCount, previousCount, percentageChange, changeType);

  const dataNotReady = !permissions?.ID;

  return (
    <>
      {dataNotReady && <OverlayLoader show={dataNotReady} />}

      <div className="flex w-full flex-col gap-4 md:gap-4">
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
          <>
            <SimpleStats
              title={`Today's ${workspaceType}`}
              figure={today?.count || 0}
              smallFigure={
                today?.value
                  ? `(${formatCurrency(collectionsToday?.value)})`
                  : `(ZMW 0.00)`
              }
              classNames={{
                smallFigureClasses: "md:text-base font-semibold",
              }}
              Icon={ArrowDownOnSquareStackIcon}
            />

            <SimpleStats
              title={`Yesterday's ${workspaceType}`}
              figure={yesterday?.count || 0}
              smallFigure={
                yesterday?.value
                  ? `(${formatCurrency(collectionsToday?.value)})`
                  : `(ZMW 0.00)`
              }
              classNames={{
                smallFigureClasses: "md:text-base font-semibold",
              }}
              Icon={ArrowDownOnSquareStackIcon}
            />
            {workspaceType == WORKSPACE_TYPES[0]?.ID ? (
              <SimpleStats
                title={"All Collections"}
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
            ) : (
              <SimpleStats
                title={"All Disbursements"}
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
            )}
          </>
        </div>

        {/*  2ND ROW - MONTHLY FIGURES AND VALUES */}

        <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-2">
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
              transactionData={walletSummary}
              workspaceID={workspaceID}
              limit={5}
            />
          </Card>

          <div className="flex flex-1 self-start flex-col gap-4">
            <ReportsBarChart
              title="Transactions Summary"
              description={
                previousCount == 0 ? (
                  <>
                    <span className={cn("font-bold text-primary")}>
                      {currentCount}
                    </span>{" "}
                    transactions this month of about{" "}
                    <span className={cn("font-bold text-primary")}>
                      {formatCurrency(currentMonthTransactions?.value || 0)}
                    </span>
                  </>
                ) : (
                  <>
                    (
                    <span
                      className={cn("font-bold text-primary", {
                        "text-green-500": changeType,
                        "text-red-500": !changeType,
                      })}
                    >
                      {changeType
                        ? `+${percentageChange}`
                        : `-${percentageChange}`}
                    </span>
                    ) than last month
                  </>
                )
              }
              chart={monthlyTransactions.chart}
              // items={items}
            />
            <PendingApprovals
              data={pendingApprovals}
              workspaceType={workspaceType}
              canApprove={permissions?.can_approve}
            />
          </div>
        </div>

        {/*  3RD ROW - LATEST TRANSACTIONS */}
        <Card className={""}>
          <div className="flex justify-between">
            <CardHeader
              title={"Latest Transactions"}
              infoText={"Some recent transactions from the last few days"}
            />
          </div>
          <CustomTable
            columns={TRANSACTION_COLUMNS}
            rows={latestTransactions || []}
            rowsPerPage={6}
            classNames={{ wrapper: "shadow-none px-0 mx-0" }}
          />
        </Card>
      </div>
    </>
  );
}

export default DashboardAnalytics;
