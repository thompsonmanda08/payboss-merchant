import { Suspense } from "react";

import LoadingPage from "@/app/loading";
import { getAllUsers } from "@/app/_actions/user-actions";
import { getWorkspaceMembers } from "@/app/_actions/workspace-actions";
import {
  getAllWorkspaces,
  getWorkspaceRoles,
} from "@/app/_actions/merchant-actions";

import WorkspaceSummary from "./workspace-summary-details";

async function WorkSpaceIDPage({ params }) {
  const workspaceID = (await params).ID;

  const workspacesResponse = await getAllWorkspaces();
  const workspaces = workspacesResponse?.data?.workspaces || [];

  const allUsersData = await getAllUsers();
  const workspaceMembers = await getWorkspaceMembers(workspaceID);
  const workspaceRoleData = await getWorkspaceRoles();

  return (
    <Suspense fallback={<LoadingPage loadingText="Initializing Workspace.." />}>
      <div className="flex w-full flex-col gap-8">
        <WorkspaceSummary
          allUsers={allUsersData?.data?.users}
          workspaceID={workspaceID}
          workspaceMembers={workspaceMembers?.data?.users}
          workspaceRoles={workspaceRoleData?.data?.roles}
          workspaces={workspaces}
        />
      </div>
    </Suspense>
  );
}

export default WorkSpaceIDPage;
