'use client'
import { Tabs } from '@/components/base'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import React, { useState } from 'react'

import Search from '@/components/ui/Search'
import { Input } from '@/components/ui/input'
import { SingleSelectionDropdown } from '@/components/ui/DropdownButton'
import { Button } from '@/components/ui/Button'
import { USERS } from '@/app/dashboard/data/sampleData'
import UsersTable from './UsersTable'
import useSettingsStore from '@/context/settingsStore'
import CreateNewUserModal from './createNewUserModal'
import { useUserRoles } from '@/hooks/useQueryHooks'

const ROLES = [
  {
    key: 'member',
    label: 'Member',
    description: 'Access to workspaces, documents and dashboards',
  },
  {
    key: 'guest',
    label: 'Guest',
    description:
      'Can not be added to other workspaces by admin. View-only access is granted',
  },
  {
    key: 'admin',
    label: 'Admin',
    description:
      'Manage people, payments, billing and other workspace settings.',
  },
]

const allUsersTableHeadings = [
  { name: 'NAME', uid: 'name' },
  { name: 'TITLE', uid: 'title' },
  { name: 'ROLE', uid: 'role' },
  { name: 'ACTIONS', uid: 'actions' },
]

const TABS = [
  { name: 'All Users', href: '#', current: 0 }, // ONLY THE OWNER CAN SEE ALL USER
  { name: 'Workspace Members', href: '#', current: 1 },
  { name: 'Internal Guests', href: '#', current: 2 },
]

function ManagePeople() {
  const { data: rolesResponse } = useUserRoles()
  const [openCreateUserModal, setOpenCreateUserModal] = useState(false)

  console.log(rolesResponse)

  const [searchQuery, setSearchQuery] = useState('')

  const [selectedKeys, setSelectedKeys] = useState(
    new Set([ROLES.map((role) => role.label)[0]]),
  )

  const userSearchResults = USERS?.filter((user) => {
    return (
      user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(', ').replaceAll('_', ' '),
    [selectedKeys],
  )
  // console.log(selectedKeys)
  // console.log(selectedValue)

  function resolveAddToWorkspace(e) {
    e.preventDefault()
    if (onAdd) return onAdd()
  }

  function toggleCreateUserModal() {
    setOpenCreateUserModal(!openCreateUserModal)
  }

  // ***** COMPONENT RENDERER ************** //
  const { activeTab, navigateTo, currentTabIndex } = useCustomTabsHook([
    <UsersTable
      key={'all-users'}
      users={userSearchResults}
      columns={allUsersTableHeadings}
    />,
    <UsersTable
      key={'members'}
      users={userSearchResults}
      columns={allUsersTableHeadings}
    />,
    <UsersTable
      key={'internal-guests'}
      users={userSearchResults}
      columns={allUsersTableHeadings}
    />,
  ])

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col">
      <h2 className="heading-3 !font-bold tracking-tight text-gray-900 ">
        Manage People
      </h2>
      <p className=" text-sm text-slate-600">
        Streamline the management of user accounts and their workspaces.
      </p>

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

          <Button type="submit" className={'rounded-l-none px-8'}>
            Invite
          </Button>
        </form>
      </div>

      {/* 
      //TODO => A SEARCH FIELD FOR USERS
      //TODO => A FIELD TO INVITE USERS to WORKSPACE =REF: CLICK UP
      //TODO => A BUTTON TO CREATE NEW USER - ONLY FOR THE OWNER 
      */}
      <div className="flex items-center justify-between gap-8">
        <Tabs
          tabs={TABS}
          navigateTo={navigateTo}
          currentTab={currentTabIndex}
        />
        <Button onClick={toggleCreateUserModal}>Create New User</Button>
      </div>
      <div className="mb-4"></div>
      {activeTab}

      {/* MODALS */}
      {openCreateUserModal && (
        <CreateNewUserModal
          openCreateUserModal
          toggleCreateUserModal={toggleCreateUserModal}
        />
      )}
    </div>
  )
}

export default ManagePeople
