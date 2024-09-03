import LoadingPage from '@/app/loading'
import React, { Suspense } from 'react'
import APIIntegration from './API'

export default async function TransactionsPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <APIIntegration />
    </Suspense>
  )
}
