import React, { Suspense } from 'react'
import { ProgressStageTracker } from '../components'
import LoadingPage from '@/app/loading'

function ApprovalPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <section role="account-approval">
        {/* 
      //
       */}
      </section>
      <section
        role="profile-content"
        className="grid w-full grid-cols-[repeat(auto-fill,minmax(580px,1fr))] place-items-center gap-4 "
      >
        {/*  */}
        <ProgressStageTracker />
      </section>
    </Suspense>
  )
}

export default ApprovalPage
