import LoadingPage from '@/app/loading'
import NotFound from '@/app/not-found'
import { Balance } from '@/components/base'
import BulkPaymentAction from '@/components/containers/Payments'
import React, { Suspense } from 'react'

function CreatePayment({ params }) {
  const { type } = params // BULK OR SINGLE

  if (type === 'bulk') {
    return (
      <Suspense fallback={<LoadingPage />}>
        <div className="flex w-full gap-5">
          <BulkPaymentAction />
          <div className="flex flex-col gap-4">
            <Balance title={'PayBoss Wallet'} amount={'K10, 500'} />
            <Balance title={'Bank'} amount={'K10, 500'} />
          </div>
        </div>
      </Suspense>
    )
  }

  if (type === 'single') {
    return <div>CreatePayment: Single</div>
  }
  return <NotFound />
}

export default CreatePayment
