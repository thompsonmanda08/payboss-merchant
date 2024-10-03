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
import { downloadCSV, formatCurrency, formatDate } from '@/lib/utils'

import { DateRangePickerField } from '@/components/ui/DateSelectField'
import { BULK_REPORTS_QUERY_KEY } from '@/lib/constants'
import { useMutation } from '@tanstack/react-query'
import {
  getAPICollectionAnalyticReports,
  getBulkAnalyticReports,
} from '@/app/_actions/transaction-actions'
import { AnimatePresence, motion } from 'framer-motion'
import { parseDate, getLocalTimeZone } from '@internationalized/date'

import { useDateFormatter } from '@react-aria/i18n'
import { TotalValueStat } from '../bulk-payments/BulkTransactionsStats'
import { API_KEY_TRANSACTION_COLUMNS } from '../../collections/api-integration/API'
import { Skeleton } from '@/components/ui/skeleton'
import TotalStatsLoader from '@/components/base/TotalStatsLoader'

const SERVICE_TYPES = [
  {
    name: 'API Integration Collections',
    index: 0,
  },
  {
    name: 'Payment Links',
    index: 1,
  },
]

export default function APITransactionsStats({ workspaceID }) {
  const [dateRange, setDateRange] = useState({})
  const [isExpanded, setIsExpanded] = useState(true)
  let formatter = useDateFormatter({ dateStyle: 'long' })

  const thisMonth = formatDate(new Date(), 'YYYY-MM-DD')
  const thirtyDaysAgoDate = new Date()
  thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30)
  const thirtyDaysAgo = formatDate(thirtyDaysAgoDate, 'YYYY-MM-DD')

  const [date, setDate] = useState({
    start: parseDate(thirtyDaysAgo),
    end: parseDate(thisMonth),
  })

  const [searchQuery, setSearchQuery] = React.useState('')
  const hasSearchFilter = Boolean(searchQuery)

  const start_date = formatDate(
    date?.start?.toDate(getLocalTimeZone()),
    'YYYY-MM-DD',
  )
  const end_date = formatDate(
    date?.end?.toDate(getLocalTimeZone()),
    'YYYY-MM-DD',
  )

  // HANDLE FETCH FILTERED TRANSACTION REPORT DATA
  const mutation = useMutation({
    mutationKey: [BULK_REPORTS_QUERY_KEY, workspaceID],
    mutationFn: (dateRange) =>
      getAPICollectionAnalyticReports(workspaceID, dateRange),
  })

  async function getAPITransactionsData(dateRange) {
    const response = await mutation.mutateAsync(dateRange)
    return response
  }

  async function applyDataFilter() {
    const dateRange = {
      start_date,
      end_date,
    }

    const response = await getAPITransactionsData(dateRange)

    return response
  }

  const report = mutation?.data?.data?.summary || []
  const transactions = mutation?.data?.data?.data || []

  const filteredItems = React.useMemo(() => {
    let filteredrows = [...transactions]

    if (hasSearchFilter) {
      filteredrows = filteredrows.filter(
        (row) =>
          // row?.narration?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row?.transactionID
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          row?.amount?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return filteredrows
  }, [transactions, searchQuery])

  useEffect(() => {
    if (!mutation.data && dateRange?.start_date && dateRange?.end_date) {
      getAPITransactionsData()
    }
  }, [dateRange])

  const { activeTab, currentTabIndex, navigateTo } = useCustomTabsHook([
    <CustomTable
      columns={API_KEY_TRANSACTION_COLUMNS}
      rows={filteredItems || []}
      isLoading={mutation.isPending}
      isError={mutation.isError}
      removeWrapper
      onRowAction={(key) => {
        console.log(key)
      }}
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

  useEffect(() => {
    const dateRange = {
      start_date: thirtyDaysAgo,
      end_date: thisMonth,
    }
    if (!mutation.data && date?.start && date?.end) {
      getAPITransactionsData(dateRange)
    }
  }, [])

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
              'API Transactions History' +
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
        {
          <AnimatePresence>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: isExpanded ? 'auto' : 0,
                opacity: isExpanded ? 1 : 0,
              }}
            >
              <Card className={'mt-4 shadow-none'}>
                {Object.keys(report).length > 0 ? (
                  <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                    <TotalValueStat
                      label={'Total Transactions'}
                      icon={{
                        component: <ListBulletIcon className="h-5 w-5" />,
                        color: 'primary',
                      }}
                      count={transactions.length || 0}
                      value={'N/A'}
                    />
                    <TotalValueStat
                      label={'Successful Transactions'}
                      icon={{
                        component: <ListBulletIcon className="h-5 w-5" />,
                        color: 'success',
                      }}
                      count={report?.successful_count || 0}
                      value={formatCurrency(report?.successful_value || 0)}
                    />

                    <TotalValueStat
                      label={'Failed Transactions'}
                      icon={{
                        component: <ListBulletIcon className="h-5 w-5" />,
                        color: 'danger',
                      }}
                      count={report?.failed_count || 0}
                      value={formatCurrency(report?.failed_value || 0)}
                    />
                  </div>
                ) : (
                  <TotalStatsLoader className={'justify-between'} />
                )}
              </Card>
            </motion.div>
          </AnimatePresence>
        }
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

export const convertToCSV = (objArray) => {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray
  let str = ''
  const headers =
    'Date,First Name,Last Name,NRC,Destination,Amount,Service Provider, Status, Remark,'
  str += headers + '\r\n'

  for (let i = 0; i < array.length; i++) {
    let line = ''
    let date = formatDate(array[i]?.created_at).replaceAll('-', '_')
    line += `"${date || ''}",`
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
