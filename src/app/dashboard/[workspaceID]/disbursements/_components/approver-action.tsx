'use client';
import { useDisclosure, addToast } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import React, { useMemo } from 'react';

import {
  reviewBatch,
  submitBatchForApproval,
} from '@/app/_actions/transaction-actions';
import PromptModal from '@/components/modals/prompt-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input-field';
import Loader from '@/components/ui/loader';
import usePaymentsStore from '@/context/payment-store';
import { useWorkspaceInit } from '@/hooks/use-query-data';
import { QUERY_KEYS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

const ApproverAction = ({
  workspaceID,
  batch,
}: {
  workspaceID: string;
  batch: any;
}) => {
  const queryClient = useQueryClient();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const {
    closeRecordsModal,
    setOpenBatchDetailsModal,

    setLoading,
    loading,
    setError,
  } = usePaymentsStore();

  const { data: workspaceInit } = useWorkspaceInit(workspaceID);
  const permissions = workspaceInit?.data?.workspacePermissions;
  const activeWorkspace = workspaceInit?.data?.activeWorkspace || {};
  const workspaceWalletBalance = activeWorkspace?.balance;

  const [isLoading, setIsLoading] = React.useState(false);
  const [isApproval, setIsApproval] = React.useState(true);
  const [approve, setApprove] = React.useState({
    action: 'approve', //approve or reject
    remarks: '',
  });

  async function handleApproval() {
    setIsLoading(true);

    if (!permissions?.can_approve) {
      addToast({
        color: 'danger',
        title: 'Unauthorized!',
        description: 'You do not have permissions to perform this action',
      });
      setError({
        status: true,
        message: 'You do not have permissions to perform this action',
      });
      setIsLoading(false);

      return;
    }

    if (
      isApproval &&
      parseFloat(batch?.total_amount) > parseFloat(workspaceWalletBalance)
    ) {
      setIsLoading(false);
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'Insufficient funds in workspace wallet',
      });

      return;
    }

    if (!approve.remarks) {
      setIsLoading(false);
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'Review reason is required!',
      });

      return;
    }

    const response = await reviewBatch(batch?.id, approve);

    // selectedActionType.name == PAYMENT_SERVICE_TYPES[0].name
    //   ? await reviewBatch(batch?.id, approve)
    //   : await reviewSingleTransaction(batch?.id, approve);

    if (!response?.success) {
      setIsLoading(false);
      addToast({
        title: 'Error',
        color: 'danger',
        description: response?.message,
      });

      return;
    }

    setIsLoading(false);

    addToast({
      title: 'Success',
      color: 'success',
      description: `Bulk transaction ${isApproval ? 'approved' : 'rejected'}!`,
    });

    // PERFORM QUERY INVALIDATION TO UPDATE THE STATE OF THE UI
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.BATCH_DETAILS],
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.BATCH_DETAILS, batch?.id],
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.BULK_TRANSACTIONS, workspaceID],
    });
    closeRecordsModal();
    setOpenBatchDetailsModal(false);
    onClose();
  }

  function handleReject() {
    setApprove((prev) => ({ ...prev, action: 'reject' }));
    setIsApproval(false);
    onOpen();
  }

  function handleClosePrompt() {
    setApprove({
      action: 'approve', //approve or reject
      remarks: '',
    });
    setIsApproval(true);
    setIsLoading(false);
    onClose();
  }

  async function handleSubmitForApproval() {
    setLoading(true);
    if (batch?.number_of_records != batch?.number_of_valid_records) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'Some records are still invalid!',
      });
      setLoading(false);

      return;
    }

    if (parseFloat(batch?.valid_amount) > parseFloat(workspaceWalletBalance)) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: 'Insufficient funds in the wallet!',
      });
      setLoading(false);

      return;
    }

    if (!permissions.can_initiate) {
      addToast({
        title: 'NOT ALLOWED',
        color: 'danger',
        description: 'You do not have permissions to perform this action',
      });
      setError({
        status: true,
        message: 'You do not have permissions to perform this action',
      });
      setLoading(false);

      return;
    }

    const response = await submitBatchForApproval(batch?.id);

    if (!response?.success) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: response?.message,
      });
      setLoading(false);

      return;
    }

    // PERFORM QUERY INVALIDATION TO UPDATE THE STATE OF THE UI
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.BATCH_DETAILS, batch?.id],
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.BULK_TRANSACTIONS, workspaceID],
    });

    addToast({
      title: 'Success',
      color: 'success',
      description: 'Records submitted successfully!',
    });
    onClose();
    setLoading(false);

    return;
  }

  return (
    <>
      <div className="flex ml-auto h-full w-full flex-col gap-8">
        {batch?.status?.toLowerCase() == 'submitted' &&
          permissions?.can_initiate && (
            <div className="mx-auto gap-4">
              <Button
                isLoading={loading}
                size={'lg'}
                onClick={handleSubmitForApproval}
              >
                Submit For Approval
              </Button>
            </div>
          )}
        {permissions?.can_approve && isInReview && (
          <div className=" flex w-full max-w-xs items-end justify-end gap-4">
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
              isDisabled={isLoading}
              isLoading={isLoading}
              onClick={onOpen}
            >
              Approve
            </Button>
          </div>
        )}
      </div>

      <PromptModal
        confirmText="Confirm"
        isDisabled={isLoading}
        isDismissable={false}
        isLoading={isLoading}
        isOpen={isOpen}
        title="Approve Bulk Transaction"
        onClose={handleClosePrompt}
        onConfirm={handleApproval}
        // onOpen={onOpen}
      >
        <p className="-mt-4 mb-2 text-sm leading-6 text-foreground/70">
          Are you sure you want to {approve.action} the batch transaction{' '}
          <code className="rounded-md bg-primary/10 p-1 px-2 font-semibold text-primary-700">
            {`${batch?.batch_name} - (${formatCurrency(batch?.total_amount)})`}
          </code>{' '}
          {isApproval ? 'to run against your PayBoss Wallet balance.' : ''}
        </p>
        <Input
          isDisabled={isLoading}
          label="Review"
          placeholder="Enter a review remark"
          onChange={(e) =>
            setApprove((prev) => ({ ...prev, remarks: e.target.value }))
          }
        />
      </PromptModal>
    </>
  );
};

export default ApproverAction;
