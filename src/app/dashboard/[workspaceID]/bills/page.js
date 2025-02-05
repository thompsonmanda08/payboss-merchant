import LoadingPage from "@/app/loading";
import React, { Suspense } from "react";
import BillPayments from "./bill-payments";

export default async function BillPaymentsPage(props) {
  const params = await props.params;
  const { workspaceID } = params;

  return (
    <Suspense fallback={<LoadingPage />}>
      <BillPayments workspaceID={workspaceID} />
    </Suspense>
  );
}
