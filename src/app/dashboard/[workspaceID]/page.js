import React, { Suspense } from 'react'
import LoadingPage from '../../loading'
import InfoBanner from '@/components/base/InfoBanner'
import DashboardAnalytics from '@/components/containers/analytics/DashboardAnalytics'
import {
  getUserDetails,
  getWorkspaceSession,
} from '@/app/_actions/config-actions'

async function DashboardHome({ params }) {
  const workspaceSession = (await getWorkspaceSession()) || []
  const session = await getUserDetails()
  const { workspaceID } = params
  const workspacePermissions = workspaceSession?.workspacePermissions

  if (!workspacePermissions) {
    return <LoadingPage />
  }

  return (
    <Suspense fallback={<LoadingPage />}>
      {session?.user?.isCompleteKYC && (
        <InfoBanner
          buttonText="Submit Documents"
          infoText="Just one more step, please submit your business documents to aid us with the approval process"
          href={'manage-account/account-verification'}
          user={user}
        />
      )}
      <DashboardAnalytics
        userRole={workspacePermissions}
        workspaceID={workspaceID}
        workspaceType={workspaceSession?.workspaceType}
      />
    </Suspense>
  )
}

export default DashboardHome
