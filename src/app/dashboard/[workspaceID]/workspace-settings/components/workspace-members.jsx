"use client";
import { useDisclosure } from "@heroui/react";

import CardHeader from "@/components/base/card-header";
import useDashboard from "@/hooks/useDashboard";
import UsersTable from "@/components/tables/users-table";
import AddUserToWorkspace from "@/components/add-users-workspace-modal";

export default function WorkspaceMembers({
  workspaceID,
  isLoading,
  workspaceName,
  allUsers,
  workspaceMembers,
  workspaceRoles,
  permissions,
}) {
  const {
    isOpen: openAdd,
    onOpen: onOpenAdd,
    onClose: onCloseAdd,
  } = useDisclosure();
  const { workspaceUserRole } = useDashboard();

  const canUpdate = workspaceUserRole?.role?.toLowerCase() == "admin";

  return (
    <div>
      <CardHeader
        className={"mb-4"}
        infoText={
          "User who are part of the workspace, can be given roles to perform actions"
        }
        title={"Workspace Members"}
      />
      <UsersTable
        removeWrapper
        permissions={permissions}
        tableLoading={isLoading}
        users={workspaceMembers}
        workspaceID={workspaceID}
        onAddUser={onOpenAdd}
        roles={workspaceRoles}
      />
      <AddUserToWorkspace
        allUsers={allUsers}
        isLoading={isLoading}
        isOpen={openAdd}
        workspaceID={workspaceID}
        workspaceMembers={workspaceMembers}
        workspaceName={workspaceName}
        workspaceRoles={workspaceRoles}
        onClose={onCloseAdd}
        onOpen={onOpenAdd}
      />
    </div>
  );
}
