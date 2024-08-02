import WorkspaceSettings from '@/components/containers/workspace/WorkspacesSettings'
import Spinner from '@/components/ui/Spinner'
import React, { Suspense } from 'react'

function WorkSpaceIDPage({ params }) {
  const WorkSpaceID = params.ID

  // TODO: fetch workspace data using WorkSpaceID from API
  //ONLY RENDER WORKSPACE DATA WITH VALID ID
  console.log(WorkSpaceID)
  return (
    <Suspense fallback={<Spinner size={64} />}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div>
          <h2 className="heading-3 !font-bold tracking-tight text-gray-900 ">
            Workspace Settings
          </h2>
          <p className=" text-sm text-slate-600">
            Workspaces provide a structured way to group and manage services,
            users, and transactions effectively.
          </p>
        </div>

        <WorkspaceSettings WorkSpaceID={WorkSpaceID} />
      </div>
    </Suspense>
  )
}

export default WorkSpaceIDPage
