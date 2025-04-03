import { Suspense } from "react";

import LoadingPage from "@/app/loading";

import TillPaymentCollections from "./till-collections";

export default async function TillPaymentCollectionsPage(props) {
  const params = await props.params;

  return (
    <Suspense fallback={<LoadingPage />}>
      <TillPaymentCollections workspaceID={params.workspaceID} />
    </Suspense>
  );
}
