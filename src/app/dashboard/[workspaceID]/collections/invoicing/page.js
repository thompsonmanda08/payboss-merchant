import LoadingPage from "@/app/loading";
import React, { Suspense } from "react";
import CheckoutAndInvoicing from "./invoicing";
import { getUserDetails } from "@/app/_actions/config-actions";

export default async function CheckoutAndInvoicingPage(props) {
  const params = await props.params;
  const session = await getUserDetails();

  return (
    <Suspense fallback={<LoadingPage />}>
      <CheckoutAndInvoicing
        workspaceID={params.workspaceID}
        permissions={session?.userPermissions}
      />
    </Suspense>
  );
}
