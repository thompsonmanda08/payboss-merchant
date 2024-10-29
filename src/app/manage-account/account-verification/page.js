import LoadingPage from '@/app/loading'
import AccountVerification from '@/components/containers/account-verification/AccountVerification'
import React, { Suspense } from 'react'

function ApprovalPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <AccountVerification />
    </Suspense>
  )
}

export default ApprovalPage
