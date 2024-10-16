'use client'
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
import { formatCurrency } from '@/lib/utils'

import { DateRangePickerField } from '@/components/ui/DateSelectField'
import { COLLECTION_REPORTS_QUERY_KEY } from '@/lib/constants'
import { useMutation } from '@tanstack/react-query'
import { getCollectionsReport } from '@/app/_actions/transaction-actions'
import { AnimatePresence, motion } from 'framer-motion'

import { API_KEY_TRANSACTION_COLUMNS } from '../../collections/api-integration/API'
import TotalStatsLoader from '@/components/elements/TotalStatsLoader'
import Card from '@/components/base/Card'
import CardHeader from '@/components/base/CardHeader'
import Tabs from '@/components/elements/Tabs'
import TotalValueStat from '@/components/elements/TotalStats'
import { convertToCSVString } from '@/app/_actions/file-converstion-actions'

const SERVICE_TYPES = [
  {
    name: 'API Transactions Reports',
    description:
      'Reports on API transactions that took place within the date range applied',
    index: 0,
    service: 'api-integration', // SERVICE TYPE REQUIRED BY API ENDPOINT
  },
  {
    name: 'Till Transactions Reports',
    description:
      'Reports on till transactions that took place within the date range applied',
    index: 1,
    service: 'till', // SERVICE TYPE REQUIRED BY API ENDPOINT
  },
]

export default function CollectionsReports({ workspaceID }) {
  const [dateRange, setDateRange] = useState()
  const [isExpanded, setIsExpanded] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // HANDLE FETCH FILTERED TRANSACTION REPORT DATA
  const mutation = useMutation({
    mutationKey: [COLLECTION_REPORTS_QUERY_KEY, workspaceID],
    mutationFn: (filterDates) => getReportsData(filterDates),
  })

  // ABSTRACT THE DATE RANGE FROM THE DATE PICKER - TO FETCH ASYNCHRONOUSLY
  async function runAsyncMutation(range) {
    // IF NO DATE RANGE IS SELECTED, RETURN EMPTY ARRAY
    if (!range?.start_date && !range?.end_date) {
      return []
    }
    return await mutation.mutateAsync(range)
  }

  // FETCH COLLECTIONS REPORT DATA - ASYNC AS HOISTED INTO THE MUTATION FUNCTION
  async function getReportsData(dateRange) {
    let serviceType = SERVICE_TYPES[currentTabIndex]?.service

    if (!serviceType) {
      serviceType = 'api-integration'
    }

    const response = await getCollectionsReport(
      workspaceID,
      serviceType,
      dateRange,
    )
    return response || []
  }

  // MUTATION RESPONSE DATA
  const report = mutation?.data?.data?.summary || []
  const transactions = mutation?.data?.data?.data || []

  // console.log(mutation?.data)

  // RESOLVE DATA FILTERING
  const hasSearchFilter = Boolean(searchQuery)
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
      runAsyncMutation(dateRange)
    }
  }, [dateRange])

  function handleFileExportToCSV() {
    // Implement CSV export functionality here
    if (currentTabIndex === 0)
      convertToCSVString(transactions, 'api_collection_transactions')

    if (currentTabIndex === 1)
      convertToCSVString(transactions, 'till_collection_transactions')
  }

  const { activeTab, currentTabIndex, navigateTo } = useCustomTabsHook([
    // <CustomTable
    //   columns={API_KEY_TRANSACTION_COLUMNS}
    //   rows={filteredItems || []}
    //   isLoading={mutation.isPending}
    //   isError={mutation.isError}
    //   removeWrapper
    //   onRowAction={(key) => {}}
    // />
  ])

  useEffect(() => {
    runAsyncMutation(dateRange)
  }, [currentTabIndex])

  return (
    <>
      <div className="mb-4 flex w-full items-start justify-start pb-2">
        <div className="flex items-center gap-2">
          <DateRangePickerField
            label={'Reports Date Range'}
            description={'Dates to generate reports'}
            visibleMonths={2}
            autoFocus
            dateRange={dateRange}
            setDateRange={setDateRange}
          />{' '}
          <Button
            onPress={() => runAsyncMutation(dateRange)}
            endContent={<FunnelIcon className="h-5 w-5" />}
          >
            Apply
          </Button>
        </div>
      </div>
      {/************************************************************************/}
      <Card className={'w-full gap-3'}>
        <div className="flex items-end justify-between">
          <Tabs
            className={'mb-2 mr-auto'}
            tabs={SERVICE_TYPES}
            currentTab={currentTabIndex}
            navigateTo={navigateTo}
          />
        </div>
        <div className="flex w-full items-center justify-between gap-8 ">
          <CardHeader
            title={`${SERVICE_TYPES[currentTabIndex].name} (${dateRange?.range || '--'})`}
            infoText={SERVICE_TYPES[currentTabIndex].description}
            classNames={{
              titleClasses: 'xl:text-[clamp(1.125rem,1vw,1.75rem)] font-bold',
              infoClasses: 'text-[clamp(0.8rem,0.8vw,1rem)]',
            }}
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
              onPress={() => handleFileExportToCSV()}
              startContent={<ArrowDownTrayIcon className="h-5 w-5" />}
            >
              Export
            </Button>
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
              <Card className={'mb-4 mt-2 shadow-none'}>
                {Object.keys(report).length > 0 ? (
                  <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                    <div className="flex-1">
                      <TotalValueStat
                        label={'Total Transactions'}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: 'primary',
                        }}
                        count={transactions.length || 0}
                        value={''}
                      />
                    </div>
                    <div className="flex-1">
                      <TotalValueStat
                        label={'Successful Transactions'}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: 'success',
                        }}
                        count={report?.successful_count || 0}
                        value={formatCurrency(report?.successful_value)}
                      />
                    </div>

                    <div className="flex-1">
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
                  </div>
                ) : (
                  <TotalStatsLoader className={'justify-between'} />
                )}
              </Card>
            </motion.div>
          </AnimatePresence>
        }
        {/* {activeTab} */}
        <CustomTable
          columns={API_KEY_TRANSACTION_COLUMNS}
          rows={filteredItems || []}
          isLoading={mutation.isPending}
          isError={mutation.isError}
          removeWrapper
          // onRowAction={(key) => {}}
        />
      </Card>

      {/************************************************************************/}
    </>
  )
}
