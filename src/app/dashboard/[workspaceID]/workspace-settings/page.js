import LoadingPage from '@/app/loading'
import React, { Suspense } from 'react'
import { getUserDetails } from '@/app/_actions/config-actions'
import WorkspaceSettings from '@/components/containers/workspace/WorkspaceSettings'

export default async function ManageWorkspacePage(props) {
  const params = await props.params;
  const { workspaceID } = params
  return (
    <Suspense fallback={<LoadingPage />}>
      <WorkspaceSettings workspaceID={workspaceID} />
    </Suspense>
  )
}
