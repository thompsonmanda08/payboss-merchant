import LoadingPage from '@/app/loading'
import React, { Suspense } from 'react'
import TillPaymentCollections from './TillPaymentCollections'

export default async function TillPaymentCollectionsPage({ params }) {
  return (
    <Suspense fallback={<LoadingPage />}>
      <TillPaymentCollections workspaceID={params.workspaceID} />
    </Suspense>
  )
}
