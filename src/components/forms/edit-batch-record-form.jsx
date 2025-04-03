"use client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Input } from "@/components/ui/input-field";
import usePaymentsStore from "@/context/payment-store";
import { QUERY_KEYS } from "@/lib/constants";

import { Button } from "../ui/button";
import StatusMessage from "../base/status-message";

export default function EditBatchRecordForm({ onClose }) {
  const {
    updateSelectedRecord,
    selectedRecord,
    loading,
    setLoading,
    saveSelectedRecord,
    error,
    setError,
  } = usePaymentsStore();
  const queryClient = useQueryClient();

  async function onSubmit(e) {
    e.preventDefault();
    updateSelectedRecord({ remarks: "Record Modified", edited: true });
    setLoading(true);
    const response = await saveSelectedRecord();

    if (response?.success) {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS?.BATCH_DETAILS, selectedRecord?.batchID],
      });
      onClose();
    }
  }

  useEffect(() => {
    setError({ status: false, message: "" });
  }, [selectedRecord]);

  return (
    <form action="#" className="flex flex-col gap-2" onSubmit={onSubmit}>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <Input
          required
          autoComplete="given-name"
          label="First Name"
          name="first_name"
          type="text"
          value={selectedRecord?.first_name}
          onChange={(e) => updateSelectedRecord({ first_name: e.target.value })}
        />
        <Input
          required
          autoComplete="family-name"
          label="Last Name"
          name="last_name"
          type="text"
          value={selectedRecord?.last_name}
          onChange={(e) => updateSelectedRecord({ last_name: e.target.value })}
        />
      </div>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <Input
          required
          autoComplete="email"
          label="Email"
          name="email"
          type="email"
          value={selectedRecord?.email}
          onChange={(e) => updateSelectedRecord({ email: e.target.value })}
        />
        <Input
          required
          autoComplete="tel"
          label="Mobile No"
          name="contact"
          type="tel"
          value={selectedRecord?.contact}
          onChange={(e) => updateSelectedRecord({ contact: e.target.value })}
        />
      </div>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <Input
          required
          autoComplete="nrc"
          label="NRC"
          name="nrc"
          type="text"
          value={selectedRecord?.nrc}
          onChange={(e) => updateSelectedRecord({ nrc: e.target.value })}
        />
      </div>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <Input
          required
          autoComplete="account_number"
          label="Destination Account No."
          name="destination"
          type="text"
          value={selectedRecord?.destination}
          onChange={(e) =>
            updateSelectedRecord({ destination: e.target.value })
          }
        />
        <Input
          isDisabled
          required
          autoComplete="amount"
          label="Amount"
          name="amount"
          type="text"
          value={selectedRecord?.amount}
          onChange={(e) => updateSelectedRecord({ amount: e.target.value })}
        />
      </div>

      {error?.status && (
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-4">
          <StatusMessage error={error.status} message={error.message} />
        </div>
      )}

      <div className="mt-4 flex w-full flex-col gap-4 md:justify-end">
        <Button
          aria-label="save"
          color="primary"
          isDisabled={loading}
          isLoading={loading}
          type={"submit"}
          className="w-full  "
          // onClick={saveSelectedRecord}
        >
          Save Changes
        </Button>
        <Button
          aria-label="back"
          className={"w-full bg-red-50"}
          color="danger"
          disabled={loading}
          variant="light"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
