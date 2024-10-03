'use client'
import React, { useEffect } from 'react'
import {
  ArrowDownOnSquareStackIcon,
  ArrowsRightLeftIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ArrowUpOnSquareStackIcon,
  BanknotesIcon,
  EllipsisVerticalIcon,
  QrCodeIcon,
  QueueListIcon,
} from '@heroicons/react/24/outline'
import Batches from '@/components/containers/tables/BatchSummaryTable'
import { formatCurrency } from '@/lib/utils'
import reportsBarChartData from '@/app/dashboard/[workspaceID]/data/reportsBarChartData'
import { WalletTransactionHistory } from '../workspace/Wallet'
import PendingApprovals from './PendingAnalytics'
import { useDashboardAnalytics, useWorkspaceInit } from '@/hooks/useQueryHooks'
import { Chip } from '@nextui-org/react'
import useWorkspaces from '@/hooks/useWorkspaces'
import { useQueryClient } from '@tanstack/react-query'
import { SimpleDropdown } from '@/components/ui/DropdownButton'
import useNavigation from '@/hooks/useNavigation'
import Card from '@/components/base/Card'
import SimpleStats from '@/components/elements/SimpleStats'
import CardHeader from '@/components/base/CardHeader'

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
  const queryClient = useQueryClient()

  const {
    data: analytics,
    isFetching,
    refetch,
  } = useDashboardAnalytics(workspaceID)
  const dashboardAnalytics = analytics?.data



  const { data: initialization, isLoading } = useWorkspaceInit(workspaceID)
  const role = initialization?.data

  const { workspaceWalletBalance } = useWorkspaces()
  const { dashboardRoute } = useNavigation()

  const walletOptions = [
    {
      ID: 1,
      label: 'View wallet Statement',
      href: `/${dashboardRoute}/reports/statement`,
    },
    {
      ID: 2,
      label: 'View deposit history',
      href: `/${dashboardRoute}/workspace-settings?wallet`,
    },

    {
      ID: 3,
      label: 'Deposit funds',
      href: `/${dashboardRoute}/workspace-settings?deposit=true`,
    },
  ]

  const {
    today,
    yesterday,
    collectionsToday,
    disbursementsToday,
    allCollections,
    allDisbursements,
  } = dashboardAnalytics || {}

  useEffect(() => {
    queryClient.invalidateQueries()
  }, [])

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
            Icon={ArrowDownOnSquareStackIcon}
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
            Icon={ArrowUpOnSquareStackIcon}
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
            Icon={ArrowDownOnSquareStackIcon}
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
            Icon={ArrowUpOnSquareStackIcon}
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
            <div className="flex items-center justify-between">
              <CardHeader
                title={'Wallet Statement Summary'}
                infoText={
                  'Brief overview of your latest statement transactions'
                }
              />
              <SimpleDropdown
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
              />
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
  )
}

export default DashboardAnalytics
