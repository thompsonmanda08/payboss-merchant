import LoadingPage from '@/app/loading'
import React, { Suspense } from 'react'
import CollectionsReports from './CollectionsReports'

export default async function SingleTransactionsStatsPage(props) {
  const params = await props.params;
  const { workspaceID } = params
  return (
    <Suspense fallback={<LoadingPage />}>
      <CollectionsReports workspaceID={workspaceID} />
    </Suspense>
  )
}
