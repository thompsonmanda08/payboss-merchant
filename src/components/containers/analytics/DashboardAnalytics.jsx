'use client'
import React from 'react'
import { Card, CardHeader, SimpleStats } from '@/components/base'
import ReportsBarChart from '@/components/charts/ReportsBarChart/ReportsBarChart'
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ArrowsRightLeftIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ArrowUpIcon,
  ArrowUpOnSquareStackIcon,
  BanknotesIcon,
  QrCodeIcon,
  QueueListIcon,
} from '@heroicons/react/24/outline'
import GradientLineChart from '@/components/charts/GradientLineChart/GradientLineChart'
import Batches from '@/components/containers/tables/BatchSummaryTable'
import { formatCurrency } from '@/lib/utils'
import reportsBarChartData from '@/app/dashboard/[workspaceID]/data/reportsBarChartData'
import gradientLineChartData from '@/app/dashboard/[workspaceID]/data/gradientLineChartData'
import OverlayLoader from '@/components/ui/OverlayLoader'
import { WalletTransactionHistory } from '../workspace/Wallet'
import PendingApprovals from './PendingAnalytics'
import { useDashboardAnalytics, useWorkspaceInit } from '@/hooks/useQueryHooks'
import { Chip } from '@nextui-org/react'
import useWorkspaces from '@/hooks/useWorkspaces'

const pendingApprovals = [
  {
    label: 'Bulk Direct Transfers',
    total: 0,
    icon: {
      color: 'primary',
      component: <ArrowUpOnSquareStackIcon className="h-6 w-6 rotate-90" />,
    },
  },
  {
    label: 'Bulk Voucher Transfers',
    total: 0,
    icon: {
      color: 'success',
      component: <BanknotesIcon className="h-6 w-6" />,
    },
  },
  {
    label: 'Sinlge Direct Transfers',
    total: 0,
    icon: {
      color: 'secondary',
      component: <ArrowsRightLeftIcon className="h-6 w-6" />,
    },
  },
  {
    label: 'Single Voucher Transfers',
    total: 0,
    icon: {
      color: 'danger',
      component: <QrCodeIcon className="h-6 w-6 rotate-90" />,
    },
  },
]

function DashboardAnalytics({ workspaceID }) {
  const { chart, items } = reportsBarChartData

  const { data: analytics, isFetching } = useDashboardAnalytics(workspaceID)
  const dashboardAnalytics = analytics?.data

  const { data: initialization, isLoading } = useWorkspaceInit(workspaceID)
  const role = initialization?.data

  const { workspaceWalletBalance } = useWorkspaces()

  const {
    today,
    yesterday,
    collectionsToday,
    disbursementsToday,
    allCollections,
    allDisbursements,
  } = dashboardAnalytics || {}

  const dataNotReady = isFetching || isLoading
  return (
    <>
      {/* {dataNotReady && <OverlayLoader show={dataNotReady} />} */}

      <div className="flex w-full flex-col gap-4 md:gap-6">
        {/* TOP ROW - WALLET BALANCE && OVERALL VALUES */}
        <div className="flex-cols flex w-full flex-wrap items-start gap-4 md:flex-row">
          <Card className="flex-1 gap-4 border-none bg-gradient-to-br from-primary to-primary-400">
            <Chip
              classNames={{
                base: 'border-1 border-white/30',
                content: 'text-white/90 text-small font-semibold',
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
        {/*  2ND ROW - DAILY FIGURES AND VALUES */}
        <div className="flex w-full flex-col flex-wrap items-center gap-4 md:flex-row ">
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

        {/* 3RD ROW -  */}
        {role?.can_approve && (
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
        )}

        <div className="grid w-full grid-cols-1 gap-4 2xl:grid-cols-2">
          <Batches />
          <Card className={''}>
            <CardHeader
              title={'Wallet Statement Summary'}
              infoText={'Brief overview of your latest statement transactions'}
            />
            <WalletTransactionHistory workspaceID={workspaceID} limit={4} />
          </Card>
        </div>
      </div>
    </>
  )
}

export default DashboardAnalytics
