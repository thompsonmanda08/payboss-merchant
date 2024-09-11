'use client'
import { Card, CardHeader } from '@/components/base'
import React, { useState } from 'react'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import { ArrowDownTrayIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { parseDate, getLocalTimeZone } from '@internationalized/date'
import { Button } from '@/components/ui/Button'
import { downloadCSV, formatDate } from '@/lib/utils'

import { DateRangePickerField } from '@/components/ui/DateSelectField'
import { BULK_REPORTS_QUERY_KEY } from '@/lib/constants'
import { useMutation } from '@tanstack/react-query'
import { getBulkAnalyticReports } from '@/app/_actions/transaction-actions'
import ReportDetailsViewer from '@/components/containers/analytics/ReportDetailsViewer'
import { WalletTransactionHistory } from '@/components/containers/workspace/Wallet'
import { useWalletPrefundHistory } from '@/hooks/useQueryHooks'
import { useDateFormatter } from '@react-aria/i18n'

export default function StatementReport({ workspaceID }) {
  const [searchQuery, setSearchQuery] = useState('')

  const [isExpanded, setIsExpanded] = useState(true)
  const [openReportsModal, setOpenReportsModal] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState(null) // ON ROW SELECTED

  let formatter = useDateFormatter({ dateStyle: 'long' })

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

  const { data: walletHistoryResponse, isLoading: loadingWalletHistory } =
    useWalletPrefundHistory(workspaceID)

  const walletHistory = walletHistoryResponse?.data?.data || []

  const report = mutation?.data?.data || []
  const directBatches = report?.directBatches || []
  const voucherBatches = report?.voucherBatches || []

  async function getBulkReportData() {
    await mutation.mutateAsync(dateRange)
  }

  function handleFileExportToCSV() {
    // Implement CSV export functionality here

    const csvData = convertToCSV(walletHistory)

    downloadCSV(csvData, 'wallet_statement')
  }

  // useEffect(() => {
  //   if (!mutation.data && date?.start_date && date?.end_date) {
  //     getBulkReportData()
  //   }
  // }, [date])

  const { activeTab, currentTabIndex, navigateTo } = useCustomTabsHook([
    <WalletTransactionHistory
      workspaceID={workspaceID}
      transactionData={walletHistory.filter((item) => item?.isPrefunded)}
    />,
  ])

  // console.log(
  //   formatter?.formatRange(
  //     date?.start_date?.toDate(getLocalTimeZone()),
  //     date?.end_date?.toDate(getLocalTimeZone()),
  //   )
  // )

  // const RANGE = formatter?.formatRange(START_DATE, END_DATE)

  // console.log(START_DATE)
  // console.log(END_DATE)
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
            onPress={getBulkReportData}
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
              'Statement transactions:' +
              ` (${
                date
                  ? formatter.formatRange(
                      date.start.toDate(getLocalTimeZone()),
                      date.end.toDate(getLocalTimeZone()),
                    )
                  : '--'
              })`
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
      {/**************** IF TOP_OVER RENDERING IS REQUIRED *******************/}
      {openReportsModal && (
        <ReportDetailsViewer
          setOpenReportsModal={setOpenReportsModal}
          openReportsModal={openReportsModal}
          batchID={selectedBatch?.ID}
        />
      )}
      {/************************************************************************/}
    </>
  )
}

export const convertToCSV = (objArray) => {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray
  let str = ''
  const headers = 'Date,Narration,Initiator,Amount,Status,Remarks'
  str += headers + '\r\n'

  for (let i = 0; i < array.length; i++) {
    let line = ''
    line += `"${formatDate(array[i]?.created_at, 'DD-MM-YYYY') || ''}",`
    line += `"${array[i]?.content || ''}",`
    line += `"${array[i]?.created_by || ''}",`
    line += `"${array[i]?.amount || ''}",`
    line += `"${array[i]?.status || ''}",`
    line += `"${array[i]?.remarks || ''}",`

    str += line + '\r\n'
  }

  return str
}
