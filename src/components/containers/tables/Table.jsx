import React from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  LinkIcon,
} from '@nextui-org/react'
import { TRANSACTION_STATUS_COLOR_MAP } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import usePaymentsStore from '@/context/paymentsStore'

export default function CustomTable({
  columns,
  rows,
  selectedKeys,
  setSelectedKeys,
}) {
  const { setSelectedBatch, setOpenBatchDetailsModal } = usePaymentsStore()
  const rowsPerPage = 8
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
          <span
            // onClick={() => {
            //   setSelectedBatch(row)
            //   handleRowPress()
            // }}
            className={cn(
              'my-2 ml-auto cursor-pointer rounded-lg bg-gradient-to-tr px-4 py-1 font-medium capitalize text-white',
              TRANSACTION_STATUS_COLOR_MAP[row.status],
            )}
          >
            {cellValue}
          </span>
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
            <LinkIcon />
          </Button>
        )

      default:
        return cellValue
    }
  }, [])

  // console.log(selectedKeys?.anchorKey)

  return (
    <Table
      aria-label="Example table with custom cells"
      className="max-h-[580px]"
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
      classNames={{
        wrapper: cn('min-h-[500px]', { 'min-h-max': pages <= 1 }),
      }}
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
      <TableBody items={items}>
        {(item) => (
          <TableRow
            key={item?.ID || item?.key || item}
            // className="hover:bg-primary-50"
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
