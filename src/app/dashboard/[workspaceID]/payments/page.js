import LoadingPage from '@/app/loading'
import React, { Suspense } from 'react'
import Disbursements from './Disbursements'

export default async function DisbursementsPage({ params }) {
  const { workspaceID } = params
  return (
    <Suspense fallback={<LoadingPage />}>
      <Disbursements workspaceID={workspaceID} />
    </Suspense>
  )
}
