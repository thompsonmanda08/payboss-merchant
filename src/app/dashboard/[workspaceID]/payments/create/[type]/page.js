import React, { Suspense } from 'react'
import { getUserDetails } from '@/app/_actions/config-actions'
import LoadingPage from '@/app/loading'
import NotFound from '@/app/not-found'
import InitiatorsLog from '@/components/containers/disbursements/InitiatorsLog'
import BulkPaymentAction from './BulkPaymentAction'
import SinglePaymentAction from './SinglePaymentAction'

async function CreatePayment({ params }) {
  const { type, workspaceID } = params // BULK OR SINGLE

  const session = await getUserDetails()

  if (type === 'bulk') {
    return (
      <Suspense fallback={<LoadingPage />}>
        <div className="flex w-full flex-col gap-5 md:flex-row">
          <BulkPaymentAction workspaceID={workspaceID} />
        </div>
      </Suspense>
    )
  }

  // if (type === 'single') {
  //   return (
  //     <Suspense fallback={<LoadingPage />}>
  //       <div className="flex w-full flex-col gap-5 md:flex-row">
  //         <SinglePaymentAction workspaceID={workspaceID} />
  //       </div>
  //     </Suspense>
  //   )
  // }
  return <NotFound />
}

export default CreatePayment
