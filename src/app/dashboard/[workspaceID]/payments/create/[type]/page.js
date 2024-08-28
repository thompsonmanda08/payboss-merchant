import { getUserDetails } from '@/app/_actions/config-actions'
import LoadingPage from '@/app/loading'
import NotFound from '@/app/not-found'
import { BulkPaymentAction } from '@/components/containers'
import InitiatorsLog from '@/components/containers/disbursements/InitiatorsLog'

import React, { Suspense } from 'react'

async function CreatePayment({ params }) {
  const { type } = params // BULK OR SINGLE

  const session = await getUserDetails()
  const user = session?.user

  console.log(session)

  if (type === 'bulk') {
    return (
      <Suspense fallback={<LoadingPage />}>
        <div className="flex w-full gap-5">
          <BulkPaymentAction />
          {session && <InitiatorsLog user={user} />}
        </div>
      </Suspense>
    )
  }

  if (type === 'single') {
    // return <div>CreatePayment: Single</div>
    return <NotFound />
  }
  return <NotFound />
}

export default CreatePayment
