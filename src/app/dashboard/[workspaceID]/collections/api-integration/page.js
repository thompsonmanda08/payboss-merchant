import { Suspense } from "react";

import LoadingPage from "@/app/loading";
import APIIntegration from "@/app/dashboard/[workspaceID]/collections/api-integration/api-collections";

export default async function APIIntergrationCollectionsPage(props) {
  const params = await props.params;
  const { workspaceID } = params;

  return (
    <Suspense fallback={<LoadingPage />}>
      <APIIntegration workspaceID={workspaceID} />
    </Suspense>
  );
}
