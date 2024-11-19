import LoadingPage from "@/app/loading";
import Workspaces from "@/components/containers/workspace/WorkspacesList";
import React, { Suspense } from "react";
import { getAllWorkspaces, getUserDetails } from "../_actions/config-actions";

async function AllWorkspacesPage() {
  const session = await getUserDetails();
  const workspacesResponse = await getAllWorkspaces();
  const workspaces = workspacesResponse?.data?.workspaces || [];

  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-col mb-4">
          <h2 className="heading-3 !font-bold tracking-tight text-foreground">
            Workspaces
          </h2>
          <p className="text-foreground-600 ">
            Workspaces provide a structured way to group and manage services,
            users, and transactions effectively.
          </p>
        </div>

        <Workspaces
          user={session?.user}
          workspaces={workspaces}
          className={"m-0 border-none bg-transparent p-0 shadow-none"}
        />
      </div>
    </Suspense>
  );
}

export default AllWorkspacesPage;
