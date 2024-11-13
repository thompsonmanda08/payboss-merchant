import LoadingPage from '@/app/loading'
import React, { Suspense } from 'react'
import Disbursements from './Disbursements'
import { getAllBulkTransactions } from '@/app/_actions/transaction-actions'

export default async function DisbursementsPage(props) {
  const params = await props.params;
  const { workspaceID } = params
  const bulkTransactions = await getAllBulkTransactions(workspaceID)

  return (
    <Suspense fallback={<LoadingPage />}>
      <Disbursements
        workspaceID={workspaceID}
        bulkTransactions={bulkTransactions?.data?.batches || []}
      />
    </Suspense>
  )
}
