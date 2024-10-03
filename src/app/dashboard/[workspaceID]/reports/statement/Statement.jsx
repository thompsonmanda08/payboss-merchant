'use client'
import React, { useState } from 'react'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import { ArrowDownTrayIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { parseDate, getLocalTimeZone } from '@internationalized/date'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

import { DateRangePickerField } from '@/components/ui/DateSelectField'
import { BULK_REPORTS_QUERY_KEY } from '@/lib/constants'
import { useMutation } from '@tanstack/react-query'
import { getBulkAnalyticReports } from '@/app/_actions/transaction-actions'
import ReportDetailsViewer from '@/components/containers/analytics/ReportDetailsViewer'
import { WalletTransactionHistory } from '@/components/containers/workspace/Wallet'
import { useWalletPrefundHistory } from '@/hooks/useQueryHooks'
import { useDateFormatter } from '@react-aria/i18n'
import {
  convertWalletStatementToCSV,
  downloadCSV,
} from '@/app/_actions/file-converstion-actions'
import Card from '@/components/base/Card'
import CardHeader from '@/components/base/CardHeader'

export default function StatementReport({ workspaceID }) {
  const [openReportsModal, setOpenReportsModal] = useState(false)

  let formatter = useDateFormatter({ dateStyle: 'long' })

  const [date, setDate] = useState({})

  // HANDLE FET BULK REPORT DATA
  const mutation = useMutation({
    mutationKey: [BULK_REPORTS_QUERY_KEY, workspaceID],
    mutationFn: (dateRange) => getBulkAnalyticReports(workspaceID, dateRange),
  })

  const { data: walletHistoryResponse, isLoading: loadingWalletHistory } =
    useWalletPrefundHistory(workspaceID)

  const walletHistory = walletHistoryResponse?.data?.data || []

  const statementTransactions = mutation?.data?.data || []

  // handle get wallet history asyncronously with a date mutation - date range
  async function getWalletTransactionHistory() {
    await mutation.mutateAsync(dateRange)
  }

  // Implement mannual CSV export functionality
  function handleFileExportToCSV() {
    const csvData = convertWalletStatementToCSV(walletHistory)
    downloadCSV(csvData, 'wallet_statement')
  }

  // ****************** COMPONENT RENDERER *************************** //
  const { activeTab, currentTabIndex, navigateTo } = useCustomTabsHook([
    <WalletTransactionHistory
      workspaceID={workspaceID}
      transactionData={walletHistory.filter((item) => item?.isPrefunded)}
    />,
  ])

  return (
    <>
      <div className="mb-4 flex w-full items-start justify-start pb-2">
        <div className="flex items-center gap-2">
          <DateRangePickerField
            label={'Reports Date Range'}
            description={'Dates to generate transactional reports'}
            visibleMonths={2}
            autoFocus
            dateRange={date}
            setDateRange={setDate}
          />{' '}
          <Button
            onPress={getWalletTransactionHistory}
            endContent={<FunnelIcon className="h-5 w-5" />}
          >
            Apply
          </Button>
        </div>
      </div>
      {/************************************************************************/}

      <Card className={'mb-8 w-full'}>
        <div className="flex items-center gap-2">
          <CardHeader
            title={'Wallet Statement'}
            classNames={{
              titleClasses: 'lg:text-lg xl:text-xl font-bold',
              infoClasses: 'md:text-base',
            }}
            infoText={
              'Statement transactions:' + ` (${date ? date.range : '--'})`
            }
          />
          <Button
            onPress={() => handleFileExportToCSV()}
            endContent={<ArrowDownTrayIcon className="h-5 w-5" />}
          >
            Export
          </Button>
        </div>

        {/* <div className="mb-4 flex w-full items-center justify-between gap-8 ">
          <Tabs
            className={'my-2 mr-auto max-w-md'}
            tabs={SERVICE_TYPES}
            currentTab={currentTabIndex}
            navigateTo={navigateTo}
          />
          <div className="flex w-full max-w-md">
            <Search
              // className={'mt-auto'}
              placeholder={'Search by name, or type...'}
              classNames={{ input: 'h-10' }}
              onChange={(e) => {
                setSearchQuery(e.target.value)
              }}
            />
          </div>
        </div> */}
        {activeTab}
      </Card>
      {/* *************** IF TOP_OVER RENDERING IS REQUIRED *******************/}
      {openReportsModal && (
        <ReportDetailsViewer
          setOpenReportsModal={setOpenReportsModal}
          openReportsModal={openReportsModal}
          batchID={selectedBatch?.ID}
        />
      )}
      {/*********************************************************************** */}
    </>
  )
}
