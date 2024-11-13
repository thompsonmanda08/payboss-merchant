import LoadingPage from '@/app/loading'
import React, { Suspense } from 'react'
import DisbursementReports from './DisbursementReports'

export default async function BulkBulkTransactionsStatsPage(props) {
  const params = await props.params;
  const { workspaceID } = params
  return (
    <Suspense fallback={<LoadingPage />}>
      <DisbursementReports workspaceID={workspaceID} />
    </Suspense>
  )
}
