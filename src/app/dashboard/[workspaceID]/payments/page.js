import { Suspense } from "react";

import LoadingPage from "@/app/loading";
import { getAllBulkTransactions } from "@/app/_actions/transaction-actions";
import { getWorkspaceSession } from "@/app/_actions/config-actions";

import DisbursementsWrapper from "./components";

export default async function DisbursementsPage(props) {
  const params = await props.params;
  const { workspaceID } = params;
  // const bulkTransactions = await getAllBulkTransactions(workspaceID);

  const [bulkTransactions, workspaceSession] = await Promise.all([
    getAllBulkTransactions(workspaceID),
    getWorkspaceSession(),
  ]);

  return (
    <Suspense fallback={<LoadingPage />}>
      <DisbursementsWrapper
        bulkTransactions={bulkTransactions?.data?.batches || []}
        workspaceID={workspaceID}
        workspaceSession={workspaceSession}
      />
    </Suspense>
  );
}
