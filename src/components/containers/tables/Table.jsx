import React from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from '@nextui-org/react'
import { TRANSACTION_STATUS_COLOR_MAP } from '@/lib/constants'
import { cn, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import usePaymentsStore from '@/context/paymentsStore'
import Loader from '@/components/ui/Loader'
import { EyeIcon } from '@heroicons/react/24/outline'
import Search from '@/components/ui/Search'
import SelectField from '@/components/ui/SelectField'
import EmptyLogs from '@/components/base/EmptyLogs'

export default function CustomTable({
  columns,
  rows,
  selectedKeys,
  setSelectedKeys,
  limitPerRow,
  selectionBehavior,
  isLoading,
  removeWrapper,
  onRowAction = () => {},
  emptyCellValue,
  emptyDescriptionText,
  emptyTitleText,
}) {
  const { setSelectedBatch, setOpenBatchDetailsModal } = usePaymentsStore()
  const [rowsPerPage, setRowsPerPage] = React.useState(limitPerRow || 6)
  const [page, setPage] = React.useState(1)

  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: 'amount',
    direction: 'ascending',
  })

  const pages = Math.ceil(rows?.length / rowsPerPage)

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return rows?.slice(start, end)
  }, [page, rows, rowsPerPage])

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
      case 'name':
        return (
          <span className={cn('text-nowrap font-medium capitalize')}>
            {cellValue}
          </span>
        )
      case 'created_at':
        return (
          <span className={cn('text-nowrap capitalize')}>
            {formatDate(cellValue).replaceAll('-', ' ')}
          </span>
        )
      case 'status':
        return (
          <Button
            size="sm"
            variant="light"
            // onPress={() => {
            //   setSelectedBatch(row)
            //   setOpenBatchDetailsModal(true)
            // }}
            className={cn(
              'h-max min-h-max cursor-pointer rounded-lg bg-gradient-to-tr px-4 py-1 font-medium capitalize text-white',
              TRANSACTION_STATUS_COLOR_MAP[row.status],
            )}
          >
            {cellValue}
          </Button>
        )
      case 'link':
        return (
          <Button
            variant="light"
            className={'max-w-fit p-2'}
            isIconOnly
            onPress={() => {
              setSelectedBatch(row)
              setOpenBatchDetailsModal(true)
            }}
          >
            <EyeIcon className="h-6 w-5" />
          </Button>
        )

      default:
        return cellValue || emptyCellValue || 'N/A'
    }
  }, [])

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value))
    setPage(1)
  }, [])

  const loadingContent = React.useMemo(() => {
    return (
      <div className="-mt-8 flex flex-1 items-center rounded-lg">
        <Loader
          size={100}
          classNames={{ wrapper: 'bg-slate-200/50 rounded-xl h-full' }}
        />
      </div>
    )
  }, [isLoading])

  const bottomContent = React.useMemo(() => {
    return (
      pages > 1 && (
        <div className="flex w-full items-center justify-between">
          <span className="text-small text-default-400">
            Total: {rows.length} transactions
          </span>
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
          <label className="flex min-w-[180px] items-center gap-2 text-nowrap text-sm font-medium text-slate-400">
            Rows per page:{' '}
            <SelectField
              className="h-8 min-w-max bg-transparent text-sm text-default-400 outline-none"
              onChange={onRowsPerPageChange}
              placeholder={rowsPerPage.toString()}
              options={['5', '8', '10', '16', '20']}
              defaultValue={8}
            />
          </label>
        </div>
      )
    )
  }, [rows, pages])

  const emptyContent = React.useMemo(() => {
    return (
      <div className="mt-4 flex flex-1 items-center rounded-2xl bg-slate-50 text-sm font-semibold text-slate-600">
        <EmptyLogs
          className={'my-auto mt-16'}
          classNames={{ heading: 'text-sm text-slate-500 font-medium' }}
          title={emptyTitleText || 'No data to display.'}
          subTitle={
            emptyDescriptionText || 'you have no data to be displayed here.'
          }
        />
      </div>
    )
  }, [rows])

  return (
    <Table
      aria-label="Example table with custom cells"
      className="max-h-[1080px]"
      removeWrapper={removeWrapper}
      classNames={{
        table: cn('align-top items-start justify-start', {
          'min-h-[400px]': isLoading || !rows,
        }),
        wrapper: cn('min-h-[200px]', { 'min-h-max': pages <= 1 }),
      }}
      // classNames={}
      // showSelectionCheckboxes
      // selectionMode="multiple"
      selectionMode="single"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      selectionBehavior={selectionBehavior}
      isStriped
      isHeaderSticky
      onRowAction={(key) => onRowAction(key)}
      bottomContent={bottomContent}
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={columns} className="fixed">
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'status' ? 'center' : 'start'}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={items}
        isLoading={isLoading}
        loadingContent={loadingContent}
        emptyContent={emptyContent}
        align="top"
      >
        {(item) => (
          <TableRow key={item?.ID || item?.key || item} align="top">
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
