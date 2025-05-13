"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import { useDisclosure } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { formatCurrency, notify } from "@/lib/utils";
import {
  reviewBatch,
  submitBatchForApproval,
} from "@/app/_actions/transaction-actions";
import usePaymentsStore from "@/context/payment-store";
import { Input } from "@/components/ui/input-field";
import { QUERY_KEYS } from "@/lib/constants";
import PromptModal from "@/components/base/prompt-modal";
import { useWorkspaceInit } from "@/hooks/useQueryHooks";
import Loader from "@/components/ui/loader";

const ApproverAction = ({ workspaceID, batch }) => {
  const queryClient = useQueryClient();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const {
    closeRecordsModal,
    setOpenBatchDetailsModal,
    openBatchDetailsModal,
    setLoading,
    loading,
    transactionDetails,
    setError,
  } = usePaymentsStore();

  const { data: workspaceInit } = useWorkspaceInit(workspaceID);
  const permissions = workspaceInit?.data?.workspacePermissions;
  const activeWorkspace = workspaceInit?.data?.activeWorkspace || {};
  const workspaceWalletBalance = activeWorkspace?.balance;

  const [isLoading, setIsLoading] = React.useState(false);
  const [isApproval, setIsApproval] = React.useState(true);
  const [approve, setApprove] = React.useState({
    action: "approve", //approve or reject
    remarks: "",
  });

  async function handleApproval() {
    setIsLoading(true);

    if (!permissions?.can_approve) {
      notify({
        color: "danger",
        title: "Unauthorized!",
        description: "You do not have permissions to perform this action",
      });
      setError({
        status: true,
        message: "You do not have permissions to perform this action",
      });
      setIsLoading(false);

      return;
    }

    if (
      isApproval &&
      parseFloat(batch?.total_amount) > parseFloat(workspaceWalletBalance)
    ) {
      setIsLoading(false);
      notify({
        title: "Error",
        color: "danger",
        description: "Insufficient funds in workspace wallet",
      });

      return;
    }

    if (!approve.remarks) {
      setIsLoading(false);
      notify({
        title: "Error",
        color: "danger",
        description: "Review reason is required!",
      });

      return;
    }

    const response = await reviewBatch(batch?.id, approve);

    // selectedActionType.name == PAYMENT_SERVICE_TYPES[0].name
    //   ? await reviewBatch(batch?.id, approve)
    //   : await reviewSingleTransaction(batch?.id, approve);

    if (!response?.success) {
      setIsLoading(false);
      notify({
        title: "Error",
        color: "danger",
        description: response?.message,
      });

      return;
    }

    setIsLoading(false);

    notify({
      title: "Success",
      color: "success",
      description: `Bulk transaction ${isApproval ? "approved" : "rejected"}!`,
    });

    // PERFORM QUERY INVALIDATION TO UPDATE THE STATE OF THE UI
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
    setApprove((prev) => ({ ...prev, action: "reject" }));
    setIsApproval(false);
    onOpen();
  }

  function handleClosePrompt() {
    setApprove({
      action: "approve", //approve or reject
      review: "",
    });
    setIsApproval(true);
    setIsLoading(false);
    onClose();
  }

  const isApprovedOrRejected =
    batch?.status?.toLowerCase() == "approved" ||
    batch?.status?.toLowerCase() == "rejected" ||
    transactionDetails?.status?.toLowerCase() == "approved" ||
    transactionDetails?.status?.toLowerCase() == "rejected";

  const isInReview =
    batch?.status == "review" || transactionDetails?.status == "review";

  const isProcessed =
    batch?.status == "processed" ||
    transactionDetails?.status == "processed" ||
    transactionDetails?.status == "processed";

  async function handleSubmitForApproval() {
    setLoading(true);
    if (batch?.number_of_records != batch?.number_of_valid_records) {
      notify({
        title: "Error",
        color: "danger",
        description: "Some records are still invalid!",
      });
      setLoading(false);

      return;
    }

    if (parseFloat(batch?.valid_amount) > parseFloat(workspaceWalletBalance)) {
      notify({
        title: "Error",
        color: "danger",
        description: "Insufficient funds in the wallet!",
      });
      setLoading(false);

      return;
    }

    if (!permissions.can_initiate) {
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

    const response = await submitBatchForApproval(batch?.id);

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
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.BATCH_DETAILS, batch?.id],
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.BULK_TRANSACTIONS, workspaceID],
    });

    notify({
      title: "Success",
      color: "success",
      description: "Records submitted successfully!",
    });
    onClose();
    setLoading(false);

    return;
  }

  const renderBatchApproval = useMemo(() => {
    return (
      <div className="flex max-w-lg flex-col items-center justify-center gap-2">
        <h3 className="leading-0 m-0 text-[clamp(1rem,1rem+1vw,1.25rem)] font-bold uppercase tracking-tight">
          {isApprovedOrRejected
            ? `Batch ${batch?.status}`
            : isProcessed
              ? `Batch Processed`
              : "Batch payout requires approval"}
        </h3>

        {isApprovedOrRejected ? (
          <p className="text-center text-[15px] text-foreground/50">
            Check the status and batch details for more information.
          </p>
        ) : isProcessed ? (
          <p className="text-center text-[15px] text-foreground/50">
            This batch has been processed and funds have been released.
          </p>
        ) : permissions?.can_approve ? (
          <p className="text-center text-[15px] text-foreground/50">
            Batch payouts have been validated and are awaiting your approval.
            Once approved, they will process through your PayBoss wallet to
            release the funds.
          </p>
        ) : permissions?.can_initiate ? (
          <p className="text-center text-[15px] text-foreground/50">
            Batch Payouts have been validated and awaiting approval, however you
            have no permissions to approve this transaction.
          </p>
        ) : (
          <p className="text-center text-[15px] text-foreground/50">
            Batch payouts have been submitted for approval. The total amount
            will be reserved and blocked until the transaction is approved or
            rejected.
          </p>
        )}
      </div>
    );
  }, [
    isApprovedOrRejected,
    permissions?.can_approve,
    permissions?.can_initiate,
  ]);

  return !batch?.batch_name || loading ? (
    <Loader
      classNames={{
        wrapper: "lg:min-h-96",
      }}
      size={100}
      loadingText={"Please wait..."}
    />
  ) : (
    <>
      <div className="flex h-full w-full flex-col justify-between gap-8">
        <div className="flex w-full select-none flex-col items-center gap-9 rounded-2xl bg-primary-50/70 p-9">
          <Image
            alt="Approval Illustration"
            className="aspect-square max-h-80 object-contain"
            height={200}
            src={"/images/illustrations/approval.svg"}
            width={200}
          />

          {renderBatchApproval}
          {batch?.status?.toLowerCase() == "submitted" &&
            permissions?.can_initiate && (
              <div className="mx-auto gap-4">
                <Button
                  isLoading={loading}
                  size={"lg"}
                  onClick={handleSubmitForApproval}
                >
                  Submit For Approval
                </Button>
              </div>
            )}
        </div>

        {permissions?.can_approve && isInReview && (
          <div className="mb-4 ml-auto flex w-full max-w-xs items-end justify-end gap-4">
            <Button
              className={"flex-1 bg-red-500/10"}
              color="danger"
              variant="light"
              // isDisabled={isLoading}
              onClick={handleReject}
            >
              Reject
            </Button>
            <Button
              className={"flex-1"}
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
        onOpen={onOpen}
      >
        <p className="-mt-4 mb-2 text-sm leading-6 text-foreground/70">
          Are you sure you want to {approve.action} the batch transaction{" "}
          <code className="rounded-md bg-primary/10 p-1 px-2 font-semibold text-primary-700">
            {`${batch?.batch_name} - (${formatCurrency(batch?.total_amount)})`}
          </code>{" "}
          {isApproval ? "to run against your PayBoss Wallet balance." : ""}
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
