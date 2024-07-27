'use client'
import React, { Suspense } from 'react'
import LoadingPage from '@/app/loading'
import { Card, Tabs, TransactionStatusTag } from '@/components/base'
import Search from '@/components/ui/Search'
import { Button } from '@/components/ui/Button'
import usePaymentsStore from '@/context/paymentsStore'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import { SAMPLE_BATCHES } from '../../data/sampleData'
import { PAYMENT_SERVICE_TYPES } from '@/lib/constants'
import { SelectPaymentType } from '@/components/containers'

export default function VoucherPaymentsPage() {
  const { openPaymentsModal, setOpenPaymentsModal } = usePaymentsStore(
    (state) => state,
  )

  const { activeTab, currentTabIndex, navigateTo } = useCustomTabsHook([
    <VoucherPaymentsTable />,
  ])

  return (
    <Suspense fallback={<LoadingPage />}>
      {/* MODAL */}
      {openPaymentsModal && <SelectPaymentType service={'voucher'} />}

      <div className="flex flex-col">
        <Card className={''}>
          <div className="flex justify-between">
            <div>
              <h1 className="text-xl font-bold">Voucher Payments</h1>
              <p className="text-gary-500 text-xs md:text-sm">
                Make payments to your clients or multiple recipients
                simultaneously with redeemable vouchers
              </p>
            </div>
            <Button
              onClick={() => {
                setOpenPaymentsModal(true)
              }}
            >
              Create Voucher
            </Button>
          </div>
          <Tabs
            tabs={PAYMENT_SERVICE_TYPES}
            currentTab={currentTabIndex}
            navigateTo={navigateTo}
          />

          {activeTab}
        </Card>
      </div>
    </Suspense>
  )
}

function VoucherPaymentsTable() {
  return (
    <div className=" mt-4 rounded-lg border">
      <div className="relative m-2">
        <Search />
      </div>

      <div className="mt-4 flow-root border-t">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table
              suppressHydrationWarning
              className="w-full min-w-full divide-y divide-gray-300"
            >
              <thead>
                <tr className="flex h-full w-full justify-between divide-x divide-gray-200">
                  <th className="min-w-[250px] items-start px-2 py-2 text-left text-xs">
                    Batch Name
                  </th>
                  <th className="min-w-[150px] items-start px-2 py-2 text-left text-xs">
                    Type
                  </th>
                  <th className="min-w-[100px] items-start  px-2 py-2 text-left text-xs">
                    Date Created
                  </th>
                  <th className="min-w-[100px] items-start px-2 py-2 text-left text-xs">
                    Quantity
                  </th>
                  <th className="min-w-[100px] items-start px-2 py-2 text-left text-xs">
                    Total Amount
                  </th>
                  <th className="min-w-[100px] items-start px-2 py-2 text-left text-xs">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 ">
                {SAMPLE_BATCHES.map((batch, index) => (
                  <tr
                    suppressHydrationWarning={true}
                    key={index}
                    className="flex h-full w-full justify-between divide-x divide-gray-200"
                  >
                    <td className=" min-w-[250px] items-start whitespace-nowrap px-2 py-3 text-left text-xs font-medium">
                      {batch.batchName}
                    </td>
                    <td className="min-w-[150px] items-start whitespace-nowrap px-2 py-3 text-left text-xs">
                      {batch.type}
                    </td>
                    <td className=" min-w-[100px] items-start whitespace-nowrap px-2 py-3 text-left text-xs">
                      {batch.createdAt}
                    </td>
                    <td className="min-w-[100px] items-start whitespace-nowrap px-2 py-3 text-left text-xs">
                      {batch.quantity}
                    </td>
                    <td className="min-w-[100px] items-start whitespace-nowrap px-2 py-3 text-left text-xs">
                      {batch.totalAmount}
                    </td>
                    <td className="flex min-w-[100px] items-start whitespace-nowrap px-2 py-3 text-left text-xs">
                      <TransactionStatusTag status={batch.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
