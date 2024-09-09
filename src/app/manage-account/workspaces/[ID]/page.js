import LoadingPage from '@/app/loading'
import WorkspaceSettings from '@/components/containers/workspace/WorkspaceSettings'
import React, { Suspense } from 'react'

async function WorkSpaceIDPage({ params }) {
  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <WorkspaceSettings workspaceID={params.ID} />
      </div>
    </Suspense>
  )
}

export default WorkSpaceIDPage
