'use client'
import { Card, CardHeader, Tabs } from '@/components/base'
import React, { useState } from 'react'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import Search from '@/components/ui/Search'
import useTransactions from '@/hooks/useTransactions'
import CustomTable from '@/components/containers/tables/Table'
import { FunnelIcon, ListBulletIcon } from '@heroicons/react/24/outline'
import { Tooltip } from '@nextui-org/react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useAllPaymentTransactions } from '@/hooks/useQueryHooks'
import { DateRangePickerField } from '@/components/ui/DateSelectField'

const directTransactionsColumns = [
  { name: 'DATE', uid: 'created_at', sortable: true },
  { name: 'NAME', uid: 'batch_name', sortable: true },

  { name: 'TOTAL RECORDS', uid: 'total_recors', sortable: true },
  { name: 'TOTAL AMOUNT', uid: 'total_value', sortable: true },

  { name: 'TOTAL SUCCESSFUL', uid: 'total_successful', sortable: true },
  { name: 'AMOUNT SUCCESSFUL', uid: 'total_successful_value', sortable: true },

  { name: 'TOTAL FAILED', uid: 'total_failed', sortable: true },
  { name: 'AMOUNT FAILED', uid: 'total_failed_value', sortable: true },

  { name: 'STATUS', uid: 'status', sortable: true },
]

const SERVICE_TYPES = [
  {
    name: 'Direct Payments',
    index: 0,
  },
  {
    name: 'Voucher Payments',
    index: 1,
  },
  // {
  //   name: 'Expenses',
  //   index: 2,
  // },
]

export default function BulkTransactionsStats({ workspaceID }) {
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data: paymentTransactionsResponse,
    isFetching,
    isLoading,
  } = useAllPaymentTransactions(workspaceID)
  const allPaymentTransactions = paymentTransactionsResponse?.data?.data || []

  const transactionRows = allPaymentTransactions?.filter((item) => {
    return (
      item?.first_name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      item?.last_name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      item?.amount
        ?.toString()
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
  })

  const { activeTab, currentTabIndex, navigateTo } = useCustomTabsHook([
    <CustomTable
      columns={directTransactionsColumns}
      rows={transactionRows}
      isLoading={isLoading}
      rowsPerPage={10}
      // selectedKeys={selectedKeys}
      // setSelectedKeys={setSelectedKeys}
    />,
  ])

  return (
    <>
      {/************************************************************************/}
      <Card className={'mb-8 w-full'}>
        <CardHeader
          title={'Bulk Transactions History'}
          infoText={
            'Transactions logs to keep track of your workspace activity'
          }
        />

        <div className="mt-4 flex w-full items-center justify-between gap-8 ">
          <Tabs
            className={'my-2 mr-auto max-w-md'}
            tabs={SERVICE_TYPES}
            currentTab={currentTabIndex}
            navigateTo={navigateTo}
          />
          <div className="flex w-full max-w-xl gap-5 ">
            <Search
              // className={'mt-auto'}
              placeholder={'Search by name, or type...'}
              classNames={{ input: 'h-10' }}
              onChange={(e) => {
                setSearchQuery(e.target.value)
              }}
            />
            <div className="flex items-start gap-2">
              <DateRangePickerField
                description={'Transaction date range'}
                autoFocus
                // className={'-mt-5 '}s
                // onChange={(e) => {
                //   setSearchQuery(e.target.value)
                // }}
              />{' '}
              <Button endContent={<FunnelIcon className="h-5 w-5" />}>
                Apply
              </Button>
            </div>
          </div>
        </div>
        <Card className={'mt-4 shadow-none'}>
          <div className="my-2 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] place-items-center gap-12">
            <TotalValueStat
              label={'Total Batches'}
              icon={{
                component: <ListBulletIcon className="h-5 w-5" />,
                color: 'primary',
              }}
              total={allPaymentTransactions.length}
            />
            <TotalValueStat
              label={'Total Batches'}
              icon={{
                component: <ListBulletIcon className="h-5 w-5" />,
                color: 'primary',
              }}
              total={allPaymentTransactions.length}
            />
            <TotalValueStat
              label={'Total Batches'}
              icon={{
                component: <ListBulletIcon className="h-5 w-5" />,
                color: 'primary',
              }}
              total={allPaymentTransactions.length}
            />
            <TotalValueStat
              label={'Total Batches'}
              icon={{
                component: <ListBulletIcon className="h-5 w-5" />,
                color: 'primary',
              }}
              total={allPaymentTransactions.length}
            />
          </div>
        </Card>
      </Card>
      {/*  CURRENTLY ACTIVE TABLE */}
      {activeTab}
    </>
  )
}

function TotalValueStat({ label, icon, total }) {
  return (
    <div className="relative flex w-full items-center justify-between">
      <div className="flex items-center gap-1">
        <div
          className={`bg-${icon?.color} mr-1 flex items-center justify-center rounded-md p-2 text-sm text-white shadow-md`}
        >
          {icon?.component}
        </div>
        <span className="text-nowrap text-xs font-medium capitalize text-slate-800">
          {label}
        </span>
      </div>
      <Tooltip
        color={icon?.color}
        content="Records awaiting admin review and action"
      >
        <Button
          size="sm"
          className={cn(
            'h-max min-h-max max-w-max cursor-pointer rounded-lg px-4 py-2 text-[13px] font-semibold capitalize text-white',
            `bg-${icon?.color}/5 text-${icon?.color}`,
            {
              'bg-red-50 text-red-500': icon?.color === 'danger',
              'bg-green-50 text-green-600': icon?.color === 'success',
              'bg-secondary/10 text-orange-600': icon?.color === 'secondary',
            },
          )}
        >
          {total} records
        </Button>
      </Tooltip>
    </div>
  )
}
