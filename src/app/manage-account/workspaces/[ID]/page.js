import { getAllUsers } from "@/app/_actions/user-actions";
import { getWorkspaceMembers } from "@/app/_actions/workspace-actions";
import {
  getAllWorkspaces,
  getWorkspaceRoles,
} from "@/app/_actions/merchant-actions";

import WorkspaceSummary from "./workspace-summary-details";

async function WorkSpaceIDPage({ params }) {
  const workspaceID = (await params).ID;

  // Parallelize data fetching
  const [
    workspacesResponse, // ALL WORKSPACES
    allUsersData, // ALL USERS
    workspaceRoleData, // WORKSPACE ROLES
    workspaceMembers, // WORKSPACE USER MEMBERS
  ] = await Promise.all([
    getAllWorkspaces(),
    getAllUsers(),
    getWorkspaceRoles(),
    getWorkspaceMembers(workspaceID),
  ]);

  const workspaces = workspacesResponse?.data?.workspaces || [];
  const selectedWorkspace = workspaces.find((w) => w.ID === workspaceID);

  return (
    <div className="flex w-full flex-col gap-8">
      <WorkspaceSummary
        allUsers={allUsersData?.data?.users}
        selectedWorkspace={selectedWorkspace}
        workspaceID={workspaceID}
        workspaceMembers={workspaceMembers?.data?.users}
        workspaceRoles={workspaceRoleData?.data?.roles}
      />
    </div>
  );
}

export default WorkSpaceIDPage;
