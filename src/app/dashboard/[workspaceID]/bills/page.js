import { Suspense } from "react";

import LoadingPage from "@/app/loading";

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
