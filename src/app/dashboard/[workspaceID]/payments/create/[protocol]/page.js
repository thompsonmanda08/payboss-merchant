import { Suspense } from "react";

import LoadingPage from "@/app/loading";
import { getWalletPrefunds } from "@/app/_actions/workspace-actions";

import BulkPaymentAction from "./BulkPaymentAction";

async function CreatePayment(props) {
  const params = await props.params;
  const { workspaceID, protocol } = params;

  const activePrefunds = await getWalletPrefunds(workspaceID);

  return (
    <Suspense fallback={<LoadingPage />}>
      <BulkPaymentAction
        activePrefunds={activePrefunds?.data?.data || []}
        protocol={protocol}
        workspaceID={workspaceID}
      />
    </Suspense>
  );
}

export default CreatePayment;
