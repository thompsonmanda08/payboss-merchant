'use client'
import { Card, CardHeader, Tabs } from '@/components/base'
import React, { useEffect, useState } from 'react'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import Search from '@/components/ui/Search'
import CustomTable from '@/components/containers/tables/Table'
import {
  ArrowDownTrayIcon,
  EyeSlashIcon,
  FunnelIcon,
  ListBulletIcon,
  PresentationChartBarIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { cn, downloadCSV, formatCurrency } from '@/lib/utils'

import { DateRangePickerField } from '@/components/ui/DateSelectField'
import { BULK_REPORTS_QUERY_KEY } from '@/lib/constants'
import { useMutation } from '@tanstack/react-query'
import { getBulkAnalyticReports } from '@/app/_actions/transaction-actions'
import { AnimatePresence, motion } from 'framer-motion'
import ReportDetailsViewer from '@/components/containers/analytics/ReportDetailsViewer'
import { Tooltip } from '@nextui-org/react'
import { singleReportsColumns } from '@/context/paymentsStore'

const bulkReportsColumns = [
  { name: 'DATE', uid: 'created_at', sortable: true },
  { name: 'FIRST NAME', uid: 'first_name', sortable: true },

  { name: 'LAST NAME', uid: 'last_name', sortable: true },
  { name: 'NRC', uid: 'nrc', sortable: true },
  { name: 'DESTINATION', uid: 'destination', sortable: true },

  { name: 'AMOUNT', uid: 'amount', sortable: true },
  { name: 'SERVICE PROVIDER', uid: 'service_provider', sortable: true },

  { name: 'STATUS', uid: 'status', sortable: true },
  { name: 'REMARKS', uid: 'remarks', sortable: true },
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

export default function SingleTransactionsStats({ workspaceID }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({})
  const [isExpanded, setIsExpanded] = useState(true)
  const [openReportsModal, setOpenReportsModal] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState(null) // ON ROW SELECTED

  // HANDLE FET BULK REPORT DATA
  const mutation = useMutation({
    mutationKey: [BULK_REPORTS_QUERY_KEY, workspaceID],
    mutationFn: (dateRange) => getBulkAnalyticReports(workspaceID, dateRange),
  })

  const report = mutation?.data?.data || []
  const directBatches = report?.directBatches || []
  const voucherBatches = report?.voucherBatches || []

  async function getBulkReportData() {
    await mutation.mutateAsync(dateRange)
  }

  useEffect(() => {
    if (!mutation.data && dateRange?.start_date && dateRange?.end_date) {
      getBulkReportData()
    }
  }, [dateRange])

  const { activeTab, currentTabIndex, navigateTo } = useCustomTabsHook([
    <CustomTable
      columns={bulkReportsColumns}
      rows={directBatches}
      isLoading={mutation.isPending}
      isError={mutation.isError}
      removeWrapper
    />,
    <CustomTable
      columns={bulkReportsColumns}
      rows={voucherBatches}
      isLoading={mutation.isPending}
      isError={mutation.isError}
    />,
  ])

  function handleFileExportToCSV() {
    // Implement CSV export functionality here
    if (currentTabIndex === 0) {
      const csvData = convertToCSV(directBatches)
      downloadCSV(csvData, 'single_direct_transactions')
    }
    if (currentTabIndex === 1) {
      const csvData = convertToCSV(voucherBatches)
      downloadCSV(csvData, 'single_voucher_transactions')
    }
  }

  return (
    <>
      <div className="mb-4 flex w-full items-start justify-start pb-2">
        <div className="flex items-center gap-2">
          <DateRangePickerField
            label={'Reports Date Range'}
            description={'Dates to generate transactional reports'}
            autoFocus
            dateRange={dateRange}
            visibleMonths={2}
            setDateRange={setDateRange}
          />{' '}
          <Button
            onPress={getBulkReportData}
            endContent={<FunnelIcon className="h-5 w-5" />}
          >
            Apply
          </Button>
        </div>
      </div>
      {/************************************************************************/}
      <Card className={'mb-8 w-full'}>
        <div className="flex items-end justify-between">
          <CardHeader
            title={'Single Transactions History'}
            infoText={
              'Transactions logs to keep track of your workspace activity'
            }
          />
          <div className="flex gap-4">
            <Button
              color={'primary'}
              variant="flat"
              onPress={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <PresentationChartBarIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {report && Object.keys(report).length > 0 && (
          <AnimatePresence>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: isExpanded ? 'auto' : 0,
                opacity: isExpanded ? 1 : 0,
              }}
            >
              <Card className={'mt-4 shadow-none'}>
                <TotalValueStat
                  label={'Total Transaction'}
                  icon={{
                    component: <ListBulletIcon className="h-5 w-5" />,
                    color: 'primary',
                  }}
                  count={report?.batches?.count || 0}
                  value={formatCurrency(report?.batches?.value || 0)}
                />
                <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-12 ">
                  <div className="flex flex-col gap-4">
                    <TotalValueStat
                      label={'Total Direct Transaction'}
                      icon={{
                        component: <ListBulletIcon className="h-5 w-5" />,
                        color: 'primary-800',
                      }}
                      count={report?.direct?.all?.count || 0}
                      value={formatCurrency(report?.direct?.all?.value || 0)}
                    />
                    <TotalValueStat
                      label={'Proccessed Direct Batches'}
                      icon={{
                        component: <ListBulletIcon className="h-5 w-5" />,
                        color: 'primary-800',
                      }}
                      count={report?.direct?.proccessed?.count || 0}
                      value={formatCurrency(
                        report?.direct?.proccessed?.value || 0,
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <TotalValueStat
                      label={'Total Voucher Transaction'}
                      icon={{
                        component: <ListBulletIcon className="h-5 w-5" />,
                        color: 'secondary',
                      }}
                      count={report?.voucher?.all?.count || 0}
                      value={formatCurrency(report?.voucher?.all?.value || 0)}
                    />
                    <TotalValueStat
                      label={'Proccessed Voucher Transaction'}
                      icon={{
                        component: <ListBulletIcon className="h-5 w-5" />,
                        color: 'secondary',
                      }}
                      count={report?.voucher?.proccessed?.count || 0}
                      value={formatCurrency(
                        report?.voucher?.proccessed?.value || 0,
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <TotalValueStat
                      label={'Successful Direct Transaction'}
                      icon={{
                        component: <ListBulletIcon className="h-5 w-5" />,
                        color: 'success',
                      }}
                      count={report?.directTransactions?.successful?.count || 0}
                      value={formatCurrency(
                        report?.directTransactions?.successful?.value || 0,
                      )}
                    />
                    <TotalValueStat
                      label={'Failed Direct Transactions'}
                      icon={{
                        component: <ListBulletIcon className="h-5 w-5" />,
                        color: 'danger',
                      }}
                      count={report?.directTransactions?.failed?.count || 0}
                      value={formatCurrency(
                        report?.directTransactions?.failed?.value || 0,
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <TotalValueStat
                      label={'Successful Voucher Transaction'}
                      icon={{
                        component: <ListBulletIcon className="h-5 w-5" />,
                        color: 'success',
                      }}
                      count={
                        report?.voucherTransactions?.successful?.count || 0
                      }
                      value={formatCurrency(
                        report?.voucherTransactions?.successful?.value || 0,
                      )}
                    />
                    <TotalValueStat
                      label={'Failed Voucher Transactions'}
                      icon={{
                        component: <ListBulletIcon className="h-5 w-5" />,
                        color: 'danger',
                      }}
                      count={report?.voucherTransactions?.failed?.count || 0}
                      value={formatCurrency(
                        report?.voucherTransactions?.failed?.value || 0,
                      )}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        )}
      </Card>
      {/*  CURRENTLY ACTIVE TABLE */}
      <Card className={'mb-8 w-full'}>
        <div className="mb-4 flex w-full items-center justify-between gap-8 ">
          <Tabs
            className={'my-2 mr-auto max-w-md'}
            tabs={SERVICE_TYPES}
            currentTab={currentTabIndex}
            navigateTo={navigateTo}
          />
          <div className="flex w-full max-w-md gap-4">
            <Search
              // className={'mt-auto'}
              placeholder={'Search by name, or type...'}
              classNames={{ input: 'h-10' }}
              onChange={(e) => {
                setSearchQuery(e.target.value)
              }}
            />
            <Button
              color={'primary'}
              variant="flat"
              onPress={() => handleFileExportToCSV()}
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {activeTab}
      </Card>

      {/************************************************************************/}
    </>
  )
}

function TotalValueStat({ label, icon, count, value }) {
  return (
    <div className="relative flex w-full max-w-xs items-center justify-between">
      <div className="flex items-center gap-1">
        <div
          className={`bg-${icon?.color} mr-1 flex items-center justify-center rounded-md p-3 text-sm text-white shadow-md`}
        >
          {icon?.component}
        </div>
        <div className="flex flex-col">
          <span className="text-nowrap text-xs font-medium capitalize text-slate-600">
            {label}
          </span>
          <span className="text-nowrap font-medium capitalize text-slate-800">
            {count}
          </span>
        </div>
      </div>
      <Button
        size="sm"
        className={cn(
          'h-max min-h-max max-w-max cursor-pointer rounded-lg bg-primary-50 p-2 text-[13px] font-semibold capitalize text-primary',

          {
            'bg-red-50 text-red-500': icon?.color === 'danger',
            'bg-green-50 text-green-600': icon?.color === 'success',
            'bg-secondary/10 text-orange-600': icon?.color === 'secondary',
          },
        )}
      >
        {value}
      </Button>
    </div>
  )
}

export const convertToCSV = (objArray) => {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray
  let str = ''
  const headers =
    'Date,First Name,Last Name,NRC,Destination,Amount,Service Provider, Status, Remark,'
  str += headers + '\r\n'

  for (let i = 0; i < array.length; i++) {
    let line = ''
    line += `"${formatDate(array[i]?.created_at, 'DD-MM-YYYY') || ''}",`
    line += `"${array[i]?.first_name || ''}",`
    line += `"${array[i]?.last_name || ''}",`
    line += `"${array[i]?.nrc || ''}",`
    line += `"${array[i]?.destination || ''}",`
    line += `"${array[i]?.amount || ''}",`
    line += `"${array[i]?.service_provider || ''}",`
    line += `"${array[i]?.status || ''}",`
    line += `"${array[i]?.remarks || ''}",`

    str += line + '\r\n'
  }

  return str
}
