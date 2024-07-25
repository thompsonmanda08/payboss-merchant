import LoadingPage from '@/app/loading'
import ProgressStageTracker from '@/components/base/ProgressStageTracker'
import React, { Suspense } from 'react'

function ApprovalPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <section
        role="account-approval"
        className="flex w-full max-w-[1024px] flex-col"
      >
        {/* 
      //
       */}
        <ProgressStageTracker />
      </section>
      <section
        role="profile-content"
        className="grid w-full grid-cols-[repeat(auto-fill,minmax(580px,1fr))] place-items-center gap-4 "
      >
        {/*  */}
      </section>
    </Suspense>
  )
}

export default ApprovalPage
