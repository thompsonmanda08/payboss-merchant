import LoadingPage from '@/app/loading'
import WorkspaceSettings from '@/components/containers/workspace/WorkspacesSettings'
import Spinner from '@/components/ui/Spinner'
import React, { Suspense } from 'react'

function WorkSpaceIDPage({ params }) {
  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <WorkspaceSettings WorkSpaceID={params.ID} />
      </div>
    </Suspense>
  )
}

export default WorkSpaceIDPage
