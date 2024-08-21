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
import useAccountProfile from '@/hooks/useProfileDetails'
import useNavigation from '@/hooks/useNavigation'
import Wallet from './Wallet'
import useAllUsersAndRoles from '@/hooks/useAllUsersAndRoles'
import { useWorkspaceMembers } from '@/hooks/useQueryHooks'

const TABS = [
  { name: 'General', index: 0 },
  { name: 'Members', index: 1 },
  { name: 'Wallet', index: 2 }, // TODO: shows the wallet details and balances
  // { name: 'Services', index: 2 },
]

function WorkspaceSettings({ workspaceID }) {
  const { back } = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  // const { user } = useAccountProfile()
  const { isUserInWorkspace } = useNavigation()
  const { isOwner, isAccountAdmin } = useAccountProfile()
  // const { allUsers } = useAllUsersAndRoles()

  const { allWorkspaces } = useWorkspaces()
  const { data: members } = useWorkspaceMembers(workspaceID)

  const workspaceUsers = members?.data?.users || []

  const selectedWorkspace = allWorkspaces.find(
    (workspace) => workspace.ID === workspaceID,
  )

  const userSearchResults = workspaceUsers?.filter((user) => {
    return (
      user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.name.toLowerCase().includes(searchQuery.toLowerCase())
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
    <Wallet key={'wallet-details'} />,
  ])

  function handleNavigation(index) {
    navigateTo(index)
  }

  const allowUserCreation =
    currentTabIndex == 1 && (isOwner || isAccountAdmin) && !isUserInWorkspace

  return (
    <>
      <div className="relative lg:-left-5">
        <Button
          aria-label="back"
          color="light"
          className={'text-primary sm:w-auto sm:max-w-fit'}
          onClick={() => back()}
          // as={Link}
          // href={'/manage-account/workspaces'}
        >
          <ArrowUturnLeftIcon className="h-5 w-5" /> Return to Workspaces
        </Button>
      </div>
      {/* HEADER */}
      <div className="mb-5">
        <h2 className="heading-3  !font-bold tracking-tight text-gray-900">
          {selectedWorkspace?.workspace || 'Workspace Settings'}
        </h2>
        <p className=" text-sm text-slate-600">
          {selectedWorkspace?.description ||
            'Workspaces provide a structured way to group and manage services, users, and transactions effectively.'}
        </p>
      </div>

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
        {isOpen && (
          <CreateNewUserModal isOpen={isOpen} onOpenChange={onOpenChange} />
        )}
      </div>
    </>
  )
}

export default WorkspaceSettings
