import React, { Suspense } from 'react'
import LoadingPage from '../../loading'
import InfoBanner from '@/components/base/InfoBanner'
import DashboardAnalytics from '@/components/containers/analytics/DashboardAnalytics'
import { getWorkspaceSession } from '@/app/_actions/config-actions'

async function DashboardHome({ params }) {
  const workspaceSession = (await getWorkspaceSession()) || []
  const { workspaceID } = params
  const workspacePermissions = workspaceSession?.workspacePermissions

  if (!workspacePermissions) {
    return <LoadingPage />
  }

  return (
    <Suspense fallback={<LoadingPage />}>
      <InfoBanner
        buttonText="Submit Documents"
        infoText="Just one more step, please submit your business documents to aid us with the approval process"
        href={'manage-account/account-verification'}
      />
      <DashboardAnalytics
        userRole={workspacePermissions}
        workspaceID={workspaceID}
        workspaceType={workspaceSession?.workspaceType}
      />
    </Suspense>
  )
}

export default DashboardHome
