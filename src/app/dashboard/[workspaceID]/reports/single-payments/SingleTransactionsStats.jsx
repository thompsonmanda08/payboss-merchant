// 'use client'
// import React, { useEffect, useState } from 'react'
// import useCustomTabsHook from '@/hooks/useCustomTabsHook'
// import Search from '@/components/ui/Search'
// import CustomTable from '@/components/containers/tables/Table'
// import {
//   ArrowDownTrayIcon,
//   EyeSlashIcon,
//   FunnelIcon,
//   ListBulletIcon,
//   PresentationChartBarIcon,
// } from '@heroicons/react/24/outline'
// import { Button } from '@/components/ui/Button'
// import { formatCurrency, formatDate } from '@/lib/utils'
// import { DateRangePickerField } from '@/components/ui/DateSelectField'
// import { BULK_REPORTS_QUERY_KEY } from '@/lib/constants'
// import { useMutation } from '@tanstack/react-query'
// import {
//   getAllSingleTransactions,
//   getBulkAnalyticReports,
// } from '@/app/_actions/transaction-actions'
// import { AnimatePresence, motion } from 'framer-motion'
// import { parseDate, getLocalTimeZone } from '@internationalized/date'
// import { useDateFormatter } from '@react-aria/i18n'
// import Card from '@/components/base/Card'
// import CardHeader from '@/components/base/CardHeader'
// import Tabs from '@/components/elements/Tabs'
// import TotalValueStat from '@/components/elements/TotalStats'

// const bulkReportsColumns = [
//   { name: 'DATE', uid: 'created_at', sortable: true },
//   { name: 'FIRST NAME', uid: 'first_name', sortable: true },

//   { name: 'LAST NAME', uid: 'last_name', sortable: true },
//   { name: 'NRC', uid: 'nrc', sortable: true },
//   { name: 'DESTINATION', uid: 'destination', sortable: true },

//   { name: 'AMOUNT', uid: 'amount', sortable: true },
//   { name: 'SERVICE PROVIDER', uid: 'service_provider', sortable: true },

//   { name: 'STATUS', uid: 'status', sortable: true },
//   { name: 'REMARKS', uid: 'remarks', sortable: true },
// ]

// const SERVICE_TYPES = [
//   {
//     name: 'Direct Payments',
//     index: 0,
//   },
//   {
//     name: 'Voucher Payments',
//     index: 1,
//   },
//   // {
//   //   name: 'Expenses',
//   //   index: 2,
//   // },
// ]

// export default function SingleTransactionsStats({ workspaceID }) {
//   const [searchQuery, setSearchQuery] = useState('')
//   const [dateRange, setDateRange] = useState({})
//   const [isExpanded, setIsExpanded] = useState(true)
//   const [openReportsModal, setOpenReportsModal] = useState(false)
//   const [selectedTransaction, setSelectedTransaction] = useState(null) // ON ROW SELECTED
//   let formatter = useDateFormatter({ dateStyle: 'long' })

//   const thisMonth = formatDate(new Date(), 'YYYY-MM-DD')
//   const thirtyDaysAgoDate = new Date()
//   thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30)
//   const thirtyDaysAgo = formatDate(thirtyDaysAgoDate, 'YYYY-MM-DD')

//   const [date, setDate] = useState({
//     start: parseDate(thirtyDaysAgo),
//     end: parseDate(thisMonth),
//   })

//   const start_date = formatDate(
//     date?.start?.toDate(getLocalTimeZone()),
//     'YYYY-MM-DD',
//   )
//   const end_date = formatDate(
//     date?.end?.toDate(getLocalTimeZone()),
//     'YYYY-MM-DD',
//   )

//   // HANDLE FET BULK REPORT DATA
//   const mutation = useMutation({
//     mutationKey: [BULK_REPORTS_QUERY_KEY, workspaceID],
//     mutationFn: (dateRange) => getAllSingleTransactions(workspaceID, dateRange),
//   })

//   const report = mutation?.data?.data || []
//   const directTransactions = mutation?.data?.data?.direct || []

//   async function applyDataFilter() {
//     const dateRange = {
//       start_date,
//       end_date,
//     }
//     const response = await getBulkReportData(dateRange)
//     return response
//   }

