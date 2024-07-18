'use client'
import LoadingPage from '@/app/loading'
import { Card } from '@/components/base'
import { PaymentsAction } from '@/components/containers'
import usePaymentsStore from '@/context/paymentsStore'
import React, { Suspense } from 'react'

export default function Payments() {
  const { openPaymentsModal, setOpenPaymentsModal } = usePaymentsStore(
    (state) => state,
  )
  return (
    <Suspense fallback={<LoadingPage />}>
      {/* MODAL */}
      {openPaymentsModal && <PaymentsAction />}

      <div className="flex flex-col gap-5 md:flex-row">
        <Card
          href={'/dashboard/payments/direct'}
          className={'aspect-square w-[280px]'}
        >
          <h1>DIRECT PAYMENTS</h1>
        </Card>
        <Card
          href={'/dashboard/payments/vouchers'}
          className={'aspect-square w-[280px] cursor-pointer'}
        >
          <h1>VOUCHER PAYMENTS</h1>
        </Card>
      </div>
    </Suspense>
  )
}
