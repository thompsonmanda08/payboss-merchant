import React from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  Tooltip,
} from '@nextui-org/react'
import {
  SERVICE_PROVIDER_COLOR_MAP,
  TRANSACTION_STATUS_COLOR_MAP,
} from '@/lib/constants'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import usePaymentsStore from '@/context/paymentsStore'
import Loader from '@/components/ui/Loader'
import { PlusIcon } from '@heroicons/react/24/outline'
import Search from '@/components/ui/Search'
import { SingleSelectionDropdown } from '@/components/ui/DropdownButton'
import SelectField from '@/components/ui/SelectField'

import { useSingleTransactions, useWorkspaceInit } from '@/hooks/useQueryHooks'
import EmptyLogs from '@/components/base/EmptyLogs'

export const SingleTransactionColumns = [
  { name: 'DATE CREATED', uid: 'created_at', sortable: true },
  { name: 'FIRST NAME', uid: 'first_name', sortable: true },
  { name: 'LAST NAME', uid: 'last_name', sortable: true },
  { name: 'SERVICE', uid: 'service' },
  { name: 'SERVICE PROVIDER', uid: 'service_provider' },
  { name: 'DESTINATION ACCOUNT', uid: 'destination', sortable: true },
  { name: 'LAST MODIFIED', uid: 'updated_at', sortable: true },
  { name: 'AMOUNT', uid: 'amount', sortable: true },
  { name: 'STATUS', uid: 'status', sortable: true },
  // { name: 'ACTIONS', uid: 'actions' },
]

// DEFINE FILTERABLE SERVICES
const SERVICE_FILTERS = [
  {
    name: 'direct single disbursement',
    uid: 'direct single disbursement',
  },
  {
    name: 'voucher single disbursement',
    uid: 'voucher single disbursement',
  },
]

