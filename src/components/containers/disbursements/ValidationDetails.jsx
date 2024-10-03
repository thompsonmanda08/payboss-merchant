'use client'
import React, { useEffect, useState } from 'react'
import usePaymentsStore from '@/context/paymentsStore'
import { Button } from '@/components/ui/Button'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { useBatchDetails } from '@/hooks/useQueryHooks'
import { submitBatchForApproval } from '@/app/_actions/transaction-actions'
import { notify } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import {
  BATCH_DETAILS_QUERY_KEY,
  BULK_TRANSACTIONS_QUERY_KEY,
} from '@/lib/constants'
import useWorkspaces from '@/hooks/useWorkspaces'
import Loader from '@/components/ui/Loader'
import useDashboard from '@/hooks/useDashboard'
import StatusCard from '@/components/elements/StatusCard'
import StatusMessage from '@/components/base/StatusMessage'

const ValidationDetails = ({ navigateForward, batchID }) => {
  const queryClient = useQueryClient()
  const {
    openRecordsModal,
    // TODO: => THERE IS A BETTER WAY TO HANDLE THIS RUBBISH I HAVE DONE HERE ==> USE MUTATION
    batchDetails: batchState, // COPY ONLY IN STATTE
    setBatchDetails,
    loading,
    setLoading,
    selectedBatch,
    openBatchDetailsModal,
    error,
    setError,
  } = usePaymentsStore()

  const { workspaceID, workspaceWalletBalance } = useWorkspaces()

  const [queryID, setQueryID] = useState(
    batchID || selectedBatch?.ID || batchState?.ID,
  )

  const {
    data: batchResponse,
    isLoading,
    isFetched,
    isSuccess,
  } = useBatchDetails(queryID)
  const { workspaceUserRole: role } = useDashboard()

  const batchDetails = batchResponse?.data

  async function handleSubmitForApproval() {
    setLoading(true)
    if (
      batchDetails?.number_of_records != batchDetails?.number_of_valid_records
    ) {
      notify('error', 'Some records are still invalid!')
      setLoading(false)
      return
    }

    if (
      parseFloat(batchDetails?.valid_amount) >
      parseFloat(workspaceWalletBalance)
    ) {
      notify('error', 'Insufficient funds in the wallet!')
      setLoading(false)
      return
    }

    if (!role.can_initiate) {
      notify('error', 'Unauthorized!')
      setError({
        status: true,
        message: 'You do not have permissions to perfom this action',
      })
      setLoading(false)
      return
    }

    const response = await submitBatchForApproval(batchState?.ID || batchID)

    if (!response?.success) {
      notify('error', response?.message)
      setLoading(false)
      return
    }

    // PERFORM QUERY INVALIDATION TO UPDATE THE STATE OF THE UI
    if (openBatchDetailsModal) {
      queryClient.invalidateQueries({
        queryKey: [BULK_TRANSACTIONS_QUERY_KEY, workspaceID],
      })
    } else {
      queryClient.invalidateQueries({
        queryKey: [BATCH_DETAILS_QUERY_KEY, queryID],
      })
    }
    notify('success', 'Records submitted successfully!')
    navigateForward()
    setLoading(false)

    return
  }

  // TODO: => THERE IS A BETTER WAY TO HANDLE THIS RUBBISH I HAVE DONE HERE
  // CANNOT HAVE ZUSTAND STATE AND AND REACT QUERY TO MANAGE STATE - NEEDS TO BE IN SYNC
  useEffect(() => {
    // IF FETCHED AND THERE ARE NO BATCH
    if (isFetched && isSuccess && batchResponse?.success) {
      setBatchDetails(batchResponse?.data)
    }

    return () => {
      setError({})
    }
  }, [batchID, selectedBatch?.ID, queryID])

  return isLoading || loading || !queryID || !batchDetails ? (
    <Loader />
  ) : (
    <>
      <div className="flex h-full w-full flex-col justify-between">
        <StatusCard
          totalValue={batchDetails?.number_of_records || '0'}
          validValue={batchDetails?.number_of_valid_records || '0'}
          invalidValue={batchDetails?.number_of_invalid_records || '0'}
          validAmount={batchDetails?.valid_amount || '0'}
          totalTitle={'Total Records'}
          validTitle={'Valid Records'}
          invalidTitle={'Invalid Records'}
          totalInfo={'Records in total'}
          validInfo={'View Valid Records'}
          invalidInfo={'View Invalid Records'}
          tooltipText={'All records must be valid to proceed'}
          Icon={QuestionMarkCircleIcon}
          IconColor="secondary"
          viewAllRecords={
            batchDetails?.total ? () => openRecordsModal('all') : undefined
          }
          viewValidRecords={
            batchDetails?.valid ? () => openRecordsModal('valid') : undefined
          }
          viewInvalidRecords={
            batchDetails?.invalid
              ? () => openRecordsModal('invalid')
              : undefined
          }
        />
        {error?.status && (
          <div className="mx-auto flex w-full flex-col items-center justify-center gap-4">
            <StatusMessage error={error?.status} message={error?.message} />
          </div>
        )}

        {(batchState?.status?.toLowerCase() == 'submitted' ||
          selectedBatch?.status?.toLowerCase() == 'submitted') &&
          role?.can_initiate && (
            <div className="my-4 flex h-1/6 w-full items-end justify-end gap-4">
              <Button onClick={handleSubmitForApproval}>
                Submit For Approval
              </Button>
            </div>
          )}
      </div>
    </>
  )
}

export default ValidationDetails
