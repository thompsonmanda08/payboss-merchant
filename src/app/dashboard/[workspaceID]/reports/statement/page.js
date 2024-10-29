import LoadingPage from '@/app/loading'
import React, { Suspense } from 'react'
import Statement from './Statement'

export default async function BulkBulkTransactionsStatsPage(props) {
  const params = await props.params;
  const { workspaceID } = params
  return (
    <Suspense fallback={<LoadingPage />}>
      <Statement workspaceID={workspaceID} />
    </Suspense>
  )
}
