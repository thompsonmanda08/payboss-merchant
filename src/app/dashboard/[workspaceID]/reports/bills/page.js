import { Suspense } from "react";

import LoadingPage from "@/app/loading";

import BillPaymentReports from "./bill-payments-report";

export default async function BillPaymentReportsPage(props) {
  const params = await props.params;
  const { workspaceID } = params;

  return (
    <Suspense fallback={<LoadingPage />}>
      <BillPaymentReports workspaceID={workspaceID} />
    </Suspense>
  );
}