export default function SingleTransactionsTable({
  workspaceID,
  onRowAction,
  rowData,
  columnData,
  removeWrapper,
}) {
  const { data: transactionsResponse, isLoading } =
    useSingleTransactions(workspaceID)

  // DEFINE FILTERABLE ROWS AND COLUMNS
  const columns = columnData || SingleTransactionColumns
  const rows = rowData || transactionsResponse?.data?.data || []

  const {
    setTransactionDetails,
    setOpenTransactionDetailsModal,
    setOpenPaymentsModal,
  } = usePaymentsStore()

  const { data: initialization } = useWorkspaceInit(workspaceID)
  const role = initialization?.data

  const INITIAL_VISIBLE_COLUMNS = columns.map((column) => column?.uid)

  const [filterValue, setFilterValue] = React.useState('')
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]))

  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS),
  )

  const [serviceProtocolFilter, setServiceProtocolFilter] =
    React.useState('all')

  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: 'amount',
    direction: 'ascending',
  })

  const [page, setPage] = React.useState(1)

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    )
  }, [visibleColumns])

  const filteredItems = React.useMemo(() => {
    let filteredrows = [...rows]

    if (hasSearchFilter) {
      filteredrows = filteredrows.filter(
        (row) =>
          row?.first_name.toLowerCase().includes(filterValue.toLowerCase()) ||
          row?.last_name.toLowerCase().includes(filterValue.toLowerCase()) ||
          row?.amount.toLowerCase().includes(filterValue.toLowerCase()),
      )
    }
    if (
      serviceProtocolFilter !== 'all' &&
      Array.from(serviceProtocolFilter).length !== SERVICE_FILTERS.length
    ) {
      filteredrows = filteredrows.filter((row) =>
        Array.from(serviceProtocolFilter).includes(row?.service),
      )
    }

    return filteredrows
  }, [rows, filterValue, serviceProtocolFilter])

  const pages = Math.ceil(filteredItems.length / rowsPerPage)

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column]
      const second = b[sortDescriptor.column]
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, items])

  const renderCell = React.useCallback((row, columnKey) => {
    const cellValue = row[columnKey]
    switch (columnKey) {
      case 'created_at':
        return (
          <span className={cn('text-nowrap capitalize')}>
            {formatDate(cellValue).replaceAll('-', ' ')}
          </span>
        )
      case 'updated_at':
        return (
          <span className={cn('text-nowrap capitalize')}>
            {formatDate(cellValue).replaceAll('-', ' ')}
          </span>
        )

      case 'amount':
        return (
          <span className={cn('text-nowrap font-medium capitalize')}>
            {formatCurrency(cellValue)}
          </span>
        )
      case 'service':
        return <span className={cn('text-nowrap capitalize')}>{cellValue}</span>

      case 'status':
        return (
          <Button
            size="sm"
            variant="light"
            onPress={() => {
              setTransactionDetails(row)
              setOpenTransactionDetailsModal(true)
            }}
            className={cn(
              'h-max min-h-max cursor-pointer rounded-lg bg-gradient-to-tr px-4 py-1 font-medium capitalize text-white',
              TRANSACTION_STATUS_COLOR_MAP[row.status],
            )}
          >
            {cellValue}
          </Button>
        )
      case 'service_provider':
        return (
          <Tooltip
            color="default"
            placement="right"
            content={row?.remarks}
            delay={500}
            closeDelay={500}
            showArrow={true}
          >
            <Chip
              color="primary"
              className={cn(
                'mx-auto self-center capitalize',
                SERVICE_PROVIDER_COLOR_MAP[row?.service_provider.toLowerCase()],
              )}
              classNames={{
                content: 'font-semibold',
              }}
              variant="flat"
            >
              {cellValue}
            </Chip>
          </Tooltip>
        )
      // case 'actions':
      //   return (
      //     <Button
      //       variant="light"
      //       className={'max-w-fit p-2'}
      //       isIconOnly
      //       onPress={() => {
      //         setTransactionDetails(row)
      //         setOpenTransactionDetailsModal(true)
      //       }}
      //     >
      //       <EyeIcon className="h-6 w-5" />
      //     </Button>
      //   )

      default:
        return cellValue
    }
  }, [])

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1)
    }
  }, [page, pages])

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1)
    }
  }, [page])

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value))
    setPage(1)
  }, [])

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value)
      setPage(1)
    } else {
      setFilterValue('')
    }
  }, [])

  const onClear = React.useCallback(() => {
    setFilterValue('')
    setPage(1)
  }, [])

  const loadingContent = React.useMemo(() => {
    return (
      <div className="mt-24 flex flex-1 items-center rounded-lg">
        <Loader
          size={100}
          classNames={{ wrapper: 'bg-slate-200/50 rounded-xl mt-8 h-full' }}
        />
      </div>
    )
  }, [isLoading])

  const emptyContent = React.useMemo(() => {
    return (
      <div className="mt-4 flex flex-1 items-center rounded-2xl bg-slate-50 text-sm font-semibold text-slate-600">
        <EmptyLogs
          className={'my-auto mt-16'}
          classNames={{ heading: 'text-sm text-slate-500 font-medium' }}
          title={'No transaction data records!'}
          subTitle={''}
        />
      </div>
    )
  }, [rows])

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-center px-2 py-2">
        {pages > 1 && (
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        )}
      </div>
    )
  }, [rows, pages])

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <Search
            // TODO => Implement Clear button on input
            isClearable={true}
            placeholder="Search by name..."
            value={filterValue}
            onClear={() => onClear()}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <div className="relative flex gap-3">
            <SingleSelectionDropdown
              name={'Type'}
              className={'min-w-[160px]'}
              classNames={{
                trigger: ' bg-primary-50',
              }}
              disallowEmptySelection={true}
              closeOnSelect={false}
              buttonVariant="flat"
              selectionMode="multiple"
              selectedKeys={serviceProtocolFilter}
              dropdownItems={SERVICE_FILTERS}
              onSelectionChange={setServiceProtocolFilter}
            />
            <SingleSelectionDropdown
              name={'Columns'}
              className={'min-w-[160px]'}
              classNames={{
                trigger: ' bg-primary-50',
              }}
              closeOnSelect={false}
              buttonVariant="flat"
              selectionMode="multiple"
              disallowEmptySelection={true}
              onSelectionChange={setVisibleColumns}
              dropdownItems={columns}
              selectedKeys={visibleColumns}
              setSelectedKeys={setSelectedKeys}
            />

            {role?.can_initiate && (
              <Button
                color="primary"
                endContent={<PlusIcon className="h-5 w-5" />}
                onPress={() => setOpenPaymentsModal(true)}
              >
                Create New
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total: {rows.length} transactions
          </span>
          <label className="flex min-w-[180px] items-center gap-2 text-nowrap text-sm font-medium text-slate-400">
            Rows per page:{' '}
            <SelectField
              className="-mb-1 h-8 min-w-max bg-transparent text-sm text-default-400 outline-none"
              onChange={onRowsPerPageChange}
              placeholder={rowsPerPage.toString()}
              options={['5', '8', '10', '20']}
              defaultValue={8}
            />
          </label>
        </div>
      </div>
    )
  }, [
    filterValue,
    serviceProtocolFilter,
    visibleColumns,
    onRowsPerPageChange,
    rows.length,
    onSearchChange,
    hasSearchFilter,
  ])

  return (
    <Table
      removeWrapper={removeWrapper}
      aria-label="Transactions table with custom cells"
      className="max-h-[780px]"
      classNames={{
        table: cn('align-top min-h-[300px] items-center justify-center', {
          'min-h-max': pages <= 1,
          'min-h-[300px]': isLoading || !rows,
        }),
        // wrapper: cn('min-h-max', { 'min-h-max': pages <= 1 }),
      }}
      sortDescriptor={sortDescriptor}
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      isStriped
      isHeaderSticky
      topContent={topContent}
      bottomContent={bottomContent}
      onSortChange={setSortDescriptor}
      onRowAction={
        onRowAction ? (key, value) => onRowAction(key, value) : undefined
      }
    >
      <TableHeader columns={headerColumns} className="fixed">
        {(column) => (
          <TableColumn
            key={column.uid}
            allowsSorting={column.sortable}
            align={
              column.uid === 'actions' || column.uid === 'status'
                ? 'center'
                : 'start'
            }
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={isLoading ? [] : sortedItems}
        isLoading={isLoading}
        loadingContent={loadingContent}
        emptyContent={emptyContent}
        align="top"
      >
        {(item) => (
          <TableRow
            key={item?.ID || item?.key || item}
            // className="hover:bg-primary-50"
            align="top"
          >
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
