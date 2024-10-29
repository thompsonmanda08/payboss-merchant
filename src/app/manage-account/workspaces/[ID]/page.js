import LoadingPage from '@/app/loading'
import React, { Suspense } from 'react'
import WorkspaceInfo from './WorkspaceInfo'

async function WorkSpaceIDPage(props) {
  const params = await props.params;
  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <WorkspaceInfo workspaceID={params.ID} />
      </div>
    </Suspense>
  )
}

export default WorkSpaceIDPage
