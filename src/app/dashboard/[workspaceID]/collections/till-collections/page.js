import LoadingPage from '@/app/loading'
import React, { Suspense } from 'react'
import TillPaymentCollections from './TillPaymentCollections'

export default async function TillPaymentCollectionsPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <TillPaymentCollections />
    </Suspense>
  )
}
