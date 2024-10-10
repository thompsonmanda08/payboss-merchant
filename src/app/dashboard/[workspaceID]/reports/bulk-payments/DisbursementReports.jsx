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
import { useDateFormatter } from '@react-aria/i18n'
import { BULK_REPORTS_QUERY_KEY } from '@/lib/constants'
import { useMutation } from '@tanstack/react-query'
import { getBulkAnalyticReports } from '@/app/_actions/transaction-actions'
import { AnimatePresence, motion } from 'framer-motion'
import ReportDetailsViewer from '@/components/containers/analytics/ReportDetailsViewer'
import { singleReportsColumns } from '@/context/paymentsStore'
import TotalStatsLoader from '@/components/elements/TotalStatsLoader'
import { convertToCSVString } from '@/app/_actions/file-converstion-actions'
import Card from '@/components/base/Card'
import CardHeader from '@/components/base/CardHeader'
import Tabs from '@/components/elements/Tabs'
import TotalValueStat from '@/components/elements/TotalStats'

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
    name: 'Bulk Direct Payments',
    index: 0,
  },
  {
    name: 'Bulk Voucher Payments',
    index: 1,
  },
  // {
  //   name: 'Single Payments',
  //   index: 2,
  // },
]

export default function DisbursementReports({ workspaceID }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({})
  const [isExpanded, setIsExpanded] = useState(true)
  const [openReportsModal, setOpenReportsModal] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState(null) // ON ROW SELECTED
  let formatter = useDateFormatter({ dateStyle: 'long' })

  // HANDLE FETCH BULK REPORT DATA
  const mutation = useMutation({
    mutationKey: [BULK_REPORTS_QUERY_KEY, workspaceID],
    mutationFn: (dateRange) => getBulkAnalyticReports(workspaceID, dateRange),
  })

  const report = mutation?.data?.data || []
  const directBatches = report?.directBatches || []
  const voucherBatches = report?.voucherBatches || []

  const { activeTab, currentTabIndex, navigateTo } = useCustomTabsHook([
    <CustomTable
      columns={bulkReportsColumns}
      rows={directBatches || ['1', '2', '3']}
      isLoading={mutation.isPending}
      isError={mutation.isError}
      removeWrapper
      onRowAction={(key) => {
        const batch = directBatches.find((row) => row.ID == key)
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

  async function getBulkReportData(range) {
    return await mutation.mutateAsync(range)
  }

  function handleFileExportToCSV() {
    if (currentTabIndex === 0) {
      convertToCSVString(directBatches)
      return
    }
    if (currentTabIndex === 1) {
      convertToCSVString(voucherBatches)
      return
    }
  }

  useEffect(() => {
    if (!mutation.data && dateRange?.start_date && dateRange?.end_date) {
      getBulkReportData(dateRange)
    }
  }, [dateRange])

  return (
    <>
      <div className="mb-4 flex w-full items-start justify-start pb-2">
        <div className="flex items-center gap-2">
          <DateRangePickerField
            label={'Reports Date Range'}
            description={'Dates to generate transactional reports'}
            visibleMonths={2}
            autoFocus
            dateRange={dateRange}
            setDateRange={setDateRange}
          />{' '}
          <Button
            onPress={() => getBulkReportData(dateRange)}
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
            title={`Bulk Transactions History (${dateRange?.range || '--'})`}
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

        <AnimatePresence>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isExpanded ? 'auto' : 0,
              opacity: isExpanded ? 1 : 0,
            }}
          >
            <Card className={'mt-4 gap-5 shadow-none'}>
              {Object.keys(report).length > 0 ? (
                <>
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
                        count={
                          report?.directTransactions?.successful?.count || 0
                        }
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
                </>
              ) : (
                <TotalStatsLoader length={8} className={'flex-wrap'} />
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </Card>

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
            <Button onPress={() => handleFileExportToCSV()}>
              <ArrowDownTrayIcon className="h-5 w-5" /> Export
            </Button>
          </div>
        </div>
        {activeTab}
      </Card>

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
