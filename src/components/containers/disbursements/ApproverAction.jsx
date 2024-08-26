'use client'
import React from 'react'
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
import { BATCH_DETAILS_QUERY_KEY } from '@/lib/constants'
import PromptModal from '@/components/base/Prompt'

const ApproverAction = ({ navigateForward, batchID }) => {
  const queryClient = useQueryClient()
  const { selectedBatch, closeRecordsModal } = usePaymentsStore()
  const { workspaceWalletBalance } = useWorkspaces()
  const { canCreateUsers: isApprover } = useAllUsersAndRoles()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [isLoading, setIsLoading] = React.useState(false)
  const [approve, setApprove] = React.useState({
    action: 'approve', //approve or reject
    review: '',
  })

  async function handleApproval() {
    setIsLoading(true)

    if (!isApprover) {
      setIsLoading(false)
      notify('error', 'Unauthorized!')
      return
    }

    if (selectedBatch?.total_amount < workspaceWalletBalance) {
      setIsLoading(false)
      notify('error', 'Insufficient funds in workspace wallet')
      return
    }

    const response = await reviewBatch(batchID, approve)

    if (!response.success) {
      setIsLoading(false)
      notify('error', response.message)
      return
    }

    setIsLoading(false)
    notify('success', 'Bulk transaction approved!')
    queryClient.invalidateQueries({
      queryKey: [BATCH_DETAILS_QUERY_KEY, batchID],
    })
    closeRecordsModal()
    onClose()
  }

  function handleRevert() {
    closeRecordsModal()
    onClose()
  }

  console.log(workspaceWalletBalance)

  return (
    <>
      <PromptModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        title="Approve Bulk Transaction"
        onConfirm={handleApproval}
        confirmText="Confirm"
        isDisabled={isLoading}
        isLoading={isLoading}
        isDismissable={false}
      >
        <p className="-mt-4 text-sm leading-6 text-slate-700">
          Are you sure you want to approve the batch transaction{' '}
          <code className="rounded-md bg-primary/10 p-1 px-2 font-semibold text-primary-700">
            {`${selectedBatch?.batch_name} - (${formatCurrency(selectedBatch?.total_amount)})`}
          </code>{' '}
          to run against your PayBoss Wallet balance.
        </p>
        <Input
          label="Review"
          isDisabled={isLoading}
          onChange={(e) =>
            setApprove((prev) => ({ ...prev, review: e.target.value }))
          }
        />
      </PromptModal>
      <div className="flex h-full w-full flex-col justify-between gap-8">
        <div className="flex w-full select-none flex-col items-center gap-9 rounded-2xl bg-primary-50/70 p-9">
          <Image
            className="aspect-square max-w-96 object-contain"
            src={approvalIllustration}
            width={200}
            height={200}
          />
          <div className="flex max-w-lg flex-col items-center justify-center gap-2">
            <h3 className="leading-0 up m-0 text-[clamp(1rem,1rem+1vw,1.25rem)] font-bold uppercase">
              Batch payout requires approval
            </h3>

            {isApprover ? (
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

        {isApprover && (
          <div className="mb-4 ml-auto flex w-full max-w-xs items-end justify-end gap-4">
            <Button
              className={'flex-1 bg-red-500/10'}
              color="danger"
              variant="light"
              // isDisabled={isLoading}
              onClick={handleRevert}
            >
              Revert
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
