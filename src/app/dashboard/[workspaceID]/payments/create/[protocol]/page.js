import React, { Suspense } from 'react'
import LoadingPage from '@/app/loading'
import BulkPaymentAction from './BulkPaymentAction'
import { getWalletPrefunds } from '@/app/_actions/workspace-actions'

async function CreatePayment(props) {
  const params = await props.params;
  const { workspaceID, protocol } = params

  const activePrefunds = await getWalletPrefunds(workspaceID)

  return (
    <Suspense fallback={<LoadingPage />}>
      <BulkPaymentAction
        workspaceID={workspaceID}
        protocol={protocol}
        activePrefunds={activePrefunds?.data?.data || []}
      />
    </Suspense>
  )
}

export default CreatePayment
