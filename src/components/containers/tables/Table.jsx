import React from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
} from '@nextui-org/react'
import { TRANSACTION_STATUS_COLOR_MAP } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function CustomTable({ columns, rows }) {
  const rowsPerPage = 10
  const [page, setPage] = React.useState(1)
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(['']))
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
            className={cn(
              'my-2 cursor-pointer rounded-lg bg-gradient-to-tr px-4 py-1 font-medium capitalize text-white',
              TRANSACTION_STATUS_COLOR_MAP[row.status],
            )}
          >
            {cellValue}
          </span>
        )

      default:
        return cellValue
    }
  }, [])

  return (
    <Table
      aria-label="Example table with custom cells"
      className="max-h-[500px]"
      // classNames={}
      // showSelectionCheckboxes
      selectionMode="multiple"
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
