'use client'
import { Button } from '@/components/ui/Button'
import { notify } from '@/lib/utils'
import React, { useState } from 'react'
import { updateWorkspace } from '@/app/_actions/config-actions'
import { useQueryClient } from '@tanstack/react-query'
import { SETUP_QUERY_KEY } from '@/lib/constants'
import { usePathname, useRouter } from 'next/navigation'
import useConfigStore from '@/context/configStore'
import { Input } from '@/components/ui/InputField'
import { Tabs } from '@/components/base'
import UsersTable from '../users/UsersTable'
import WorkspaceDetails from './WorkspaceDetails'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import { USERS } from '@/app/dashboard/data/sampleData'
import {
  allUsersTableHeadings,
  SearchOrInviteUsers,
} from '../users/ManagePeople'
import CreateNewUserModal from '../users/CreateNewUserModal'
import { useDisclosure } from '@nextui-org/react'

const TABS = [
  { name: 'General', index: 0 }, // ONLY THE OWNER & ADMIN
  { name: 'Members', index: 1 },
]

const INITIAL_WORKSPACE = {
  workspace: '',
  description: '',
}

function WorkspaceSettings({ WorkSpaceID }) {
  const { push } = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  const workspaces = useConfigStore((state) => state?.workspaces)
  const selectedWorkspace = workspaces.find((item) => item.id === WorkSpaceID)

  const [searchQuery, setSearchQuery] = useState('')
  const [openCreateUserModal, setOpenCreateUserModal] = useState(false)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const userSearchResults = USERS?.filter((user) => {
    return (
      user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // ***** COMPONENT RENDERER ************** //
  const { activeTab, navigateTo, currentTabIndex } = useCustomTabsHook([
    <WorkspaceDetails
      key={'workspace-details'}
      users={userSearchResults}
      columns={allUsersTableHeadings}
      WorkSpaceID={WorkSpaceID}
    />,
    <UsersTable
      key={'members'}
      users={userSearchResults}
      columns={allUsersTableHeadings}
      WorkSpaceID={WorkSpaceID}
    />,
  ])

  const [workspace, setWorkspace] = useState(INITIAL_WORKSPACE)
  function editWorkspaceField(fields) {
    setWorkspace((prev) => {
      return { ...prev, ...fields }
    })
  }

  function toggleCreateUserModal() {
    setOpenCreateUserModal(!openCreateUserModal)
  }

  async function handleEditWorkspace() {
    setLoading(true)

    if (workspace.workspace.length <= 3 && workspace.description.length <= 3) {
      notify('error', 'Provide valid name and description!')
      setLoading(false)
    }

    const response = await updateWorkspace(workspace)

    if (!response.success) {
      notify('error', 'Failed to Create Workspace!')
      setLoading(false)
      return
    }

    queryClient.invalidateQueries({ queryKey: [SETUP_QUERY_KEY] })
    notify('success', 'Changes Saved!')
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:p-0">
      <div className="relative flex items-center justify-between">
        <Tabs
          className={'absolute md:w-full'}
          tabs={TABS}
          navigateTo={navigateTo}
          currentTab={currentTabIndex}
        />
        {currentTabIndex > 0 && (
          <Button className={'absolute right-0'} onClick={onOpen}>
            Create New User
          </Button>
        )}
      </div>

      <div className="mb-4">
        {currentTabIndex > 0 && <SearchOrInviteUsers />}
      </div>

      <div className="flex w-full flex-grow flex-col justify-start">
        {activeTab}
      </div>

      {/* MODALS */}
      {isOpen && (
        <CreateNewUserModal isOpen={isOpen} onOpenChange={onOpenChange} />
      )}
    </div>
  )
}

export default WorkspaceSettings
