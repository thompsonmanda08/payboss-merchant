import { Suspense } from "react";

import LoadingPage from "@/app/loading";

import DisbursementReports from "./disbursements-reports";

export default async function DisbursementReportsPage(props) {
  const params = await props.params;
  const { workspaceID } = params;

  return (
    <Suspense fallback={<LoadingPage />}>
      <DisbursementReports workspaceID={workspaceID} />
    </Suspense>
  );
}
