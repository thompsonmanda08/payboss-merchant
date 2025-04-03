import { Suspense } from "react";

import LoadingPage from "@/app/loading";
import { getUserDetails } from "@/app/_actions/config-actions";

import CheckoutAndInvoicing from "./invoicing";

export default async function CheckoutAndInvoicingPage(props) {
  const params = await props.params;
  const session = await getUserDetails();

  return (
    <Suspense fallback={<LoadingPage />}>
      <CheckoutAndInvoicing
        permissions={session?.userPermissions}
        workspaceID={params.workspaceID}
      />
    </Suspense>
  );
}
