import LoadingPage from '@/app/loading'
import React, { Suspense } from 'react'
import DisbursementReports from './DisbursementReports'

export default async function BulkBulkTransactionsStatsPage({ params }) {
  const { workspaceID } = params
  return (
    <Suspense fallback={<LoadingPage />}>
      <DisbursementReports workspaceID={workspaceID} />
    </Suspense>
  )
}
