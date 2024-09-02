import React, { Suspense } from 'react'
import { getUserDetails } from '@/app/_actions/config-actions'
import LoadingPage from '@/app/loading'
import NotFound from '@/app/not-found'
import InitiatorsLog from '@/components/containers/disbursements/InitiatorsLog'
import BulkPaymentAction from '../../BulkPaymentAction'
import SinglePaymentAction from '../../SinglePaymentAction'

async function CreatePayment({ params }) {
  const { type } = params // BULK OR SINGLE

  const session = await getUserDetails()
  const user = session?.user

  if (type === 'bulk') {
    return (
      <Suspense fallback={<LoadingPage />}>
        <div className="flex w-full flex-col gap-5 md:flex-row">
          <BulkPaymentAction />
          {session && <InitiatorsLog user={user} />}
        </div>
      </Suspense>
    )
  }

  if (type === 'single') {
    // return <div>CreatePayment: Single</div>
    return (
      <Suspense fallback={<LoadingPage />}>
        <div className="flex w-full flex-col gap-5 md:flex-row">
          <SinglePaymentAction />
          {session && <InitiatorsLog user={user} />}
        </div>
      </Suspense>
    )
  }
  return <NotFound />
}

export default CreatePayment
