'use client'
import CardHeader from '@/components/base/CardHeader'
import useDashboard from '@/hooks/useDashboard'
import React, { useState } from 'react'
import UsersTable from '../tables/UsersTable'
import { usePathname } from 'next/navigation'

export default function WorkspaceMembers({
  workspaceID,
  workspaceUsers,
  isLoading,
}) {
  const [searchQuery, setSearchQuery] = useState('')

  const { workspaceUserRole } = useDashboard()
  const pathname = usePathname()
  const isUsersRoute = pathname == '/manage-account/users'

  const canUpdate = workspaceUserRole?.role?.toLowerCase() == 'admin'
  const isAdmin =
    (isUsersRoute && isAdminOrOwner) || (!isUsersRoute && canUpdate)

  const userSearchResults = workspaceUsers?.filter((user) => {
    return (
      user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

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
        users={userSearchResults}
        workspaceID={workspaceID}
        isUserAdmin={isAdmin}
        tableLoading={isLoading}
        removeWrapper
      />
      ,
    </div>
  )
}
