// import { TransactionsTable } from '@/components/containers'
import React, { Suspense } from 'react'
import LoadingPage from '../../loading'
import InfoBanner from '@/components/base/InfoBanner'
import DashboardAnalytics from '@/components/containers/analytics/DashboardAnalytics'
import { getAuthSession, getUserDetails } from '@/app/_actions/config-actions'
import { redirect } from 'next/navigation'

async function DashboardHome({ params }) {
  const session = await getUserDetails()
  const auth = await getAuthSession()
  const { workspaceID } = params

  if (!session && !auth) {
    redirect('/login')
  }

  return (
    <Suspense fallback={<LoadingPage />}>
      <InfoBanner
        session={session}
        buttonText="Submit Documents"
        infoText="Just one more step, please submit your business documents to aid us with the approval process"
        href={'manage-account/account-verification'}
      />
      <DashboardAnalytics workspaceID={workspaceID} />
    </Suspense>
  )
}

export default DashboardHome
