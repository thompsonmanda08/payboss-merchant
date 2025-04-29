import WorkspaceSettings from "@/app/dashboard/[workspaceID]/workspace-settings/components";
import { getAllUsers } from "@/app/_actions/user-actions";
import { getWorkspaceMembers } from "@/app/_actions/workspace-actions";
import {
  getUserAccountRoles,
  getWorkspaceDetails,
  getWorkspaceRoles,
} from "@/app/_actions/merchant-actions";
import { getWorkspaceSession } from "@/app/_actions/config-actions";
import { getWalletPrefundHistory } from "@/app/_actions/transaction-actions";

export const dynamic = "force-dynamic";

export default async function ManageWorkspacePage({ params }) {
  const workspaceID = (await params).workspaceID;

  const [
    workspaceSession,
    allUsersData,
    workspaceRolesResponse,
    systemRolesResponse,
    workspaceResponse,
    workspaceMembers,
    walletHistory,
  ] = await Promise.all([
    getWorkspaceSession(),
    getAllUsers(),
    getWorkspaceRoles(),
    getUserAccountRoles(),
    getWorkspaceDetails(workspaceID),
    getWorkspaceMembers(workspaceID),
    getWalletPrefundHistory(workspaceID),
  ]);

  return (
    <>
      <WorkspaceSettings
        allUsers={allUsersData?.data?.users}
        permissions={workspaceSession?.workspacePermissions}
        selectedWorkspace={workspaceResponse?.data || {}}
        systemRoles={systemRolesResponse?.data?.system_roles}
        walletHistory={walletHistory?.data?.data}
        workspaceID={workspaceID}
        workspaceMembers={workspaceMembers?.data?.users}
        workspaceRoles={workspaceRolesResponse?.data?.workspace_role}
      />
    </>
  );
}
