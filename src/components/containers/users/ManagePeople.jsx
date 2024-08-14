'use client'
import { Tabs } from '@/components/base'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import React, { useState } from 'react'

import Search from '@/components/ui/Search'
import { Input } from '@/components/ui/InputField'
import { SingleSelectionDropdown } from '@/components/ui/DropdownButton'
import { Button } from '@/components/ui/Button'
import { USERS } from '@/app/dashboard/[workspaceID]/data/sampleData'
import UsersTable from './UsersTable'
import CreateNewUserModal from './CreateNewUserModal'
import { cn } from '@/lib/utils'
import { useDisclosure } from '@nextui-org/react'
import { PlusIcon } from '@heroicons/react/24/outline'
import useNavigation from '@/hooks/useNavigation'
import useAccountProfile from '@/hooks/useProfileDetails'
import useAllUsersAndRoles from '@/hooks/useAllUsersAndRoles'

export const ROLES = [
  {
    id: 'member',
    key: 'member',
    label: 'Member',
    description: 'Access to workspaces, documents and dashboards',
  },
  {
    id: 'guest',
    key: 'guest',
    label: 'Guest',
    description:
      'Can not be added to other workspaces by admin. View-only access is granted',
  },
  {
    key: 'admin',
    id: 'admin',
    label: 'Admin',
    description:
      'Manage people, payments, billing and other workspace settings.',
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
    id: 'guest',
    key: 'guest',
    label: 'Guest',
    description:
      'Can not be added to other workspaces by admin. View-only access is granted',
  },
]

function ManagePeople({ classNames }) {
  const { accountRoles, workspaceRoles, allUsers } = useAllUsersAndRoles()
  const [openCreateUserModal, setOpenCreateUserModal] = useState(false)
  const { wrapper } = classNames || ''
  const [searchQuery, setSearchQuery] = useState('')
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { isOwner, isAccountAdmin } = useAccountProfile()
  const { isAccountLevelSettingsRoute, isUserInWorkspace } = useNavigation()

  const [selectedKeys, setSelectedKeys] = useState(
    new Set([ROLES.map((role) => role.label)[0]]),
  )

  const userSearchResults = allUsers?.filter((user) => {
    return (
      user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(', ').replaceAll('_', ' '),
    [selectedKeys],
  )

  function resolveAddToWorkspace(e) {
    e.preventDefault()
    if (onAdd) return onAdd()
  }

  // ***** COMPONENT RENDERER ************** //

  const TABS = !isAccountLevelSettingsRoute
    ? [
        { name: 'Workspace Members', index: 0 },
        { name: 'Workspace Guests', index: 1 },
      ]
    : [
        { name: 'All Users', index: 0 },
        { name: 'Workspace Members', index: 1 },
        { name: 'Guests', index: 2 },
      ]

  const COMPONENT_RENDERER = !isAccountLevelSettingsRoute
    ? [
        <UsersTable key={'members'} users={userSearchResults} />,
        <UsersTable key={'internal-guests'} users={userSearchResults} />,
      ]
    : [
        <UsersTable key={'all-users'} users={userSearchResults} />,
        <UsersTable key={'members'} users={userSearchResults} />,
        <UsersTable key={'guests'} users={userSearchResults} />,
      ]

  const { activeTab, navigateTo, currentTabIndex } =
    useCustomTabsHook(COMPONENT_RENDERER)

  const allowUserCreation = (isOwner || isAccountAdmin) && !isUserInWorkspace

  return (
    <div className={cn('mx-auto flex w-full max-w-7xl flex-col', wrapper)}>
      <h2 className="heading-3 !font-bold tracking-tight text-gray-900 ">
        Manage People
      </h2>
      <p className=" text-sm text-slate-600">
        Streamline the management of user accounts and their workspaces.
      </p>

      <SearchOrInviteUsers
        selectedKeys={selectedKeys}
        selectedValue={selectedValue}
        setSelectedKeys={setSelectedKeys}
        setSearchQuery={setSearchQuery}
        resolveAddToWorkspace={resolveAddToWorkspace}
      />

      <div className="flex items-center justify-between gap-8 ">
        <Tabs
          tabs={TABS}
          navigateTo={navigateTo}
          currentTab={currentTabIndex}
        />
        {allowUserCreation && (
          <Button
            startContent={<PlusIcon className=" h-6 w-6" />}
            onPress={onOpen}
          >
            Create New User
          </Button>
        )}
      </div>
      <div className="mb-4"></div>
      {activeTab}

      {/* MODALS */}
      {isOpen && (
        <CreateNewUserModal isOpen={isOpen} onOpenChange={onOpenChange} />
      )}
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
            trigger: 'rounded-none',
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
