'use client'
import React from 'react'
import { Balance, Card, CardHeader, SimpleStats } from '@/components/base'
import ReportsBarChart from '@/components/charts/ReportsBarChart/ReportsBarChart'
import {
  ArrowRightStartOnRectangleIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ArrowsRightLeftIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ArrowUpIcon,
  ArrowUpOnSquareIcon,
  ArrowUpOnSquareStackIcon,
  BanknotesIcon,
  QrCodeIcon,
  QueueListIcon,
  WalletIcon,
} from '@heroicons/react/24/outline'
import GradientLineChart from '@/components/charts/GradientLineChart/GradientLineChart'
import Batches from '@/components/containers/tables/BatchSummaryTable'
import { formatCurrency } from '@/lib/utils'
import reportsBarChartData from '@/app/dashboard/[workspaceID]/data/reportsBarChartData'
import gradientLineChartData from '@/app/dashboard/[workspaceID]/data/gradientLineChartData'
import useDashboard from '@/hooks/useDashboard'
import OverlayLoader from '@/components/ui/OverlayLoader'
import useWorkspaces from '@/hooks/useWorkspaces'
import { WalletTransactionHistory } from '../workspace/Wallet'
import PendingApprovals from './PendingAnalytics'

const pendingApprovals = [
  {
    label: 'Bulk Direct Transfers',
    total: 85,
    icon: {
      color: 'primary',
      component: <ArrowUpOnSquareStackIcon className="h-6 w-6 rotate-90" />,
    },
  },
  {
    label: 'Bulk Voucher Transfers',
    total: 32,
    icon: {
      color: 'success',
      component: <BanknotesIcon className="h-6 w-6" />,
    },
  },
  {
    label: 'Sinlge Direct Transfers',
    total: 51,
    icon: {
      color: 'secondary',
      component: <ArrowsRightLeftIcon className="h-6 w-6" />,
    },
  },
  {
    label: 'Single Voucher Transfers',
    total: 44,
    icon: {
      color: 'danger',
      component: <QrCodeIcon className="h-6 w-6 rotate-90" />,
    },
  },
]

function DashboardAnalytics() {
  const { chart, items } = reportsBarChartData
  const { dashboardAnalytics, isLoading, workspaceUserRole, workspaceID } =
    useDashboard()

  const { today, yesterday, collectionsToday, disbursementsToday } =
    dashboardAnalytics || {}
  return (
    <>
      {isLoading && <OverlayLoader show={isLoading} />}
      <div className="flex w-full flex-col gap-4 md:gap-6">
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(300px,1fr))] place-items-center gap-4 ">
          <SimpleStats
            title={'Todays Transactions'}
            figure={today?.count || 0}
            smallFigure={
              today?.value ? `(${formatCurrency(today?.value)})` : `(ZMW 0.00)`
            }
            classNames={{
              smallFigureClasses: 'md:text-base font-semibold',
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
              smallFigureClasses: 'md:text-base font-semibold',
            }}
            Icon={QueueListIcon}
          />
          <SimpleStats
            title={"Today's Collections"}
            figure={collectionsToday?.count || 0}
            smallFigure={
              collectionsToday?.value
                ? `(${formatCurrency(collectionsToday?.value)})`
                : `(ZMW 0.00)`
            }
            classNames={{
              smallFigureClasses: 'md:text-base font-semibold',
            }}
            Icon={ArrowsPointingInIcon}
          />
          <SimpleStats
            title={"Today's Disbursements"}
            figure={disbursementsToday?.count || 0}
            smallFigure={
              disbursementsToday?.value
                ? `(${formatCurrency(disbursementsToday?.value)})`
                : `(ZMW 0.00)`
            }
            classNames={{
              smallFigureClasses: 'md:text-base font-semibold',
            }}
            Icon={ArrowsPointingOutIcon}
          />
        </div>

        {workspaceUserRole?.can_approve ? (
          <ComponentsWithApprovalStats />
        ) : (
          <ComponentsForViewOnly />
        )}

        {/* <div className="place-items- flex w-full grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-4 md:place-items-start ">
          <div className="flex w-1/2 flex-col gap-4">
            <div className="flex gap-4">
              <SimpleStats
                title={'Overall Collections'}
                figure={allCollections?.count || 0}
                smallFigure={
                  allCollections?.value
                    ? `(${formatCurrency(allCollections?.value)})`
                    : `(ZMW 0.00)`
                }
                classNames={{
                  smallFigureClasses: 'md:text-base font-bold',
                }}
                isGood={true}
                Icon={ArrowTrendingUpIcon}
              />
              <SimpleStats
                title={'Overall Disbursements'}
                figure={allDisbursements?.count || 0}
                smallFigure={
                  allDisbursements?.value
                    ? `(${formatCurrency(allDisbursements?.value)})`
                    : `(ZMW 0.00)`
                }
                classNames={{
                  smallFigureClasses: 'md:text-base font-bold',
                }}
                isBad={true}
                Icon={ArrowTrendingDownIcon}
              />
            </div>
            <GradientLineChart
              title="Transactions Overview"
              description={
                <span className="flex items-center">
                  <span className="mb-1 mr-1 text-lg leading-none text-green-500">
                    <ArrowUpIcon className="h-5 w-5 font-bold" />
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    4% more <span className="font-normal">in 2021</span>
                  </span>
                </span>
              }
              height="20.25rem"
              chart={gradientLineChartData}
            />
          </div>
          <Card className={'w-1/2'}>
            <CardHeader
              title={'Wallet Statement Summary'}
              infoText={'Brief overview of your latest statement transactions'}
            />
            <WalletTransactionHistory workspaceID={workspaceID} limit={4} />
          </Card>
        </div> */}

        <div className="flex w-full flex-col gap-4 md:flex-row">
          <ReportsBarChart
            title="transactions"
            description={
              <>
                (<strong>+23%</strong>) than last week
              </>
            }
            chart={chart}
            items={items}
          />
          {workspaceUserRole?.can_approve ? (
            <Card className={'w-full'}>
              <CardHeader
                title={'Wallet Statement Summary'}
                infoText={
                  'Brief overview of your latest statement transactions'
                }
              />
              <WalletTransactionHistory workspaceID={workspaceID} limit={4} />
            </Card>
          ) : (
            <Batches />
          )}
        </div>
      </div>
    </>
  )
}

