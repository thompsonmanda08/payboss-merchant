'use client'
import Tabs from '@/components/elements/Tabs'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import React, { useState } from 'react'
import Search from '@/components/ui/Search'
import { Input } from '@/components/ui/InputField'
import { SingleSelectionDropdown } from '@/components/ui/DropdownButton'
import { Button } from '@/components/ui/Button'
import UsersTable from '../tables/UsersTable'
import CreateNewUserModal from './CreateNewUserModal'
import { cn } from '@/lib/utils'
import { useDisclosure } from '@nextui-org/react'
import { PlusIcon } from '@heroicons/react/24/outline'
import useNavigation from '@/hooks/useNavigation'
import useAllUsersAndRoles from '@/hooks/useAllUsersAndRoles'
import useWorkspaceStore from '@/context/workspaceStore'

export const ROLES = [
  {
    key: 'admin',
    id: 'admin',
    label: 'Admin',
    description:
      'Manage people, payments, billing and other workspace settings.',
  },
  {
    key: 'approver',
    id: 'approver',
    label: 'Approver',
    description: 'Track and approve transactions a workspace.',
  },
  {
    id: 'initiator',
    key: 'initiator',
    label: 'Initiator',
    description: 'Initate transactions in a workspace',
  },

  {
    id: 'viewer',
    key: 'viewer',
    label: 'Viewer',
    description: 'View-only access is granted',
  },
]

export const SYSTEM_ROLES = [
  {
    key: 'admin',
    id: 'admin',
    label: 'Admin',
    description:
      'Manage people, payments, billing and other workspace settings.',
  },
  {
    id: 'viewer',
    key: 'viewer',
    label: 'Viewer',
    description: 'View-only access is granted',
  },
]

function ManagePeople({ classNames }) {
  const { wrapper } = classNames || ''
  // const { isEditingRole } = useWorkspaceStore()
  // const [searchQuery, setSearchQuery] = useState('')
  // const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    canCreateUsers,
    allUsers,
    isAdminOrOwner,
    accountRoles,
    isLoading,
    isApprovedUser,
  } = useAllUsersAndRoles()
  // const { isAccountLevelSettingsRoute, isUserInWorkspace } = useNavigation()

  // const userSearchResults = allUsers?.filter((user) => {
  //   return (
  //     user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     user?.name.toLowerCase().includes(searchQuery.toLowerCase())
  //   )
  // })

  // function resolveAddToWorkspace(e) {
  //   e.preventDefault()
  //   if (onAdd) return onAdd()
  // }

  const allowUserCreation = canCreateUsers && isApprovedUser

  // const TABS = [{ name: 'All Users', index: 0 }]

  // const { activeTab, navigateTo, currentTabIndex } = useCustomTabsHook([
  //   <UsersTable
  //     key={'all-users'}
  //     users={userSearchResults}
  //     accountRoles={accountRoles}
  //     isUserAdmin={isAdminOrOwner}
  //     tableLoading={isLoading}
  //     allowUserCreation={allowUserCreation}
  //     isApprovedUser={isApprovedUser}
  //   />,
  // ])

  return (
    <div className={cn('mx-auto flex w-full max-w-7xl flex-col', wrapper)}>
      <h2 className="heading-3 !font-bold tracking-tight text-gray-900 ">
        Manage People
      </h2>
      <p className=" mb-4 text-sm text-slate-600">
        Streamline the management of user accounts and their workspaces.
      </p>
      {/* <SearchOrInviteUsers
        setSearchQuery={setSearchQuery}
        resolveAddToWorkspace={resolveAddToWorkspace}
      /> */}
      {/* <div className="flex w-full items-center justify-between gap-8">
        <Tabs
          tabs={TABS}
          className={'w-full flex-1'}
          navigateTo={navigateTo}
          currentTab={currentTabIndex}
        />
      </div> */}
      {/* <div className="mb-4"></div>
      {activeTab} */}
      <UsersTable
        key={'all-users'}
        users={allUsers}
        accountRoles={accountRoles}
        isUserAdmin={isAdminOrOwner}
        tableLoading={isLoading}
        allowUserCreation={allowUserCreation}
        isApprovedUser={isApprovedUser}
      />
    </div>
  )
}

export default ManagePeople
