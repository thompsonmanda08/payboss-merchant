import { Suspense } from "react";

import LoadingPage from "@/app/loading";
import WorkspaceSettings from "@/app/dashboard/[workspaceID]/workspace-settings/components";
import { getAllUsers } from "@/app/_actions/user-actions";
import { getWorkspaceMembers } from "@/app/_actions/workspace-actions";
import {
  getWorkspaceDetails,
  getWorkspaceRoles,
} from "@/app/_actions/merchant-actions";
import {
  getUserDetails,
  getWorkspaceSession,
} from "@/app/_actions/config-actions";

export default async function ManageWorkspacePage({ params }) {
  const workspaceID = (await params).workspaceID;

  const workspaceResponse = await getWorkspaceDetails();

  const allUsersData = await getAllUsers();

  const workspaceRolesResponse = await getWorkspaceRoles();

  const workspaceSession = await getWorkspaceSession();

  const workspaceMembers = await getWorkspaceMembers(workspaceID);

  return (
    <Suspense fallback={<LoadingPage />}>
      <WorkspaceSettings
        allUsers={allUsersData?.data?.users}
        permissions={workspaceSession?.workspacePermissions}
        selectedWorkspace={workspaceResponse?.data || {}}
        workspaceID={workspaceID}
        workspaceMembers={workspaceMembers?.data?.users}
        workspaceRoles={workspaceRolesResponse?.data?.workspace_role}
      />
    </Suspense>
  );
}
