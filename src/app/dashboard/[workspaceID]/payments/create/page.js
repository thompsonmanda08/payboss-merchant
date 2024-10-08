import React, { Suspense } from 'react'
import LoadingPage from '@/app/loading'
import NotFound from '@/app/not-found'
import BulkPaymentAction from './BulkPaymentAction'

async function CreatePayment({ params }) {
  const { workspaceID } = params

  return (
    <Suspense fallback={<LoadingPage />}>
      <BulkPaymentAction workspaceID={workspaceID} />
    </Suspense>
  )
}

export default CreatePayment
