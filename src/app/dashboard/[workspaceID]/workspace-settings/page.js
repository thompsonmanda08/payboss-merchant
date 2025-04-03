import { Suspense } from "react";

import LoadingPage from "@/app/loading";
import WorkspaceSettings from "@/app/dashboard/[workspaceID]/workspace-settings/components";
import { getAllUsers } from "@/app/_actions/user-actions";
import { getWorkspaceMembers } from "@/app/_actions/workspace-actions";
import {
  getWorkspaceDetails,
  getWorkspaceRoles,
} from "@/app/_actions/merchant-actions";
import { getUserDetails } from "@/app/_actions/config-actions";

export default async function ManageWorkspacePage({ params }) {
  const workspaceID = (await params).workspaceID;

  const workspaceResponse = await getWorkspaceDetails();
  const activeWorkspace = workspaceResponse?.data || {};

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
        allUsers={allUsersData?.data?.users}
        permissions={permissions}
        selectedWorkspace={activeWorkspace}
        workspaceID={workspaceID}
        workspaceMembers={workspaceMembers?.data?.users}
        workspaceRoles={workspaceRoleData?.data?.roles}
      />
    </Suspense>
  );
}
