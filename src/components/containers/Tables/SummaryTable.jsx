import Pagination from '@/components/base/Pagination'
import React, { useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

function SummaryTable({ columns, data, actions }) {
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 1
  const totalPages = Math.ceil(data.length / rowsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const renderColumns = columns.map(({ header }) => {
    return (
      <th
        key={header}
        className="border-light whitespace-no-wrap overflow-hidden truncate border-b px-4 py-2 text-left text-sm font-medium text-gray-900"
      >
        {header.toUpperCase()}
      </th>
    )
  })

  if (actions) {
    renderColumns.push(
      <th
        key="actions"
        className="border-light border-b px-4 py-2 text-left text-sm font-medium text-gray-900"
      >
        ACTIONS
      </th>
    )
  }

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  const renderRows = paginatedData.map((row, rowIndex) => {
    const tableRow = columns.map(({ accessor }) => {
      return (
        <td
          key={uuidv4()}
          className={` ${accessor == 'reason' ? 'text-red-500' : 'text-gray-500'} border-light border-b px-4 py-2 text-left text-sm`}
        >
          {row[accessor]}
        </td>
      )
    })

    if (actions) {
      tableRow.push(
        <td
          key={uuidv4()}
          className="border-light border-b px-4 py-2 text-left text-sm text-gray-500 "
        >
          {actions(row)}
        </td>,
      )
    }

    return (
      <tr
        key={rowIndex}
        className="whitespace-no-wrap overflow-hidden truncate"
      >
        {tableRow}
      </tr>
    )
  })

  return useMemo(
    () => (
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>{renderColumns}</tr>
          </thead>
          <tbody>{renderRows}</tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    ),
    [columns, data, actions, currentPage, totalPages],
  )
}

export default SummaryTable
