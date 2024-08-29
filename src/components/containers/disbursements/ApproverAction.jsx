'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { formatCurrency, notify } from '@/lib/utils'
import approvalIllustration from '@/images/illustrations/approval.svg'
import useAllUsersAndRoles from '@/hooks/useAllUsersAndRoles'
import Image from 'next/image'
import { reviewBatch } from '@/app/_actions/transaction-actions'
import usePaymentsStore from '@/context/paymentsStore'
import { useDisclosure } from '@nextui-org/react'
import { Input } from '@/components/ui/InputField'
import useWorkspaces from '@/hooks/useWorkspaces'
import { useQueryClient } from '@tanstack/react-query'
import {
  BATCH_DETAILS_QUERY_KEY,
  DIRECT_BULK_TRANSACTIONS_QUERY_KEY,
} from '@/lib/constants'
import PromptModal from '@/components/base/Prompt'
import { useBatchDetails } from '@/hooks/useQueryHooks'
import Spinner from '@/components/ui/Spinner'
import useDashboard from '@/hooks/useDashboard'
import Loader from '@/components/ui/Loader'

const ApproverAction = ({ navigateForward, batchID }) => {
  const queryClient = useQueryClient()
  const {
    selectedBatch,
    closeRecordsModal,
    batchDetails: batchState,
    setOpenBatchDetailsModal,
    openBatchDetailsModal,
  } = usePaymentsStore()

  const [queryID, setQueryID] = useState(
    batchID || selectedBatch?.ID || batchState?.ID,
  )

  const { data: batchResponse } = useBatchDetails(queryID)
  const batchDetails = batchResponse?.data

  const { workspaceWalletBalance, workspaceID } = useWorkspaces()
  const { workspaceUserRole: role } = useDashboard()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isApproval, setIsApproval] = React.useState(true)
  const [approve, setApprove] = React.useState({
    action: 'approve', //approve or reject
    review: '',
  })

  async function handleApproval() {
    setIsLoading(true)

    if (!role?.can_approve) {
      setIsLoading(false)
      notify('error', 'Unauthorized!')
      return
    }

    if (
      isApproval &&
      (parseFloat(selectedBatch?.total_amount) >
        parseFloat(workspaceWalletBalance) ||
        parseFloat(batchDetails?.total_amount) >
          parseFloat(workspaceWalletBalance))
    ) {
      setIsLoading(false)
      notify('error', 'Insufficient funds in workspace wallet')
      return
    }

    if (!approve.review) {
      setIsLoading(false)
      notify('error', 'Review reason is required!')
      return
    }

    const response = await reviewBatch(queryID, approve)

    if (!response.success) {
      setIsLoading(false)
      notify('error', response.message)
      return
    }

    setIsLoading(false)
    let action = isApproval ? 'approved' : 'rejected'
    notify('success', `Bulk transaction ${action}!`)

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
    closeRecordsModal()
    setOpenBatchDetailsModal(false)
    onClose()
  }

  function handleReject() {
    setApprove((prev) => ({ ...prev, action: 'reject' }))
    setIsApproval(false)
    onOpen()
  }

  function handleClosePrompt() {
    setApprove((prev) => ({
      action: 'approve', //approve or reject
      review: '',
    }))
    setIsApproval(true)
    setIsLoading(false)
    onClose()
  }

  const isApprovedOrRejected =
    selectedBatch?.status?.toLowerCase() == 'approved' ||
    batchDetails?.status?.toLowerCase() == 'approved' ||
    selectedBatch?.status?.toLowerCase() == 'rejected' ||
    batchDetails?.status?.toLowerCase() == 'rejected'

  return !batchDetails || (batchID && !selectedBatch?.status) ? (
    <Loader />
  ) : (
    <>
      <PromptModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={handleClosePrompt}
        title="Approve Bulk Transaction"
        onConfirm={handleApproval}
        confirmText="Confirm"
        isDisabled={isLoading}
        isLoading={isLoading}
        isDismissable={false}
      >
        <p className="-mt-4 mb-2 text-sm leading-6 text-slate-700">
          Are you sure you want to {approve.action} the batch transaction{' '}
          <code className="rounded-md bg-primary/10 p-1 px-2 font-semibold text-primary-700">
            {`${selectedBatch?.batch_name || batchDetails?.batch_name} - (${formatCurrency(selectedBatch?.total_amount || batchDetails?.total_amount)})`}
          </code>{' '}
          {isApproval ? 'to run against your PayBoss Wallet balance.' : ''}
        </p>
        <Input
          label="Review"
          placeholder="Enter a review remark"
          isDisabled={isLoading}
          onChange={(e) =>
            setApprove((prev) => ({ ...prev, review: e.target.value }))
          }
        />
      </PromptModal>
      <div className="flex h-full w-full flex-col justify-between gap-8">
        <div className="flex w-full select-none flex-col items-center gap-9 rounded-2xl bg-primary-50/70 p-9">
          <Image
            className="aspect-square max-h-80 object-contain"
            src={approvalIllustration}
            width={200}
            height={200}
          />
          <div className="flex max-w-lg flex-col items-center justify-center gap-2">
            <h3 className="leading-0 m-0 text-[clamp(1rem,1rem+1vw,1.25rem)] font-bold uppercase tracking-tight">
              {isApprovedOrRejected
                ? `Batch ${selectedBatch?.status || batchDetails?.status}`
                : 'Batch payout requires approval'}
            </h3>

            {isApprovedOrRejected ? (
              <p className="text-center text-[15px] text-slate-500">
                Check the status and batch details for more information.
              </p>
            ) : role?.can_approve ? (
              <p className="text-center text-[15px] text-slate-500">
                Batch payouts have been validated and awaiting approval, after
                which the transactions will run against your PayBoss wallet.
              </p>
            ) : (
              <p className="text-center text-[15px] text-slate-500">
                Batch payouts have been completed and submitted for approval.
                You need to review and approve the changes. If any changes are
                needed, please contact your administrator.
              </p>
            )}
          </div>
        </div>

        {role?.can_approve &&
          (selectedBatch?.status == 'review' ||
            batchDetails?.status == 'review') && (
            <div className="mb-4 ml-auto flex w-full max-w-xs items-end justify-end gap-4">
              <Button
                className={'flex-1 bg-red-500/10'}
                color="danger"
                variant="light"
                // isDisabled={isLoading}
                onClick={handleReject}
              >
                Reject
              </Button>
              <Button
                className={'flex-1'}
                isLoading={isLoading}
                isDisabled={isLoading}
                onClick={onOpen}
              >
                Approve
              </Button>
            </div>
          )}
      </div>
    </>
  )
}

export default ApproverAction
