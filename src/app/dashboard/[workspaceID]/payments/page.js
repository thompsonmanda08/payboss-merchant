import LoadingPage from "@/app/loading";
import React, { Suspense } from "react";
import { getAllBulkTransactions } from "@/app/_actions/transaction-actions";
import DisbursementsWrapper from "./components";

export default async function DisbursementsPage(props) {
  const params = await props.params;
  const { workspaceID } = params;
  const bulkTransactions = await getAllBulkTransactions(workspaceID);

  return (
    <Suspense fallback={<LoadingPage />}>
      <DisbursementsWrapper
        workspaceID={workspaceID}
        bulkTransactions={bulkTransactions?.data?.batches || []}
      />
    </Suspense>
  );
}