function ComponentsForViewOnly() {
  const { dashboardAnalytics } = useDashboard()
  const { workspaceID } = useWorkspaces()
  const { allCollections, allDisbursements } = dashboardAnalytics || {}
  return (
    <div className="place-items- flex w-full grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-4 md:place-items-start">
      <div className="flex w-1/2 flex-col gap-6">
        <GradientLineChart
          title="Transactions Overview"
          description={
            <span className="flex items-center">
              <span className="mb-1 mr-1 text-lg leading-none text-green-500">
                <ArrowUpIcon className="h-5 w-5 font-bold" />
              </span>
              <span className="text-sm font-medium text-gray-700">
                4% more <span className="font-normal">in 2021</span>
              </span>
            </span>
          }
          height="20.25rem"
          chart={gradientLineChartData}
        />
        <div className="flex gap-4">
          <SimpleStats
            title={'Overall Collections'}
            figure={allCollections?.count || 0}
            smallFigure={
              allCollections?.value
                ? `(${formatCurrency(allCollections?.value)})`
                : `(ZMW 0.00)`
            }
            classNames={{
              smallFigureClasses: 'md:text-base font-bold',
            }}
            isGood={true}
            Icon={ArrowTrendingUpIcon}
          />
          <SimpleStats
            title={'Overall Disbursements'}
            figure={allDisbursements?.count || 0}
            smallFigure={
              allDisbursements?.value
                ? `(${formatCurrency(allDisbursements?.value)})`
                : `(ZMW 0.00)`
            }
            classNames={{
              smallFigureClasses: 'md:text-base font-bold',
            }}
            isBad={true}
            Icon={ArrowTrendingDownIcon}
          />
        </div>
      </div>
      <Card className={'w-1/2'}>
        <CardHeader
          title={'Wallet Statement Summary'}
          infoText={'Brief overview of your latest statement transactions'}
        />
        <WalletTransactionHistory workspaceID={workspaceID} limit={6} />
      </Card>
    </div>
  )
}

function ComponentsWithApprovalStats() {
  const { dashboardAnalytics } = useDashboard()
  const { allCollections, allDisbursements } = dashboardAnalytics || {}
  return (
    <div className="flex w-full grid-cols-[repeat(auto-fill,minmax(400px,1fr))] place-items-center gap-4 ">
      <PendingApprovals data={pendingApprovals} />
      <div className="flex w-1/3 max-w-lg flex-col gap-4">
        <SimpleStats
          title={'Overall Collections'}
          figure={allCollections?.count || 0}
          smallFigure={
            allCollections?.value
              ? `(${formatCurrency(allCollections?.value)})`
              : `(ZMW 0.00)`
          }
          classNames={{
            smallFigureClasses: 'md:text-base font-bold',
          }}
          isGood={true}
          Icon={ArrowTrendingUpIcon}
        />
        <SimpleStats
          title={'Overall Disbursements'}
          figure={allDisbursements?.count || 0}
          smallFigure={
            allDisbursements?.value
              ? `(${formatCurrency(allDisbursements?.value)})`
              : `(ZMW 0.00)`
          }
          classNames={{
            smallFigureClasses: 'md:text-base font-bold',
          }}
          isBad={true}
          Icon={ArrowTrendingDownIcon}
        />
      </div>
    </div>
  )
}

export default DashboardAnalytics
