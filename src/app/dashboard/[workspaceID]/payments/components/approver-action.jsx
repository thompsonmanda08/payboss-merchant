"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useDisclosure } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { formatCurrency, notify } from "@/lib/utils";
import { reviewBatch } from "@/app/_actions/transaction-actions";
import usePaymentsStore from "@/context/payment-store";
import { Input } from "@/components/ui/input-field";
import { PAYMENT_SERVICE_TYPES, QUERY_KEYS } from "@/lib/constants";
import PromptModal from "@/components/base/prompt-modal";
import { useBatchDetails, useWorkspaceInit } from "@/hooks/useQueryHooks";
import Loader from "@/components/ui/loader";

const ApproverAction = ({ workspaceID, batchID }) => {
  const queryClient = useQueryClient();
  const {
    selectedBatch,
    closeRecordsModal,
    batchDetails: batchState,
    setOpenBatchDetailsModal,
    openBatchDetailsModal,
    selectedActionType,
    transactionDetails,
    setError,
  } = usePaymentsStore();

  const [queryID] = useState(
    batchID || selectedBatch?.ID || batchState?.ID || transactionDetails?.ID
  );

  const { data: batchResponse } = useBatchDetails(queryID);
  const batchDetails = batchResponse?.data;

  const { data: workspaceInit } = useWorkspaceInit(workspaceID);

  const role = workspaceInit?.data?.workspacePermissions;
  const activeWorkspace = workspaceInit?.data?.activeWorkspace || {};
  const workspaceWalletBalance = activeWorkspace?.balance;

  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isApproval, setIsApproval] = React.useState(true);
  const [approve, setApprove] = React.useState({
    action: "approve", //approve or reject
    review: "",
  });

  async function handleApproval() {
    setIsLoading(true);

    if (!role?.can_approve) {
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
      (parseFloat(selectedBatch?.total_amount) >
        parseFloat(workspaceWalletBalance) ||
        parseFloat(batchDetails?.total_amount) >
          parseFloat(workspaceWalletBalance))
    ) {
      setIsLoading(false);
      notify({
        title: "Error",
        color: "danger",
        description: "Insufficient funds in workspace wallet",
      });

      return;
    }

    if (!approve.review) {
      setIsLoading(false);
      notify({
        title: "Error",
        color: "danger",
        description: "Review reason is required!",
      });

      return;
    }

    const response = await reviewBatch(queryID, approve);

    // selectedActionType.name == PAYMENT_SERVICE_TYPES[0].name
    //   ? await reviewBatch(queryID, approve)
    //   : await reviewSingleTransaction(queryID, approve);

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
    let action = isApproval ? "approved" : "rejected";

    notify({
      title: "Success",
      color: "success",
      description: `Bulk transaction ${action}!`,
    });

    // PERFORM QUERY INVALIDATION TO UPDATE THE STATE OF THE UI
    if (openBatchDetailsModal) {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.BULK_TRANSACTIONS, workspaceID],
      });
    } else {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.BATCH_DETAILS, queryID],
      });
    }
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
    selectedBatch?.status?.toLowerCase() == "approved" ||
    batchDetails?.status?.toLowerCase() == "approved" ||
    selectedBatch?.status?.toLowerCase() == "rejected" ||
    transactionDetails?.status?.toLowerCase() == "approved" ||
    transactionDetails?.status?.toLowerCase() == "rejected" ||
    batchDetails?.status?.toLowerCase() == "rejected";

  const isInReview =
    selectedBatch?.status == "review" ||
    batchDetails?.status == "review" ||
    transactionDetails?.status == "submitted" ||
    transactionDetails?.status == "review";

  const isProcessed =
    selectedBatch?.status == "processed" ||
    batchDetails?.status == "processed" ||
    transactionDetails?.status == "processed" ||
    transactionDetails?.status == "processed";

  const renderBatchApproval = useMemo(() => {
    return (
      <div className="flex max-w-lg flex-col items-center justify-center gap-2">
        <h3 className="leading-0 m-0 text-[clamp(1rem,1rem+1vw,1.25rem)] font-bold uppercase tracking-tight">
          {isApprovedOrRejected
            ? `Batch ${selectedBatch?.status || batchDetails?.status}`
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
        ) : role?.can_approve ? (
          <p className="text-center text-[15px] text-foreground/50">
            Batch payouts have been validated and are awaiting your approval.
            Once approved, they will process through your PayBoss wallet to
            release the funds.
          </p>
        ) : role?.can_initiate ? (
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
  }, [isApprovedOrRejected, role?.can_approve]);

  const renderApproval = useMemo(() => {
    return (
      <div className="flex max-w-lg flex-col items-center justify-center gap-2">
        <h3 className="leading-0 m-0 text-[clamp(1rem,1rem+1vw,1.25rem)] font-bold uppercase tracking-tight">
          {isApprovedOrRejected
            ? `Transaction ${transactionDetails?.status}`
            : "This Transaction requires approval"}
        </h3>

        {isApprovedOrRejected ? (
          <p className="text-center text-[15px] text-foreground/50">
            Check the status and transaction details for more information.
          </p>
        ) : role?.can_approve ? (
          <p className="text-center text-[15px] text-foreground/50">
            The transaction has been validated and is awaiting your approval.
            Once approved, it will process through your PayBoss wallet to
            release the funds.
          </p>
        ) : role?.can_initiate ? (
          <p className="text-center text-[15px] text-foreground/50">
            Transaction has been validated and awaiting approval, however you
            have no permissions to approve this transaction.
          </p>
        ) : (
          <p className="text-center text-[15px] text-foreground/50">
            The payout has been submitted for approval. The total amount will be
            reserved and blocked until the transaction is approved or rejected.
          </p>
        )}
      </div>
    );
  }, [isApprovedOrRejected, role]);

  return !batchDetails || (batchID && !selectedBatch?.status) ? (
    <Loader />
  ) : (
    <>
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
            {`${
              selectedBatch?.batch_name || batchDetails?.batch_name
            } - (${formatCurrency(
              selectedBatch?.total_amount || batchDetails?.total_amount
            )})`}
          </code>{" "}
          {isApproval ? "to run against your PayBoss Wallet balance." : ""}
        </p>
        <Input
          isDisabled={isLoading}
          label="Review"
          placeholder="Enter a review remark"
          onChange={(e) =>
            setApprove((prev) => ({ ...prev, review: e.target.value }))
          }
        />
      </PromptModal>
      <div className="flex h-full w-full flex-col justify-between gap-8">
        <div className="flex w-full select-none flex-col items-center gap-9 rounded-2xl bg-primary-50/70 p-9">
          <Image
            alt="Approval Illustration"
            className="aspect-square max-h-80 object-contain"
            height={200}
            src={"/images/illustrations/approval.svg"}
            width={200}
          />
          {selectedActionType?.name == PAYMENT_SERVICE_TYPES[0].name
            ? renderBatchApproval
            : renderApproval}
        </div>

        {role?.can_approve && isInReview && (
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
    </>
  );
};

export default ApproverAction;
