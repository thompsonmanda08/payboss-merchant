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
import { cn, downloadCSV, formatCurrency, formatDate } from '@/lib/utils'

import { DateRangePickerField } from '@/components/ui/DateSelectField'
import { useDateFormatter } from '@react-aria/i18n'
import { BULK_REPORTS_QUERY_KEY } from '@/lib/constants'
import { useMutation } from '@tanstack/react-query'
import { getBulkAnalyticReports } from '@/app/_actions/transaction-actions'
import { AnimatePresence, motion } from 'framer-motion'
import ReportDetailsViewer from '@/components/containers/analytics/ReportDetailsViewer'
import { parseDate, getLocalTimeZone } from '@internationalized/date'
import { singleReportsColumns } from '@/context/paymentsStore'

const bulkReportsColumns = [
  { name: 'DATE', uid: 'created_at', sortable: true },
  { name: 'NAME', uid: 'name', sortable: true },

  { name: 'TOTAL RECORDS', uid: 'allRecords', sortable: true },
  { name: 'TOTAL AMOUNT', uid: 'allRecordsValue', sortable: true },

  { name: 'TOTAL SUCCESSFUL', uid: 'successfulRecords', sortable: true },
  { name: 'AMOUNT SUCCESSFUL', uid: 'successfulRecordsValue', sortable: true },

  { name: 'TOTAL FAILED', uid: 'failedRecords', sortable: true },
  { name: 'AMOUNT FAILED', uid: 'failedRecordsValue', sortable: true },
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
  const [dateRange, setDateRange] = useState({})
  const [isExpanded, setIsExpanded] = useState(true)
  const [openReportsModal, setOpenReportsModal] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState(null) // ON ROW SELECTED
  // const [selectedBatchID, setSelectedBatchID] = useState(null) // ON ROW SELECTED

  const thisMonth = formatDate(new Date(), 'YYYY-MM-DD')
  const thirtyDaysAgoDate = new Date()
  thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30)
  const thirtyDaysAgo = formatDate(thirtyDaysAgoDate, 'YYYY-MM-DD')

  const [date, setDate] = useState({
    start: parseDate(thirtyDaysAgo),
    end: parseDate(thisMonth),
  })

  const start_date = formatDate(
    date?.start?.toDate(getLocalTimeZone()),
    'YYYY-MM-DD',
  )
  const end_date = formatDate(
    date?.end?.toDate(getLocalTimeZone()),
    'YYYY-MM-DD',
  )

  // HANDLE FET BULK REPORT DATA
  const mutation = useMutation({
    mutationKey: [BULK_REPORTS_QUERY_KEY, workspaceID],
    mutationFn: (dateRange) => getBulkAnalyticReports(workspaceID, dateRange),
  })

  const report = mutation?.data?.data || []
  const directBatches = report?.directBatches || []
  const voucherBatches = report?.voucherBatches || []

  console.log(report)
  console.log(voucherBatches)
  console.log(directBatches)

  let formatter = useDateFormatter({ dateStyle: 'long' })

  const { activeTab, currentTabIndex, navigateTo } = useCustomTabsHook([
    <CustomTable
      columns={bulkReportsColumns}
      rows={directBatches || ['1', '2', '3']}
      isLoading={mutation.isPending}
      isError={mutation.isError}
      removeWrapper
      onRowAction={(key) => {
        // console.log(key)
        const batch = directBatches.find((row) => row.ID == key)
        // console.log(batch)

        setSelectedBatch(batch)
        setOpenReportsModal(true)
      }}
    />,
    <CustomTable
      columns={bulkReportsColumns}
      rows={voucherBatches}
      isLoading={mutation.isPending}
      isError={mutation.isError}
      onRowAction={(key) => {
        // setSelectedBatchID(key)
        setOpenReportsModal(true)
      }}
      removeWrapper
    />,
  ])

  async function applyDataFilter() {
    const dateRange = {
      start_date: start_date || thirtyDaysAgo,
      end_date: end_date || thisMonth,
      end_date,
    }

    const response = await getBulkReportData(dateRange)

    return response
  }

  async function getBulkReportData(dateRange) {
    const response = await mutation.mutateAsync(dateRange)

    return response
  }

  function handleFileExportToCSV() {
    // Implement CSV export functionality here
    if (currentTabIndex === 0) {
      const csvData = convertToCSV(directBatches)
      downloadCSV(csvData, 'bulk_transactions')
    }
    if (currentTabIndex === 1) {
      const csvData = convertToCSV(voucherBatches)
      downloadCSV(csvData, 'bulk_voucher_transactions')
    }
  }

  useEffect(() => {
    const dateRange = {
      start_date: thirtyDaysAgo,
      end_date: thisMonth,
    }
    if (!mutation.data && date?.start && date?.end) {
      getBulkReportData(dateRange)
    }
  }, [])

  console.log(selectedBatch)

  return (
    <>
      <div className="mb-4 flex w-full items-start justify-start pb-2">
        <div className="flex items-center gap-2">
          <DateRangePickerField
            label={'Reports Date Range'}
            description={'Dates to generate transactional reports'}
            visibleMonths={2}
            autoFocus
            value={date}
            setValue={setDate}
          />{' '}
          <Button
            onPress={applyDataFilter}
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
            title={
              'Bulk Transactions History' +
              ` (${
                date
                  ? formatter.formatRange(
                      date.start.toDate(getLocalTimeZone()),
                      date.end.toDate(getLocalTimeZone()),
                    )
                  : '--'
              })`
            }
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

        {/* TODO:  THIS CAN BE ONCE SINGLE COMPONENT */}
        {report && Object.keys(report).length > 0 && (
          <AnimatePresence>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: isExpanded ? 'auto' : 0,
                opacity: isExpanded ? 1 : 0,
              }}
            >
              <Card className={'mt-4 gap-5 shadow-none'}>
                <div className="flex flex-col flex-wrap sm:flex-row md:justify-between">
                  <div className="flex flex-1 flex-col gap-4">
                    <TotalValueStat
                      label={'Total Batches'}
                      icon={{
                        component: <ListBulletIcon className="h-5 w-5" />,
                        color: 'primary',
                      }}
                      count={report?.batches?.count || 0}
                      value={formatCurrency(report?.batches?.value || 0)}
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-4">
                    <TotalValueStat
                      label={'Total Direct Batches'}
                      icon={{
                        component: <ListBulletIcon className="h-5 w-5" />,
                        color: 'primary-800',
                      }}
                      count={report?.direct?.all?.count || 0}
                      value={formatCurrency(report?.direct?.all?.value || 0)}
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-4">
                    <TotalValueStat
                      label={'Total Voucher Batches'}
                      icon={{
                        component: <ListBulletIcon className="h-5 w-5" />,
                        color: 'secondary',
                      }}
                      count={report?.voucher?.all?.count || 0}
                      value={formatCurrency(report?.voucher?.all?.value || 0)}
                    />
                  </div>
                </div>
                <div className="flex flex-col flex-wrap sm:flex-row md:justify-evenly">
                  <div className="flex flex-1 flex-col gap-4">
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
                    <TotalValueStat
                      label={'Proccessed Voucher Batches'}
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

                  <div className="flex flex-1 flex-col gap-4">
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
                  <div className="flex flex-1 flex-col gap-4">
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
      {/*  CURRENTLY ACTIVE TABLE */}
      {/**************** IF TOP_OVER RENDERING IS REQUIRED *******************/}
      {openReportsModal && (
        <ReportDetailsViewer
          setOpenReportsModal={setOpenReportsModal}
          openReportsModal={openReportsModal}
          batch={selectedBatch}
          columns={singleReportsColumns}
        />
      )}
      {/************************************************************************/}
    </>
  )
}

export function TotalValueStat({ label, icon, count, value }) {
  return (
    <div className="relative flex w-full max-w-sm items-center justify-between">
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
    'Date,Name,Total Records,Total Amount,Total Successful,Total Failed, Amount Failed'
  str += headers + '\r\n'

  for (let i = 0; i < array.length; i++) {
    let line = ''
    let date = formatDate(array[i]?.created_at).replaceAll('-', '_')
    line += `"${date || ''}",`
    line += `"${array[i]?.name || ''}",`
    line += `"${array[i]?.allRecords || ''}",`
    line += `"${array[i]?.allRecordsValue || ''}",`
    line += `"${array[i]?.successfulRecords || ''}",`
    line += `"${array[i]?.successfulRecordsValue || ''}",`
    line += `"${array[i]?.failedRecords || ''}",`
    line += `"${array[i]?.failedRecordsValue || ''}",`

    str += line + '\r\n'
  }

  return str
}
