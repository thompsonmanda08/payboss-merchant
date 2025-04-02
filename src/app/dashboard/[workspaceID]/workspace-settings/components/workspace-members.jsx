"use client";
import CardHeader from "@/components/base/card-header";
import useDashboard from "@/hooks/useDashboard";
import React from "react";
import { useDisclosure } from "@heroui/react";
import UsersTable from "@/components/tables/users-table";
import AddUserToWorkspace from "@/components/add-users-workspace-modal";

export default function WorkspaceMembers({
  workspaceID,
  isLoading,
  workspaceName,
  allUsers,
  workspaceMembers,
  workspaceRoles,
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
        title={"Workspace Members"}
        infoText={
          "User who are part of the workspace, can be given roles to perform actions"
        }
      />
      <UsersTable
        users={workspaceMembers}
        workspaceID={workspaceID}
        isUserAdmin={canUpdate}
        tableLoading={isLoading}
        onAddUser={onOpenAdd}
        removeWrapper
      />
      <AddUserToWorkspace
        isOpen={openAdd}
        onOpen={onOpenAdd}
        onClose={onCloseAdd}
        workspaceID={workspaceID}
        workspaceName={workspaceName}
        isLoading={isLoading}
        workspaceMembers={workspaceMembers}
        workspaceRoles={workspaceRoles}
        allUsers={allUsers}
      />
    </div>
  );
}
