"use client";

import React from "react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import usePaymentsStore from "@/context/payment-store";
import { notify } from "@/lib/utils";
import StatusMessage from "@/components/base/status-message";
import PrefundsTable from "@/components/tables/prefunds-table";

const SelectPrefund = ({
  navigateForward,
  workspaceID,
  walletActivePrefunds,
  protocol,
}) => {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const { paymentAction, updatePaymentFields, error, setError } =
    usePaymentsStore();
  const [isLoading, setIsLoading] = React.useState(false);

  function handleProceed() {
    setIsLoading(true);

    if (paymentAction?.prefundID !== "" || selectedKeys.size !== 0) {
      let prefund = walletActivePrefunds.find(
        (prefund) => prefund.ID === paymentAction?.prefundID,
      );

      if (prefund) {
        updatePaymentFields({ prefund, protocol });
        navigateForward();
      }

      setIsLoading(false);

      return;
    }

    setError({ status: true, message: "You need to select a prefund!" });
    notify({
      title: "Error",
      color: "danger",
      description: "You need to select a prefund!",
    });
    setIsLoading(false);
  }

  useEffect(() => {
    updatePaymentFields({ prefundID: selectedKeys.values().next().value });
  }, [selectedKeys]);

  return (
    <>
      <div className="mt-4 flex h-full w-full flex-col gap-5">
        <PrefundsTable
          emptyDescriptionText={
            "You have no active prefunds available at this moment"
          }
          emptyTitleText={"Unavailable Prefunds"}
          removeWrapper={true}
          rows={walletActivePrefunds}
          selectedKeys={selectedKeys}
          selectionBehavior={"multiple"}
          setSelectedKeys={setSelectedKeys}
        />
        {error?.status && (
          <div className="mx-auto flex w-full flex-col items-center justify-center gap-4">
            <StatusMessage error={error?.status} message={error?.message} />
          </div>
        )}

        <div className="mt-auto flex w-full items-end justify-end gap-4">
          <Button
            isDisabled={isLoading || selectedKeys.size === 0}
            isLoading={isLoading}
            size="lg"
            onClick={handleProceed}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default SelectPrefund;
