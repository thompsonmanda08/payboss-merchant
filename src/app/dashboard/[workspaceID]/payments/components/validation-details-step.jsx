"use client";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";

import usePaymentsStore from "@/context/payment-store";
import { Button } from "@/components/ui/button";
import { useWorkspaceInit } from "@/hooks/useQueryHooks";
import { submitBatchForApproval } from "@/app/_actions/transaction-actions";
import { notify } from "@/lib/utils";
import { QUERY_KEYS } from "@/lib/constants";
import useWorkspaces from "@/hooks/useWorkspaces";
import Loader from "@/components/ui/loader";
import StatusCard from "@/components/status-card";
import { Alert } from "@heroui/react";

const ValidationDetails = ({ navigateForward, workspaceID }) => {
  const queryClient = useQueryClient();
  const {
    openRecordsModal,
    selectedBatch,
    setLoading,
    openBatchDetailsModal,
    error,
    setError,
  } = usePaymentsStore();

  const { workspaceWalletBalance } = useWorkspaces();

  const { data: workspaceInit } = useWorkspaceInit(workspaceID);
  const role = workspaceInit?.data?.workspacePermissions;

  async function handleSubmitForApproval() {
    setLoading(true);
    if (
      selectedBatch?.number_of_records != selectedBatch?.number_of_valid_records
    ) {
      notify({
        title: "Error",
        color: "danger",
        description: "Some records are still invalid!",
      });
      setLoading(false);

      return;
    }

    if (
      parseFloat(selectedBatch?.valid_amount) >
      parseFloat(workspaceWalletBalance)
    ) {
      notify({
        title: "Error",
        color: "danger",
        description: "Insufficient funds in the wallet!",
      });
      setLoading(false);

      return;
    }

    if (!role.can_initiate) {
      notify({
        title: "NOT ALLOWED",
        color: "danger",
        description: "You do not have permissions to perform this action",
      });
      setError({
        status: true,
        message: "You do not have permissions to perform this action",
      });
      setLoading(false);

      return;
    }

    const response = await submitBatchForApproval(selectedBatch?.ID);

    if (!response?.success) {
      notify({
        title: "Error",
        color: "danger",
        description: response?.message,
      });
      setLoading(false);

      return;
    }

    // PERFORM QUERY INVALIDATION TO UPDATE THE STATE OF THE UI
    if (openBatchDetailsModal) {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.BULK_TRANSACTIONS, workspaceID],
      });
    } else {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.BATCH_DETAILS, selectedBatch?.ID],
      });
    }

    notify({
      title: "Success",
      color: "success",
      description: "Records submitted successfully!",
    });
    navigateForward();
    setLoading(false);

    return;
  }

  console.log("selectedBatch", selectedBatch);

  return !selectedBatch ? (
    <Loader size={80} loadingText={"Processing batch..."} />
  ) : (
    <>
      <div className="flex h-full w-full flex-col justify-between">
        <StatusCard
          Icon={QuestionMarkCircleIcon}
          IconColor="secondary"
          invalidInfo={"View Invalid Records"}
          invalidTitle={"Invalid Records"}
          invalidValue={selectedBatch?.number_of_invalid_records || "0"}
          tooltipText={"All records must be valid to proceed"}
          totalInfo={"Records in total"}
          totalTitle={"Total Records"}
          totalValue={selectedBatch?.number_of_records || "0"}
          validAmount={selectedBatch?.valid_amount || "0"}
          validInfo={"View Valid Records"}
          validTitle={"Valid Records"}
          validValue={selectedBatch?.number_of_valid_records || "0"}
          viewAllRecords={
            selectedBatch?.total ? () => openRecordsModal("all") : undefined
          }
          viewInvalidRecords={
            selectedBatch?.invalid
              ? () => openRecordsModal("invalid")
              : undefined
          }
          viewValidRecords={
            selectedBatch?.valid ? () => openRecordsModal("valid") : undefined
          }
        />
        {error?.status && <Alert color="danger">{error.message}</Alert>}

        {selectedBatch?.status?.toLowerCase() == "submitted" &&
          role?.can_initiate && (
            <div className="my-4 flex h-1/6 w-full items-end justify-end gap-4">
              <Button onClick={handleSubmitForApproval}>
                Submit For Approval
              </Button>
            </div>
          )}
      </div>
    </>
  );
};

export default ValidationDetails;
