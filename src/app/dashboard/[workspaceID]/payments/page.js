import LoadingPage from '@/app/loading'
import React, { Suspense } from 'react'
import Disbursements from './Disbursements'

export default async function DisbursementsPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Disbursements />
    </Suspense>
  )
}
