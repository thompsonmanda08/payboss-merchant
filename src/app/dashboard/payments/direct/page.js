'use client'
import LoadingPage from '@/app/loading'
import { Card, Tabs } from '@/components/base'
import { PaymentsAction } from '@/components/containers'
import SelectPaymentType from '@/components/containers/Payments/SelectPaymentType'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { cn, formatDate } from '@/lib/utils'
import usePaymentsStore from '@/context/paymentsStore'
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import React, { Suspense } from 'react'

const PAYMENT_TYPES = [
  {
    name: 'Bulk Payments',
    current: 0,
  },
  {
    name: 'Single Payments',
    current: 1,
  },
]

const COMPLETION_STATUS = ['Scheduled', 'Pending', 'In Progress', 'Completed']

function getStatus() {
  // random number between 0 and COMPLETION_STATUS.length
  const index = Math.random() * COMPLETION_STATUS.length
  // get random status from array
  return COMPLETION_STATUS[Math.floor(index)]
}

const SAMPLE_BATCHES = [
  {
    batchName: 'Payment For airtime',
    type: 'Airtime Disbursement',
    createdAt: formatDate(Date()),
    quantity: 1200,
    totalAmount: '12,500',
    status: getStatus(),
  },
  {
    batchName: 'Data Bundle purchase for field workers',
    type: 'Data Purchase',
    createdAt: formatDate(Date()),
    quantity: 1200,
    totalAmount: '144,500',
    status: getStatus(),
  },
  {
    batchName: 'Casual workers wages',
    type: 'Direct Transfer',
    createdAt: formatDate(Date()),
    quantity: 1200,
    totalAmount: '3,500',
    status: getStatus(),
  },
  {
    batchName: 'Payment For airtime',
    type: 'Airtime Disbursement',
    createdAt: formatDate(Date()),
    quantity: 1200,
    totalAmount: '12,500',
    status: getStatus(),
  },
  {
    batchName: 'Data Bundle purchase for field workers',
    type: 'Data Purchase',
    createdAt: formatDate(Date()),
    quantity: 1200,
    totalAmount: '144,500',
    status: getStatus(),
  },
  {
    batchName: 'Casual workers wages',
    type: 'Direct Transfer',
    createdAt: formatDate(Date()),
    quantity: 1200,
    totalAmount: '3,500',
    status: getStatus(),
  },
]

function Status({ status, className }) {
  return (
    <span
      className={cn(
        'mx-auto cursor-pointer select-none rounded-md p-1 px-2 text-xs font-medium text-white',
        className,
        {
          'bg-gradient-to-tr from-gray-400 to-gray-600':
            COMPLETION_STATUS[0] == status,
          'bg-gradient-to-br from-orange-400 to-orange-600':
            COMPLETION_STATUS[1] == status,
          'bg-gradient-to-tr from-primary to-blue-500':
            COMPLETION_STATUS[2] == status,
          'bg-gradient-to-tr from-green-500 to-green-700':
            COMPLETION_STATUS[3] == status,
        },
      )}
    >
      {status}
    </span>
  )
}

export default function Payments() {
  const { openPaymentsModal, setOpenPaymentsModal } = usePaymentsStore(
    (state) => state,
  )
  return (
    <Suspense fallback={<LoadingPage />}>
      {/* MODAL */}
      {openPaymentsModal && <SelectPaymentType />}

      <div className="flex flex-col">
        <Card className={''}>
          <div className="flex justify-between">
            <div>
              <h1 className="text-xl font-bold">Direct Payments</h1>
              <p className="text-gary-500 text-xs md:text-sm">
                Make payments to your clients or multiple recipients
                simultaneously with direct transfers
              </p>
            </div>
            <Button
              onClick={() => {
                setOpenPaymentsModal(true)
              }}
            >
              Create Payment
            </Button>
          </div>
          <div>
            <div className="flex w-full items-center justify-between">
              <Tabs tabs={PAYMENT_TYPES} currentTab={0} />
            </div>

            <div className=" mt-4 rounded-lg border">
              <div className="relative m-2">
                <MagnifyingGlassIcon className="absolute left-2 top-[25%] h-5 w-5 text-gray-500" />
                <Input className={'max-w-sm pl-9'} placeholder={'Search...'} />
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
                              <Status status={batch.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Suspense>
  )
}
