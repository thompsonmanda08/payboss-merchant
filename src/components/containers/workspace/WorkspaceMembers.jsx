'use client'
import CardHeader from '@/components/base/CardHeader'
import useDashboard from '@/hooks/useDashboard'
import React from 'react'
import UsersTable from '../tables/UsersTable'
import { useDisclosure } from '@nextui-org/react'
import AddUserToWorkspace from './AddUserToWorkspace'

export default function WorkspaceMembers({
  workspaceID,
  workspaceUsers,
  isLoading,
  workspaceName,
}) {
  const {
    isOpen: openAdd,
    onOpen: onOpenAdd,
    onClose: onCloseAdd,
  } = useDisclosure()
  const { workspaceUserRole } = useDashboard()

  const canUpdate = workspaceUserRole?.role?.toLowerCase() == 'admin'

  return (
    <div>
      <CardHeader
        className={'mb-4'}
        title={'Workspace Memebers'}
        infoText={
          'User who are part of the workspace, can be given roles to perform actions'
        }
      />
      <UsersTable
        users={workspaceUsers}
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
        workspaceUsers={workspaceUsers}
      />
    </div>
  )
}
