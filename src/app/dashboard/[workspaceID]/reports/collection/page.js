import { Suspense } from "react";

import LoadingPage from "@/app/loading";

import CollectionsReports from "./collection-reports";

export default async function CollectionsReportsPage(props) {
  const params = await props.params;
  const { workspaceID } = params;

  return (
    <Suspense fallback={<LoadingPage />}>
      <CollectionsReports workspaceID={workspaceID} />
    </Suspense>
  );
}
