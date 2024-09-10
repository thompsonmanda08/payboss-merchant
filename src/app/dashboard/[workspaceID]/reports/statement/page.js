import LoadingPage from '@/app/loading'
import React, { Suspense } from 'react'
import Statement from './Statement'

export default async function BulkBulkTransactionsStatsPage({ params }) {
  const { workspaceID } = params
  return (
    <Suspense fallback={<LoadingPage />}>
      <Statement workspaceID={workspaceID} />
    </Suspense>
  )
}
