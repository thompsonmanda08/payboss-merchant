'use client';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Alert, addToast } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';

import { submitBatchForApproval } from '@/app/_actions/transaction-actions';
import StatusCard from '@/components/base/status-card';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/loader';
import usePaymentsStore from '@/context/payment-store';
import { useWorkspaceInit } from '@/hooks/use-query-data';
import { QUERY_KEYS } from '@/lib/constants';

const ValidationDetails = ({
  navigateForward,
  workspaceID,
  batch,
}: {
  navigateForward: () => void;
  workspaceID: string;
  batch: any;
}) => {
  const queryClient = useQueryClient();
  const {
    openRecordsModal,
    loading,
    setLoading,
    openBatchDetailsModal,
    error,
    setError,
  } = usePaymentsStore();

  const { data: workspaceInit } = useWorkspaceInit(workspaceID);
  const permissions = workspaceInit?.data?.workspacePermissions;
  const workspaceWalletBalance = workspaceInit?.data?.activeWorkspace?.balance;

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
    navigateForward();
    setLoading(false);

    return;
  }

  return !batch ? (
    <Loader loadingText={'Processing batch...'} size={80} />
  ) : (
    <>
      <div className="flex h-full w-full flex-col justify-between">
        <StatusCard
          Icon={QuestionMarkCircleIcon}
          IconColor="secondary"
          invalidInfo={'View Invalid Records'}
          invalidTitle={'Invalid Records'}
          invalidValue={batch?.number_of_invalid_records || '0'}
          tooltipText={'All records must be valid to proceed'}
          totalInfo={'Records in total'}
          totalTitle={'Total Records'}
          totalValue={batch?.number_of_records || '0'}
          validAmount={batch?.valid_amount || '0'}
          validInfo={'View Valid Records'}
          validTitle={'Valid Records'}
          validValue={batch?.number_of_valid_records || '0'}
          viewAllRecords={() => openRecordsModal('all')}
          viewInvalidRecords={() => openRecordsModal('invalid')}
          viewValidRecords={() => openRecordsModal('valid')}
        />
        {error?.status && <Alert color="danger">{error.message}</Alert>}

        {batch?.status?.toLowerCase() == 'submitted' &&
          permissions?.can_initiate && (
            <div className="my-4 flex h-1/6 w-full items-end justify-end gap-4">
              <Button isLoading={loading} onClick={handleSubmitForApproval}>
                Submit For Approval
              </Button>
            </div>
          )}
      </div>
    </>
  );
};

export default ValidationDetails;
