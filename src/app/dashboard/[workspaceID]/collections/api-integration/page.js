import LoadingPage from '@/app/loading'
import React, { Suspense } from 'react'
import APIIntegration from '@/app/dashboard/[workspaceID]/collections/api-integration/API'

export default async function APIIntergrationCollectionsPage({ params }) {
  const { workspaceID } = params

  return (
    <Suspense fallback={<LoadingPage />}>
      <APIIntegration workspaceID={workspaceID} />
    </Suspense>
  )
}
