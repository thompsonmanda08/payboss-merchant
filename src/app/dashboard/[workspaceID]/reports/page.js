import LoadingPage from '@/app/loading'
import React, { Suspense } from 'react'

async function ReportSummaryPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <div>ReportSummaryPage</div>
    </Suspense>
  )
}

export default ReportSummaryPage
