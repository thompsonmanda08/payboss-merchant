'use client'
import LoadingPage from '@/app/loading'
import { Card, FileDropZone, Tabs } from '@/components/base'
import { BatchPayment, PaymentsAction } from '@/components/containers'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import usePaymentsStore from '@/context/paymentsStore'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React, { Suspense } from 'react'

const PAYMENT_TYPES = [
  {
    name: 'Single Payments',
    current: 0,
  },
  {
    name: 'Bulk Payments',
    current: 1,
  },
]

function getStatus() {
  // random number between 0 and COMPLETION_STATUS.length
  const index = Math.random() * COMPLETION_STATUS.length
  // get random status from array
  return COMPLETION_STATUS[Math.floor(index)]
}

const COMPLETION_STATUS = ['Scheduled', 'Pending', 'In Progress', 'Completed']

const SAMPLE_BATCHES = [
  {
    batchName: 'Payment For airtime',
    type: 'Airtime Disbursement',
    createdAt: Date.now(),
    quantity: 1200,
    totalAmount: '12,500',
    status: getStatus(),
  },
  {
    batchName: 'Data Bundle purchase for field workers',
    type: 'Data Purchase',
    createdAt: Date.now(),
    quantity: 1200,
    totalAmount: '144,500',
    status: getStatus(),
  },
  {
    batchName: 'Casual workers wages',
    type: 'Direct Transfer',
    createdAt: Date.now(),
    quantity: 1200,
    totalAmount: '3,500',
    status: getStatus(),
  },
  {
    batchName: 'Payment For airtime',
    type: 'Airtime Disbursement',
    createdAt: Date.now(),
    quantity: 1200,
    totalAmount: '12,500',
    status: getStatus(),
  },
  {
    batchName: 'Data Bundle purchase for field workers',
    type: 'Data Purchase',
    createdAt: Date.now(),
    quantity: 1200,
    totalAmount: '144,500',
    status: getStatus(),
  },
  {
    batchName: 'Casual workers wages',
    type: 'Direct Transfer',
    createdAt: Date.now(),
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
      {openPaymentsModal && <PaymentsAction />}

      <div className="flex flex-col">
        <Card className={''}>
          <h1>DISBURSEMENTS ACTION LIST</h1>
        </Card>
      </div>
    </Suspense>
  )
}
