import LoadingPage from '@/app/loading'
import React, { Suspense } from 'react'
import APITransactionsStats from './APITransactionsStats'

export default async function SingleTransactionsStatsPage({ params }) {
  const { workspaceID } = params
  return (
    <Suspense fallback={<LoadingPage />}>
      <APITransactionsStats workspaceID={workspaceID} />
    </Suspense>
  )
}
