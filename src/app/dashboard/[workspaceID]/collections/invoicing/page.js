import { Suspense } from "react";

import LoadingPage from "@/app/loading";
import { getUserDetails } from "@/app/_actions/config-actions";

import Invoicing from "./invoicing";

export default async function CheckoutAndInvoicingPage(props) {
  const params = await props.params;
  const workspaceID = params.workspaceID;

  const session = await getUserDetails();

  // const response = getLatestINvoices(params.workspaceID);

  return (
    <Suspense fallback={<LoadingPage />}>
      <Invoicing
        permissions={session?.userPermissions}
        workspaceID={workspaceID}
      />
    </Suspense>
  );
}
