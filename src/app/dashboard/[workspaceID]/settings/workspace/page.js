import LoadingPage from '@/app/loading'
import WorkspaceSettings from '@/components/containers/workspace/WorkspaceSettings'

import React, { Suspense } from 'react'

function WorkspaceSettingsPage({ params }) {
  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="mx-auto flex w-full  flex-col gap-8 px-8 md:px-10 ">
        <WorkspaceSettings workspaceID={params?.workspaceID} />
      </div>
    </Suspense>
  )
}

export default WorkspaceSettingsPage
