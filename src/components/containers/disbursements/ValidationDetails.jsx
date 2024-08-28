'use client'
import React, { useEffect, useState } from 'react'
import usePaymentsStore from '@/context/paymentsStore'
import { Button } from '@/components/ui/Button'
import { StatusCard } from '@/components/base'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import Spinner from '@/components/ui/Spinner'
import { useBatchDetails } from '@/hooks/useQueryHooks'
import { submitBatchForApproval } from '@/app/_actions/transaction-actions'
import { notify } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import {
  BATCH_DETAILS_QUERY_KEY,
  DIRECT_BULK_TRANSACTIONS_QUERY_KEY,
} from '@/lib/constants'
import useWorkspaces from '@/hooks/useWorkspaces'

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
  } = usePaymentsStore()

  const { workspaceID } = useWorkspaces()

  const [queryID, setQueryID] = useState(
    batchID || selectedBatch?.ID || batchState?.ID,
  )

  const {
    data: batchResponse,
    isLoading,
    isFetched,
    isSuccess,
  } = useBatchDetails(queryID)

  const batchDetails = batchResponse?.data

  async function handleSubmitForApproval() {
    setLoading(true)
    if (
      batchDetails.number_of_records != batchDetails.number_of_valid_records
    ) {
      notify('error', 'Some records are still invalid!')
      setLoading(false)
      return
    }

    const response = await submitBatchForApproval(batchState?.ID || batchID)

    if (!response.success) {
      notify('error', response.message)
      setLoading(false)
      return
    }

    // PERFORM QUERY INVALIDATION TO UPDATE THE STATE OF THE UI
    if (openBatchDetailsModal) {
      queryClient.invalidateQueries({
        queryKey: [DIRECT_BULK_TRANSACTIONS_QUERY_KEY, workspaceID],
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
    if (isFetched && isSuccess && batchResponse.success) {
      setBatchDetails(batchResponse?.data)
    }
  }, [batchID, selectedBatch?.ID, queryID])

  // console.log(batchID)
  // console.log(selectedBatch)
  // console.log(batchState)

  return isLoading || loading || !queryID || !batchDetails ? (
    <div className="grid min-h-80 flex-1 flex-grow place-items-center py-8">
      <div className="flex w-fit flex-col items-center justify-center gap-4">
        <Spinner size={50} />
      </div>
    </div>
  ) : (
    <>
      <div className="flex h-full w-full flex-col justify-between ">
        <StatusCard
          totalTitle={'Total Records'}
          totalText={batchDetails?.number_of_records}
          totalInfo={'View All Records'}
          validTitle={'Valid Records'}
          validText={batchDetails?.number_of_valid_records}
          validInfo={'View Valid Records'}
          invalidTitle={'Invalid Records'}
          invalidText={batchDetails?.number_of_invalid_records || '0'}
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

        <div className="my-4 flex h-1/6 w-full items-end justify-end gap-4">
          {/* <Button
            className={'font-medium text-primary'}
            variant="outline"
            onClick={navigateBackwards}
          >
            Back
          </Button> */}
          {(batchState?.status?.toLowerCase() == 'submitted' ||
            selectedBatch?.status?.toLowerCase() == 'submitted') && (
            <Button onClick={handleSubmitForApproval}>
              Submit For Approval
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

export default ValidationDetails