//   async function getBulkReportData(dateRange) {
//     const response = await mutation.mutateAsync(dateRange)

//     return response
//   }

//   useEffect(() => {
//     if (!mutation.data && dateRange?.start_date && dateRange?.end_date) {
//       getBulkReportData()
//     }
//   }, [dateRange])

//   const { activeTab, currentTabIndex, navigateTo } = useCustomTabsHook([
//     <CustomTable
//       columns={bulkReportsColumns}
//       rows={[]}
//       isLoading={mutation.isPending}
//       isError={mutation.isError}
//       removeWrapper
//       onRowAction={(key) => {
//        
//         const transaction = voucherTransactions.find((row) => row.ID == key)
//   

//         setSelectedTransaction(batch)
//         setOpenReportsModal(true)
//       }}
//     />,
//   ])

//   function handleFileExportToCSV() {
//     // Implement CSV export functionality here
//     if (currentTabIndex === 0) {
//       const csvData = convertSingleTransactionToCSV(voucherTransactions)
//       downloadCSV(csvData, 'single_direct_transactions')
//     }
//     if (currentTabIndex === 1) {
//       const csvData = convertSingleTransactionToCSV(voucherTransactions)
//       downloadCSV(csvData, 'single_voucher_transactions')
//     }
//   }

//   useEffect(() => {
//     const dateRange = {
//       start_date: thirtyDaysAgo,
//       end_date: thisMonth,
//     }
//     if (!mutation.data && date?.start && date?.end) {
//       getBulkReportData(dateRange)
//     }
//   }, [])

