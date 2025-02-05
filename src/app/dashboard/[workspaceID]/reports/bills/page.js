import LoadingPage from "@/app/loading";
import React, { Suspense } from "react";
import BillPaymentReports from "./BillPaymentReports";

export default async function BillPaymentReportsPage(props) {
  const params = await props.params;
  const { workspaceID } = params;
  return (
    <Suspense fallback={<LoadingPage />}>
      <BillPaymentReports workspaceID={workspaceID} />
    </Suspense>
  );
}
