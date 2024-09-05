'use client'
import React from 'react'
import { Balance, Card, CardHeader, SimpleStats } from '@/components/base'
import ReportsBarChart from '@/components/charts/ReportsBarChart/ReportsBarChart'
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ArrowUpIcon,
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
import { PreFundHistory } from '../workspace/Wallet'

function DashboardAnalytics() {
  const { chart, items } = reportsBarChartData
  const { dashboardAnalytics, isLoading } = useDashboard()
  const { workspaceWalletBalance, activeWorkspace, workspaceID } =
    useWorkspaces()

  const {
    today,
    yesterday,
    collectionsToday,
    disbursementsToday,
    allCollections,
    allDisbursements,
  } = dashboardAnalytics || {}
  return (
    <>
      {isLoading && <OverlayLoader show={isLoading} />}
      <div className="flex w-full flex-col gap-4 md:gap-6">
        {/* <InfoBanner
          buttonText="Verify Account"
          infoText="Just one more step, please submit your business documents to aid us with the approval process"
          href={'manage-account/account-verification'}
        /> */}
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

        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(400px,1fr))] place-items-center gap-4 ">
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
          <SimpleStats
            title={
              activeWorkspace?.workspace
                ? `${activeWorkspace?.workspace} Wallet Balance`
                : 'Wallet Balance'
            }
            figure={
              workspaceWalletBalance
                ? formatCurrency(workspaceWalletBalance)
                : `(ZMW 0.00)`
            }
            Icon={WalletIcon}
          />
        </div>

        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
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

          <Card>
            <CardHeader
              title={'Wallet Statement Summary'}
              infoText={'Brief overview of your latest statement transactions'}
            />
            <PreFundHistory workspaceID={workspaceID} limit={4} />
          </Card>
        </div>

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
          <Batches />
        </div>
      </div>
    </>
  )
}

export default DashboardAnalytics
