"use client";
import React from "react";
import usePaymentsStore from "@/context/payment-store";
import { Input } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { formatCurrency, notify } from "@/lib/utils";
import { BanknotesIcon, WalletIcon } from "@heroicons/react/24/outline";
import useDashboard from "@/hooks/useDashboard";
import { initializeBulkTransaction } from "@/app/_actions/transaction-actions";
import StatusMessage from "@/components/base/status-message";

const PaymentDetails = ({
  navigateForward,
  navigateBackwards,
  workspaceID,
  protocol,
}) => {
  const {
    setLoading,
    loading,
    updatePaymentFields,
    setError,
    error,
    paymentAction,
    setBatchDetails,
    resetPaymentData,
    selectedActionType,
  } = usePaymentsStore();

  const { workspaceUserRole: role } = useDashboard();

  async function handleProceed() {
    setLoading(true);

    if (
      paymentAction?.batch_name == "" &&
      paymentAction?.batch_name?.length < 3
    ) {
      setLoading(false);
      notify({
        title: "Error",
        color: "danger",
        description: "A valid filename is required!",
      });
      return;
    }

    if (!role?.can_initiate) {
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

    // Create payment batch here if user is create access
    const response = await initializeBulkTransaction(
      workspaceID,
      paymentAction
    );

    if (response?.success) {
      notify({
        color: "success",
        title: "Success",
        description: "Payment Batch Created!",
      });

      resetPaymentData();
      setBatchDetails(response?.data); // SET VALIDATION DATA INTO STATE
      navigateForward(); // VALIDATION WILL HAPPEN ON THE NEXT SCREEN
      setLoading(false);
      return;
    }

    notify({
      title: "Error",
      color: "danger",
      description: "Failed to create payment batch!",
    });
    setError({ status: true, message: response?.message });
    setLoading(false);
    return;
  }

  function handleBackwardsNavigation() {
    // Set the file to null so that the user can upload again
    updatePaymentFields({ file: null });
    setError({ status: false, message: "" });
    navigateBackwards();
  }

  return (
    <div className="mx-auto flex w-full flex-1 flex-col gap-4 md:px-8">
      <div className="flex w-full flex-1 gap-4">
        {paymentAction?.prefund && (
          <div className="flex w-full items-center gap-3 rounded-md bg-primary/10 p-4">
            <WalletIcon className="h-6 w-6 text-primary" />
            <div className="h-8 border-r-2 border-primary/60" />
            <div className="flex w-full justify-between text-sm font-medium text-primary 2xl:text-base">
              <span className="font-bold uppercase">
                {paymentAction?.prefund?.name}
              </span>
              <span>
                {formatCurrency(paymentAction?.prefund?.available_balance)}
              </span>
            </div>
          </div>
        )}
        {selectedActionType?.name && (
          <div className="flex w-full items-center gap-3 rounded-md bg-primary/10 p-4">
            <selectedActionType.Icon className="h-6 w-6 text-primary" />
            <div className="h-8 border-r-2 border-primary/60" />
            <div className="flex w-full justify-between text-sm font-medium text-primary 2xl:text-base">
              <p>{selectedActionType?.name}</p>
            </div>
          </div>
        )}
        <div className="flex w-full items-center gap-3 rounded-md bg-primary/10 py-3 pl-5 pr-4">
          <BanknotesIcon className="h-6 w-6 text-primary" />
          <div className="h-8 border-r-2 border-primary/60" />
          <div className="flex w-full justify-between text-sm font-medium capitalize text-primary 2xl:text-base">
            <p>{protocol}</p>
          </div>
        </div>
      </div>
      <div className="grid w-full grid-cols-3 gap-5">
        <ul className="flex-3 col-span-2 list-disc rounded-md bg-primary-50 px-10 py-4 text-sm leading-6 text-slate-600">
          <li>
            Be sure that the provided batch file is in the same format as the
            provided template to prevent transaction failure.
          </li>

          <li>
            During validation and pending approval, the selected prefund wallet
            will be disbaled and locked for the duration of the batch process.
          </li>
          <li>
            <strong>
              A batch name to is required label the batch process.
            </strong>
          </li>
          <li>
            In the case that a transaction fails, the prefund wallet will be
            unlocked and ready for transactions equal only to the amount of the
            failed transactions as the available balance.
          </li>
        </ul>
        <Input
          label={"Batch Name"}
          className="mb-auto"
          required={true}
          placeholder={"Enter a batch name"}
          containerClasses="w-full col-span-1 max-w-lg"
          value={paymentAction?.batch_name}
          onError={error?.status}
          onChange={(e) => {
            updatePaymentFields({ batch_name: e.target.value, protocol });
          }}
        />
      </div>

      <div className="flex flex-1 items-end justify-end gap-4">
        <Button
          className={"bg-primary/10 font-medium text-primary"}
          color={"primary"}
          variant="light"
          onClick={handleBackwardsNavigation}
          isDisabled={loading}
        >
          Back
        </Button>
        <Button
          className={""}
          isDisabled={loading}
          isLoading={loading}
          onClick={handleProceed}
        >
          Validate Batch
        </Button>
      </div>

      {error?.status && (
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-4">
          <StatusMessage error={error.status} message={error.message} />
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;
