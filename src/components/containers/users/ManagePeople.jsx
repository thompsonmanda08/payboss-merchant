'use client'
import { Tabs } from '@/components/base'
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
  const { isEditingRole } = useWorkspaceStore()
  const [searchQuery, setSearchQuery] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { canCreateUsers, allUsers } = useAllUsersAndRoles()
  const { isAccountLevelSettingsRoute, isUserInWorkspace } = useNavigation()

  const userSearchResults = allUsers?.filter((user) => {
    return (
      user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  function resolveAddToWorkspace(e) {
    e.preventDefault()
    if (onAdd) return onAdd()
  }

  const allowUserCreation = canCreateUsers && !isUserInWorkspace

  const TABS = [{ name: 'All Users', index: 0 }]

  const { activeTab, navigateTo, currentTabIndex } = useCustomTabsHook([
    <UsersTable
      key={'all-users'}
      users={userSearchResults}
      isOwner={allowUserCreation}
    />,
  ])

  return (
    <div className={cn('mx-auto flex w-full max-w-7xl flex-col', wrapper)}>
      <h2 className="heading-3 !font-bold tracking-tight text-gray-900 ">
        Manage People
      </h2>
      <p className=" text-sm text-slate-600">
        Streamline the management of user accounts and their workspaces.
      </p>

      {/* <SearchOrInviteUsers
        setSearchQuery={setSearchQuery}
        resolveAddToWorkspace={resolveAddToWorkspace}
      /> */}

      <div className="flex items-center justify-between gap-8 ">
        <Tabs
          tabs={TABS}
          navigateTo={navigateTo}
          currentTab={currentTabIndex}
        />
        {allowUserCreation && (
          <Button
            endContent={<PlusIcon className=" h-5 w-5" />}
            onPress={onOpen}
          >
            New User
          </Button>
        )}
      </div>
      <div className="mb-4"></div>
      {activeTab}

      {/* MODALS */}
      <CreateNewUserModal isOpen={isEditingRole || isOpen} onClose={onClose} />
    </div>
  )
}

export function SearchOrInviteUsers({ setSearchQuery, resolveAddToWorkspace }) {
  const [selectedKeys, setSelectedKeys] = useState(
    new Set([ROLES.map((role) => role.label)[0]]),
  )

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(', ').replaceAll('_', ' '),
    [selectedKeys],
  )
  return (
    <div className="relative flex min-h-20 w-full flex-col justify-between gap-4 py-8 md:flex-row">
      {/*  USER SEARCH */}
      <Search
        onChange={(e) => {
          setSearchQuery(e.target.value)
        }}
      />

      {/******** ADD USER TO WORKSPACE ************/}

      <form
        onSubmit={resolveAddToWorkspace}
        className={'group relative flex h-fit w-full flex-grow-0 justify-end'}
      >
        <Input
          className={
            'h h-12 w-full max-w-lg rounded-r-none text-base placeholder:text-sm placeholder:font-normal placeholder:text-slate-400'
          }
          placeholder={'Invite users to workspace...'}
          // value={value}
          // onChange={onChange}
        />
        <SingleSelectionDropdown
          className={'max-w-[280px]'}
          classNames={{
            chevronIcon: 'text-slate-500',
            dropdownItem: 'w-[260px]',
            trigger:
              'rounded-none border-px h-auto border border-input bg-transparent p-2 px-3 min-w-[110px]',
          }}
          dropdownItems={ROLES}
          selectedKeys={selectedKeys}
          selectedValue={selectedValue}
          setSelectedKeys={setSelectedKeys}
        />

        <Button type="submit" className={'h-12 rounded-l-none px-8'}>
          Invite
        </Button>
      </form>
    </div>
  )
}

export default ManagePeople
