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
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import usePaymentsStore from '@/context/paymentsStore'
import Loader from '@/components/ui/Loader'
import { EyeIcon } from '@heroicons/react/24/outline'

export default function CustomTable({
  columns,
  rows,
  selectedKeys,
  setSelectedKeys,
  rowsPerPage = 8,
  isLoading,
}) {
  const { setSelectedBatch, setOpenBatchDetailsModal } = usePaymentsStore()

  const [page, setPage] = React.useState(1)

  const pages = Math.ceil(rows.length / rowsPerPage)

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage
    return rows.slice(start, end)
  }, [page, rows])

  const renderCell = React.useCallback((row, columnKey) => {
    const cellValue = row[columnKey]
    switch (columnKey) {
      case 'status':
        return (
          <Button
            size="sm"
            variant="light"
            onPress={() => {
              setSelectedBatch(row)
              setOpenBatchDetailsModal(true)
            }}
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
        return cellValue
    }
  }, [])

  return (
    <Table
      aria-label="Example table with custom cells"
      className="max-h-[580px]"
      classNames={{
        table: cn('align-top items-start justify-start', {
          'min-h-[500px]': isLoading || !rows,
        }),
        wrapper: cn('min-h-[500px]', { 'min-h-max': pages <= 1 }),
      }}
      // classNames={}
      // showSelectionCheckboxes
      // selectionMode="multiple"
      selectionMode="single"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      isStriped
      isHeaderSticky
      bottomContent={
        pages > 1 && (
          <div className="flex w-full justify-center">
            {
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            }
          </div>
        )
      }
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
        loadingContent={
          <Loader
            color={'#ffffff'}
            classNames={{ wrapper: 'bg-slate-900/20 h-full rounded-xl' }}
          />
        }
        emptyContent={'No Data to display.'}
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
