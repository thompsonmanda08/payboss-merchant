import LoadingPage from '@/app/loading'
import React, { Suspense } from 'react'

function Disbursements() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <h1 className="text-2xl font-bold">Disbursements</h1>
    </Suspense>
  )
}

export default Disbursements
