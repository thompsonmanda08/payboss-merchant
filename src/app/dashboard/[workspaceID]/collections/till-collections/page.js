import LoadingPage from '@/app/loading'
import React, { Suspense } from 'react'
import TillPaymentCollections from './TillPaymentCollections'

export default async function TillPaymentCollectionsPage(props) {
  const params = await props.params;
  return (
    <Suspense fallback={<LoadingPage />}>
      <TillPaymentCollections workspaceID={params.workspaceID} />
    </Suspense>
  )
}
