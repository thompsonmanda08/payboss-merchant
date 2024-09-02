// import { TransactionsTable } from '@/components/containers'
import React, { Suspense } from 'react'
import LoadingPage from '../../loading'
import InfoBanner from '@/components/base/InfoBanner'
import DashboardAnalytics from '@/components/containers/analytics/DashboardAnalytics'

function DashboardHome() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <InfoBanner
        buttonText="Verify Account"
        infoText="Just one more step, please submit your business documents to aid us with the approval process"
        href={'manage-account/account-verification'}
      />
      <DashboardAnalytics />
    </Suspense>
  )
}

export default DashboardHome
