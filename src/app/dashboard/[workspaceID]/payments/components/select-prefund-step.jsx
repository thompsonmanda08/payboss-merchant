"use client";

import React from "react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import usePaymentsStore from "@/context/payment-store";
import { notify } from "@/lib/utils";
import PrefundsTable from "@/components/tables/prefunds-table";
import { Alert } from "@heroui/react";
import { useActivePrefunds } from "@/hooks/useQueryHooks";

const SelectPrefund = ({
  navigateForward,
  workspaceID,

  protocol,
}) => {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const { data: prefunds, isLoading } = useActivePrefunds(workspaceID);
  const walletActivePrefunds = prefunds?.data?.data || [];

  const { paymentAction, updatePaymentFields, error, setError } =
    usePaymentsStore();

  function handleProceed() {
    if (paymentAction?.prefund_id !== "" || selectedKeys.size !== 0) {
      let prefund = walletActivePrefunds.find(
        (prefund) => prefund.ID === paymentAction?.prefund_id,
      );

      if (prefund) {
        updatePaymentFields({ prefund, protocol });
        navigateForward();
      }
      return;
    }

    setError({ status: true, message: "You need to select a prefund!" });
    notify({
      title: "Error",
      color: "danger",
      description: "You need to select a prefund!",
    });
  }

  useEffect(() => {
    updatePaymentFields({ prefund_id: selectedKeys.values().next().value });
  }, [selectedKeys]);

  return (
    <>
      <div className="mt-4 flex h-full w-full flex-col gap-5">
        <PrefundsTable
          emptyDescriptionText={
            "You have no active prefunds available at this moment"
          }
          emptyTitleText={"Unavailable Prefunds"}
          removeWrapper
          isLoading={isLoading}
          rows={walletActivePrefunds}
          selectedKeys={selectedKeys}
          selectionBehavior={"multiple"}
          setSelectedKeys={setSelectedKeys}
        />
        {error?.status && (
          <Alert
            color="danger"
            classNames={{
              base: "items-center",
            }}
          >
            {error.message}
          </Alert>
        )}

        <div className="mt-auto flex w-full items-end justify-end gap-4">
          <Button
            isDisabled={isLoading || selectedKeys.size === 0}
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
