import LoadingPage from "@/app/loading";
import React, { Suspense } from "react";
import WorkspaceSummary from "./WorkspaceSummary";
import { getAllWorkspaces } from "@/app/_actions/config-actions";

async function WorkSpaceIDPage(props) {
  const params = await props.params;

  const workspacesResponse = await getAllWorkspaces();
  const workspaces = workspacesResponse?.data?.workspaces || [];

  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="flex w-full flex-col gap-8">
        <WorkspaceSummary workspaceID={params.ID} workspaces={workspaces} />
      </div>
    </Suspense>
  );
}

export default WorkSpaceIDPage;
