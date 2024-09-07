import LoadingPage from '@/app/loading'
import React, { Suspense } from 'react'
import APIIntegration from '@/components/containers/collections/api-intergration/API'

export default async function APIIntergrationCollectionsPage({ params }) {
  const { workspaceID } = params

  return (
    <Suspense fallback={<LoadingPage />}>
      <APIIntegration workspaceID={workspaceID} />
    </Suspense>
  )
}
