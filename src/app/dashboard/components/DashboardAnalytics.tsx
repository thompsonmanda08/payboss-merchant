'use client';
import {
  LogOut as ArrowLeftEndOnRectangleIcon,
  LogIn as ArrowRightStartOnRectangleIcon,
  List as ListBulletIcon,
  Receipt as ReceiptPercentIcon,
} from 'lucide-react';
import { Chip } from '@heroui/react';

import SimpleStats from '@/app/dashboard/components/simple-stats';
import CardHeader from '@/components/base/card-header';
import Card from '@/components/base/custom-card';
import ReportsBarChart from '@/components/charts/ReportsBarChart/ReportsBarChart';
import OverlayLoader from '@/components/ui/overlay-loader';
import { useWorkspaceInit } from '@/hooks/use-query-data';
import { MONTHS, WORKSPACE_TYPES } from '@/lib/constants';
import { cn, formatCurrency } from '@/lib/utils';

import { WalletTransactionHistory } from '../[workspaceID]/workspace-settings/_components/wallet';

// const pendingApprovals = [
//   {
//     label: 'Bulk Direct Transfers',
//     workspaceType: WORKSPACE_TYPES[1].ID,
//     total: 0,
//     icon: {
//       color: 'primary',
//       component: <ArrowUpOnSquareStackIcon className="h-6 w-6 rotate-90" />,
//     },
//   },
//   {
//     label: 'Wallet Settlements',
//     workspaceType: WORKSPACE_TYPES[0].ID,
//     total: 0,
//     icon: {
//       color: 'success',
//       component: <BanknotesIcon className="h-6 w-6" />,
//     },
//   },
//   {
//     label: 'Wallet Prefund Requests',
//     workspaceType: WORKSPACE_TYPES[1].ID,
//     total: 0,
//     icon: {
//       color: 'secondary',
//       component: <WalletIcon className="h-6 w-6" />,
//     },
//   },
//   // {
//   //   label: "Single Voucher Transfers",
//   //   total: 0,
//   //   icon: {
//   //     color: "danger",
//   //     component: <QrCodeIcon className="h-6 w-6 rotate-90" />,
//   //   },
//   // },
// ];

function DashboardAnalytics({
  workspaceID,
  dashboardAnalytics,
  workspaceSession,
}: {
  workspaceID: string;
  dashboardAnalytics: any;
  workspaceSession: any;
}) {
  const { data: workspaceInit, isLoading } = useWorkspaceInit(workspaceID);

  const activeWorkspace = workspaceInit?.data?.activeWorkspace || {};
  const workspaceType =
    workspaceInit?.data?.workspaceType || activeWorkspace?.workspaceType;

  const permissions =
    workspaceInit?.data?.workspacePermissions ||
    workspaceSession?.workspacePermissions;

  const workspaceWalletBalance = activeWorkspace?.balance;

  const {
    today,
    yesterday,
    // collectionsToday,
    // disbursementsToday,
    // billsToday,
    // allCollections,
    // allDisbursements,
    allTransactions,
    // allBills,
    walletSummary,
    // latestTransactions,
    monthlyCollections,
    monthlyDisbursements,
    // monthlyBills,
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
      datasets: [
        {
          label: 'Transactions',
          data: MONTHS.map((month) => {
            const transaction = monthlyTransactionRecords?.find((item: any) =>
              String(item.month)
                ?.toLowerCase()
                .startsWith(month?.toLowerCase()),
            );

            return transaction ? transaction.count : 0;
          }), // Total Transactions
        },
      ],
    },
  };

  const CardIcon =
    workspaceType == WORKSPACE_TYPES[0]?.ID // COLLECTIONS
      ? ArrowLeftEndOnRectangleIcon
      : workspaceType == WORKSPACE_TYPES[1]?.ID // DISBURSEMENTS
        ? ArrowRightStartOnRectangleIcon
        : workspaceType == WORKSPACE_TYPES[2]?.ID // BILLS
          ? ReceiptPercentIcon
          : ListBulletIcon; // HYBRID

  return (
    <>
      <OverlayLoader
        description="Your dashboard is being populated with recent data."
        show={isLoading}
        title="Please wait"
      />

      <div className="flex w-full flex-col gap-4 md:gap-4">
        {/* TOP ROW - WALLET BALANCE && OVERALL VALUES */}
        <div className="flex-cols flex w-full flex-wrap items-start gap-4 md:flex-row">
          <Card className="flex-1 gap-2 border-none bg-gradient-to-br from-primary to-primary-400 shadow-lg shadow-primary-300/50">
            <Chip
              classNames={{
                base: 'border-1 border-white/30',
                content: 'text-white/90 text-small font-semibold',
              }}
              variant="bordered"
            >
              Available Wallet Balance
            </Chip>
            <p className="text-[1.7rem] font-black leading-7 tracking-tight text-white">
              {formatCurrency(workspaceWalletBalance || 0)}
            </p>
          </Card>
          <SimpleStats
            Icon={CardIcon}
            classNames={{
              smallFigureClasses: 'md:text-base font-semibold',
            }}
            figure={today?.count || 0}
            smallFigure={formatCurrency(today?.value || 0)}
            title={`Today's ${workspaceType}`}
          />

          <SimpleStats
            Icon={CardIcon}
            classNames={{
              smallFigureClasses: 'md:text-base font-semibold',
            }}
            figure={yesterday?.count || 0}
            smallFigure={formatCurrency(yesterday?.value || 0)}
            title={`Yesterday's ${workspaceType}`}
          />
        </div>
        {/*  2ND ROW - MONTHLY FIGURES AND VALUES */}
        <Card className="flex-col flex w-full flex-wrap items-start">
          <CardHeader
            classNames={{
              infoClasses: 'text-sm -mt-1 mb-4',
            }}
            infoText={'Monthly transactions by count and value'}
            title={'Transactions Summary'}
          />
          <ReportsBarChart
            chart={monthlyTransactions.chart}
            // items={items}
          />
          <div className="flex items-center gap-3 mt-2">
            <div className="grid aspect-square h-12 w-12 place-items-center rounded-lg bg-gradient-to-tr from-primary to-blue-300 p-3 text-white">
              <ListBulletIcon className="h-6 w-6" />
            </div>

            <div>
              <div className="flex items-center gap-1">
                <p className="text-lg font-bold">
                  {allTransactions?.count || 0}
                </p>
                <span className={cn('text-sm text-gray-500')}>
                  ({formatCurrency(allTransactions?.value || '0')})
                </span>
              </div>
              <p className="text-sm text-gray-500">All Transactions</p>
            </div>
          </div>
        </Card>

        {/*  3RD ROW - LATEST WALLET STATEMENT TRANSACTIONS */}
        <div className="grid w-full grid-cols-1 gap-4">
          <Card className={''}>
            <CardHeader
              classNames={{
                infoClasses: 'text-sm -mt-1',
              }}
              infoText={'Brief overview of your latest statement transactions'}
              title={'Wallet Statement Summary'}
            />
            <WalletTransactionHistory
              limit={5}
              permissions={permissions}
              transactionData={walletSummary}
              workspaceID={workspaceID}
            />
          </Card>
        </div>
      </div>
    </>
  );
}

export default DashboardAnalytics;
