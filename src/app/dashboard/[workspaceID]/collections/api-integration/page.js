import LoadingPage from "@/app/loading";
import React, { Suspense } from "react";
import APIIntegration from "@/app/dashboard/[workspaceID]/collections/api-integration/api-collections";
import { initializeWorkspace } from "@/app/_actions/workspace-actions";

export default async function APIIntergrationCollectionsPage(props) {
  const params = await props.params;
  const { workspaceID } = params;

  return (
    <Suspense fallback={<LoadingPage />}>
      <APIIntegration workspaceID={workspaceID} />
    </Suspense>
  );
}
