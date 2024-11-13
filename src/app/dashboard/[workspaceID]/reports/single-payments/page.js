import LoadingPage from '@/app/loading'
import React, { Suspense } from 'react'
// import SingleTransactionsStats from './SingleTransactionsStats'

export default async function SingleTransactionsStatsPage(props) {
  const params = await props.params;
  const { workspaceID } = params
  return (
    <Suspense fallback={<LoadingPage />}>
      {/* <SingleTransactionsStats workspaceID={workspaceID} /> */}
    </Suspense>
  )
}
