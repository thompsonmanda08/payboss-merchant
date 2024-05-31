'use client'
import { EmptyState } from '@/components/base'
import { formatCurrency } from '@/lib/utils'
import React, { useState } from 'react'

export default function TransactionsTable({
  data,
  limit = 5,
  reloadTableItems,
}) {
  const [currentPage, setCurrentPage] = useState(1)

  const startIndex = (currentPage - 1) * limit
  const endIndex = startIndex + limit
  const transactions = data?.slice(startIndex, endIndex)

  const totalPages = Math.ceil(data?.length / limit)

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
  }

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  return (
    <div className="min-w-1/2 w-full py-8">
      <div className="overflow-hidden rounded-xl border border-primary/5 bg-background">
        <>
          {transactions && transactions?.length > 0 ? (
            <table className="min-w-full">
              <thead className="bg-card">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold capitalize text-neutral-900">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold capitalize text-neutral-900">
                    Details
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold capitalize text-neutral-900">
                    Amount (ZMW)
                  </th>
                </tr>
              </thead>

              <tbody className="text-gray-700">
                {transactions &&
                  transactions.map((transaction, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-background' : 'bg-card'}
                    >
                      <td className="px-2 py-3 pl-4 text-left text-xs capitalize text-neutral-700">
                        {formatDate(transaction?.transactionDate)}
                      </td>
                      <td className="px-4 py-3 text-left text-xs font-medium  capitalize text-neutral-800 lg:text-sm">
                        {transaction?.Details || transaction?.narration}
                      </td>
                      <td
                        className={`px-4 py-3 pr-20  text-right text-sm font-medium leading-6 text-primary`}
                      >
                        {formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              handleReload={reloadTableItems}
              title={'No Transactions'}
              message={'You have no transactions yet'}
            >
              <></>
            </EmptyState>
          )}
        </>
      </div>

      {transactions && transactions?.length > 0 && (
        <div className="mt-6 flex flex-1 items-center justify-between">
          <Button
            onClick={handlePrevPage}
            text="Previous"
            disabled={currentPage === 1}
            className="text-primary-900 min-w-24 rounded-md border border-primary/30  bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50 focus-visible:outline-offset-0"
          />

          <div className="flex h-full items-center justify-center text-sm">
            <p className="pl-1 pt-2 text-sm text-gray-700">
              Showing Page{' '}
              <span className="font-semibold">
                {typeof currentPage != 'number' ? '1' : currentPage}
              </span>{' '}
              of <span className="font-medium">{totalPages || '1'}</span>
            </p>
          </div>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            text="Next"
            className="text-primary-900 min-w-24 rounded-md border border-primary/30  bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50 focus-visible:outline-offset-0"
          />
        </div>
      )}
    </div>
  )
}
