import { Suspense } from "react";

import LoadingPage from "@/app/loading";
import APIIntegration from "@/app/dashboard/[workspaceID]/collections/api-integration/api-collections";
import { getWorkspaceSession } from "@/app/_actions/config-actions";

export default async function APIIntegrationCollectionsPage(props) {
  const params = await props.params;
  const { workspaceID } = params;

  const workspaceSession = await getWorkspaceSession();

  return (
    <Suspense fallback={<LoadingPage />}>
      <APIIntegration
        permissions={workspaceSession?.workspacePermissions}
        workspaceID={workspaceID}
      />
    </Suspense>
  );
}
