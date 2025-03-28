import LoadingPage from "@/app/loading";
import React, { Suspense } from "react";
import {
  getAllWorkspaces,
  getUserDetails,
  getWorkspaceRoles,
} from "@/app/_actions/config-actions";
import WorkspaceSettings from "@/app/dashboard/[workspaceID]/workspace-settings/components";
import { getAllUsers } from "@/app/_actions/user-actions";
import { getWorkspaceMembers } from "@/app/_actions/workspace-actions";

export default async function ManageWorkspacePage({ params }) {
  const workspaceID = (await params).workspaceID;

  const workspacesResponse = await getAllWorkspaces();
  const workspaces = workspacesResponse?.data?.workspaces || [];
  const activeWorkspace = await workspaces?.find(
    (workspace) => workspace?.ID == workspaceID
  );

  const allUsersData = await getAllUsers();
  const workspaceMembers = await getWorkspaceMembers(workspaceID);
  const workspaceRoleData = await getWorkspaceRoles();

  const session = await getUserDetails();
  const user = session?.user;
  const kyc = session?.kyc;

  const permissions = {
    isOwner: session?.user?.role?.toLowerCase() == "owner",
    isAccountAdmin: session?.user?.role?.toLowerCase() == "admin",
    isApprovedUser:
      kyc?.stageID == 3 &&
      user?.isCompleteKYC &&
      kyc?.kyc_approval_status?.toLowerCase() == "approved",
    ...session?.userPermissions,
  };

  return (
    <Suspense fallback={<LoadingPage />}>
      <WorkspaceSettings
        workspaceID={workspaceID}
        selectedWorkspace={activeWorkspace}
        allUsers={allUsersData?.data?.users}
        workspaceMembers={workspaceMembers?.data?.users}
        workspaceRoles={workspaceRoleData?.data?.roles}
        permissions={permissions}
      />
    </Suspense>
  );
}
