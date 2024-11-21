import LoadingPage from "@/app/loading";
import React, { Suspense } from "react";
import WorkspaceSummary from "./WorkspaceSummary";
import {
  getAllWorkspaces,
  getWorkspaceRoles,
} from "@/app/_actions/config-actions";
import { getAllUsers } from "@/app/_actions/user-actions";
import { getWorkspaceMembers } from "@/app/_actions/workspace-actions";

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
          workspaceID={workspaceID}
          workspaces={workspaces}
          allUsers={allUsersData?.data?.users}
          workspaceMembers={workspaceMembers?.data?.users}
          workspaceRoles={workspaceRoleData?.data?.roles}
        />
      </div>
    </Suspense>
  );
}

export default WorkSpaceIDPage;
