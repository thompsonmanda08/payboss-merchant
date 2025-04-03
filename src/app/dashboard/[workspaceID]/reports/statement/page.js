import { Suspense } from "react";

import LoadingPage from "@/app/loading";

import Statement from "./wallet-statements";

export default async function WalletStatementPage(props) {
  const params = await props.params;
  const { workspaceID } = params;

  return (
    <Suspense fallback={<LoadingPage />}>
      <Statement workspaceID={workspaceID} />
    </Suspense>
  );
}