//   return (
//     <>
//       <div className="mb-4 flex w-full items-start justify-start pb-2">
//         <div className="flex items-center gap-2">
//           <DateRangePickerField
//             label={'Reports Date Range'}
//             description={'Dates to generate transactional reports'}
//             visibleMonths={2}
//             autoFocus
//             value={date}
//             setValue={setDate}
//           />{' '}
//           <Button
//             onPress={applyDataFilter}
//             endContent={<FunnelIcon className="h-5 w-5" />}
//           >
//             Apply
//           </Button>
//         </div>
//       </div>
//       {/************************************************************************/}
//       <Card className={'mb-8 w-full'}>
//         <div className="flex items-end justify-between">
//           <CardHeader
//             title={
//               'Single Transactions History' +
//               ` (${
//                 date
//                   ? formatter.formatRange(
//                       date.start.toDate(getLocalTimeZone()),
//                       date.end.toDate(getLocalTimeZone()),
//                     )
//                   : '--'
//               })`
//             }
//             infoText={
//               'Transactions logs to keep track of your workspace activity'
//             }
//           />
//           <div className="flex gap-4">
//             <Button
//               color={'primary'}
//               variant="flat"
//               onPress={() => setIsExpanded(!isExpanded)}
//             >
//               {isExpanded ? (
//                 <EyeSlashIcon className="h-5 w-5" />
//               ) : (
//                 <PresentationChartBarIcon className="h-5 w-5" />
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* TODO:  THIS CAN BE ONCE SINGLE COMPONENT */}
//         {report && Object.keys(report).length > 0 && (
//           <AnimatePresence>
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{
//                 height: isExpanded ? 'auto' : 0,
//                 opacity: isExpanded ? 1 : 0,
//               }}
//             >
//               <Card className={'mt-4 shadow-none'}>
//                 <TotalValueStat
//                   label={'Total Transaction'}
//                   icon={{
//                     component: <ListBulletIcon className="h-5 w-5" />,
//                     color: 'primary',
//                   }}
//                   count={report?.batches?.count || 0}
//                   value={formatCurrency(report?.batches?.value || 0)}
//                 />
//                 <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-12 ">
//                   <div className="flex flex-col gap-4">
//                     <TotalValueStat
//                       label={'Total Direct Transaction'}
//                       icon={{
//                         component: <ListBulletIcon className="h-5 w-5" />,
//                         color: 'primary-800',
//                       }}
//                       count={report?.direct?.all?.count || 0}
//                       value={formatCurrency(report?.direct?.all?.value || 0)}
//                     />
//                     <TotalValueStat
//                       label={'Proccessed Direct Batches'}
//                       icon={{
//                         component: <ListBulletIcon className="h-5 w-5" />,
//                         color: 'primary-800',
//                       }}
//                       count={report?.direct?.proccessed?.count || 0}
//                       value={formatCurrency(
//                         report?.direct?.proccessed?.value || 0,
//                       )}
//                     />
//                   </div>
//                   <div className="flex flex-col gap-4">
//                     <TotalValueStat
//                       label={'Total Voucher Transaction'}
//                       icon={{
//                         component: <ListBulletIcon className="h-5 w-5" />,
//                         color: 'secondary',
//                       }}
//                       count={report?.voucher?.all?.count || 0}
//                       value={formatCurrency(report?.voucher?.all?.value || 0)}
//                     />
//                     <TotalValueStat
//                       label={'Proccessed Voucher Transaction'}
//                       icon={{
//                         component: <ListBulletIcon className="h-5 w-5" />,
//                         color: 'secondary',
//                       }}
//                       count={report?.voucher?.proccessed?.count || 0}
//                       value={formatCurrency(
//                         report?.voucher?.proccessed?.value || 0,
//                       )}
//                     />
//                   </div>
//                   <div className="flex flex-col gap-4">
//                     <TotalValueStat
//                       label={'Successful Direct Transaction'}
//                       icon={{
//                         component: <ListBulletIcon className="h-5 w-5" />,
//                         color: 'success',
//                       }}
//                       count={report?.directTransactions?.successful?.count || 0}
//                       value={formatCurrency(
//                         report?.directTransactions?.successful?.value || 0,
//                       )}
//                     />
//                     <TotalValueStat
//                       label={'Failed Direct Transactions'}
//                       icon={{
//                         component: <ListBulletIcon className="h-5 w-5" />,
//                         color: 'danger',
//                       }}
//                       count={report?.directTransactions?.failed?.count || 0}
//                       value={formatCurrency(
//                         report?.directTransactions?.failed?.value || 0,
//                       )}
//                     />
//                   </div>
//                   <div className="flex flex-col gap-4">
//                     <TotalValueStat
//                       label={'Successful Voucher Transaction'}
//                       icon={{
//                         component: <ListBulletIcon className="h-5 w-5" />,
//                         color: 'success',
//                       }}
//                       count={
//                         report?.voucherTransactions?.successful?.count || 0
//                       }
//                       value={formatCurrency(
//                         report?.voucherTransactions?.successful?.value || 0,
//                       )}
//                     />
//                     <TotalValueStat
//                       label={'Failed Voucher Transactions'}
//                       icon={{
//                         component: <ListBulletIcon className="h-5 w-5" />,
//                         color: 'danger',
//                       }}
//                       count={report?.voucherTransactions?.failed?.count || 0}
//                       value={formatCurrency(
//                         report?.voucherTransactions?.failed?.value || 0,
//                       )}
//                     />
//                   </div>
//                 </div>
//               </Card>
//             </motion.div>
//           </AnimatePresence>
//         )}
//       </Card>
//       {/*  CURRENTLY ACTIVE TABLE */}
//       <Card className={'mb-8 w-full'}>
//         <div className="mb-4 flex w-full items-center justify-between gap-8 ">
//           <Tabs
//             className={'my-2 mr-auto max-w-md'}
//             tabs={SERVICE_TYPES}
//             currentTab={currentTabIndex}
//             navigateTo={navigateTo}
//           />
//           <div className="flex w-full max-w-md gap-4">
//             <Search
//               // className={'mt-auto'}
//               placeholder={'Search by name, or type...'}
//               classNames={{ input: 'h-10' }}
//               onChange={(e) => {
//                 setSearchQuery(e.target.value)
//               }}
//             />
//             <Button
//               color={'primary'}
//               variant="flat"
//               onPress={() => handleFileExportToCSV()}
//             >
//               <ArrowDownTrayIcon className="h-5 w-5" />
//             </Button>
//           </div>
//         </div>
//         {activeTab}
//       </Card>

//       {/************************************************************************/}
//     </>
//   )
// }
