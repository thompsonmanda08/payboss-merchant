'use client'
import { Button } from '@/components/ui/Button'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs } from '@/components/base'
import UsersTable from '../users/UsersTable'
import WorkspaceDetails from './WorkspaceDetails'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import { SearchOrInviteUsers } from '../users/ManagePeople'
import CreateNewUserModal from '../users/CreateNewUserModal'
import { useDisclosure } from '@nextui-org/react'
import useWorkspaces from '@/hooks/useWorkspaces'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import useNavigation from '@/hooks/useNavigation'
import Wallet from './Wallet'
import useAllUsersAndRoles from '@/hooks/useAllUsersAndRoles'
import { useWorkspaceMembers } from '@/hooks/useQueryHooks'
import useWorkspaceStore from '@/context/workspaceStore'
import LoadingPage from '@/app/loading'

const TABS = [
  { name: 'General', index: 0 },
  { name: 'Members', index: 1 },
  { name: 'Wallet', index: 2 }, // TODO: shows the wallet details and balances
  // { name: 'Services', index: 2 },
]

function WorkspaceSettings({ workspaceID }) {
  const { back } = useRouter()
  const { allWorkspaces } = useWorkspaces()
  const { isUserInWorkspace } = useNavigation()
  const [searchQuery, setSearchQuery] = useState('')
  const { canCreateUsers } = useAllUsersAndRoles()
  const { isEditingRole } = useWorkspaceStore()
  const { data: members } = useWorkspaceMembers(workspaceID)
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const workspaceUsers = members?.data?.users || []

  const selectedWorkspace = allWorkspaces.find(
    (workspace) => workspace.ID === workspaceID,
  )

  const userSearchResults = workspaceUsers?.filter((user) => {
    return (
      user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // ***** COMPONENT RENDERER ************** //
  const { activeTab, navigateTo, currentTabIndex } = useCustomTabsHook([
    <WorkspaceDetails
      key={'workspace-details'}
      workspaceID={workspaceID}
      workspaceName={selectedWorkspace?.workspace}
      navigateTo={handleNavigation}
    />,
    <UsersTable
      key={'members'}
      users={userSearchResults}
      workspaceID={workspaceID}
    />,
    <Wallet
      key={'wallet-details'}
      workspaceName={selectedWorkspace?.workspace}
      workspaceID={workspaceID}
      balance={selectedWorkspace?.balance}
    />,
  ])

  function handleNavigation(index) {
    navigateTo(index)
  }

  const allowUserCreation =
    currentTabIndex == 1 && canCreateUsers && !isUserInWorkspace

  return !selectedWorkspace ? (
    <LoadingPage />
  ) : (
    <>
      <div className="relative lg:-left-5">
        <Button
          aria-label="back"
          color="light"
          className={'text-primary sm:w-auto sm:max-w-fit'}
          onClick={() => back()}
        >
          <ArrowUturnLeftIcon className="h-5 w-5" /> Return to Workspaces
        </Button>
      </div>
      {/* HEADER */}
      <div className="mb-5">
        <h2 className="heading-4 !font-bold uppercase tracking-tight text-gray-900">
          {selectedWorkspace?.workspace} Workspace Settings
        </h2>
        <p className=" text-sm text-slate-600">
          Workspaces provide a structured way to group and manage services,
          users, and transactions effectively.
        </p>
      </div>
      {/* <CardHeader
        title={selectedWorkspace?.workspace}
        infoText={selectedWorkspace?.description}
      /> */}

      {/* CONTENT */}
      <div className="flex flex-col gap-4 px-4 lg:p-0">
        <div className="relative flex items-center justify-between">
          <Tabs
            className={'absolute md:w-full'}
            tabs={TABS}
            navigateTo={navigateTo}
            currentTab={currentTabIndex}
          />

          {allowUserCreation && (
            <Button className={'absolute right-0'} onClick={onOpen}>
              Create New User
            </Button>
          )}
        </div>

        <div className="mb-4">
          {currentTabIndex == 1 && (
            <SearchOrInviteUsers setSearchQuery={setSearchQuery} />
          )}
        </div>

        <div className="flex w-full flex-grow flex-col justify-start">
          {activeTab}
        </div>

        {/* MODALS */}
        <CreateNewUserModal
          isOpen={isEditingRole || isOpen}
          onClose={onClose}
          onOpenChange={onOpenChange}
        />
      </div>
    </>
  )
}

export default WorkspaceSettings
