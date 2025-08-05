"use client";
import { useDisclosure } from "@heroui/react";

import CardHeader from "@/components/base/card-header";
import UsersTable from "@/components/tables/users-table";
import AddUserToWorkspace from "@/components/modals/add-users-workspace-modal";
import { useWorkspaceInit } from "@/hooks/use-query-data";

export default function WorkspaceMembers({
  workspaceID,
  isLoading,
  workspaceName,
  allUsers,
  workspaceMembers,
  workspaceRoles,
  systemRoles,
}: {
  workspaceID: string;
  isLoading?: boolean;
  workspaceName: string;
  allUsers: any[];
  workspaceMembers?: any[];
  workspaceRoles?: any[];
  systemRoles?: any[];
}) {
  const {
    isOpen: openAdd,
    onOpen: onOpenAdd,
    onClose: onCloseAdd,
  } = useDisclosure();

  const { data: workspaceInit, isLoading: loadingSession } =
    useWorkspaceInit(workspaceID);
  const permissions = workspaceInit?.data?.workspacePermissions;

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
        workspaceRoles={workspaceRoles}
        systemRoles={systemRoles}
      />
      <AddUserToWorkspace
        allUsers={allUsers}
        // isLoading={isLoading}
        isOpen={openAdd}
        workspaceID={workspaceID}
        workspaceMembers={workspaceMembers}
        workspaceName={workspaceName}
        workspaceRoles={workspaceRoles}
        onClose={onCloseAdd}
        // onOpen={onOpenAdd}
      />
    </div>
  );
}
