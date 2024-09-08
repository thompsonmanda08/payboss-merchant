import LoadingPage from '@/app/loading'
import React, { Suspense } from 'react'
import BulkTransactionsStats from './BulkTransactionsStats'

export default async function BulkBulkTransactionsStatsPage({ params }) {
  const { workspaceID } = params
  return (
    <Suspense fallback={<LoadingPage />}>
      <BulkTransactionsStats workspaceID={workspaceID} />
    </Suspense>
  )
}
