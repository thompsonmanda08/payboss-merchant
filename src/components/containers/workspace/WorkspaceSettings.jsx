'use client'
import { Button } from '@/components/ui/Button'
import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Tabs from '@/components/elements/Tabs'
import WorkspaceDetails from './WorkspaceDetails'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import CreateNewUserModal from '../users/CreateNewUserModal'
import { useDisclosure } from '@nextui-org/react'
import useWorkspaces from '@/hooks/useWorkspaces'
import {
  ArrowUturnLeftIcon,
  BanknotesIcon,
  UserGroupIcon,
  WalletIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import Wallet from './Wallet'
import useAllUsersAndRoles from '@/hooks/useAllUsersAndRoles'
import { useWorkspaceMembers } from '@/hooks/useQueryHooks'
import LoadingPage from '@/app/loading'
import { cn } from '@/lib/utils'
import Card from '@/components/base/Card'
import ActivePockets from './ActivePockets'
import WorkspaceMembers from './WorkspaceMembers'
import { WORKSPACE_TYPES } from '@/lib/constants'

function WorkspaceSettings({ workspaceID }) {
  const { back } = useRouter()
  const pathname = usePathname()

  const { allWorkspaces } = useWorkspaces()
  const { canCreateUsers } = useAllUsersAndRoles()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const isUserInWorkspace =
    pathname.split('/')[1] == 'dashboard' && pathname.split('/').length >= 3

  const { data: members, isLoading } = useWorkspaceMembers(workspaceID)

  const workspaceUsers = members?.data?.users || []

  const selectedWorkspace = allWorkspaces.find(
    (workspace) => workspace.ID === workspaceID,
  )

  const DISBURESEMENT_TABS =
    selectedWorkspace?.workspaceType == WORKSPACE_TYPES[1]?.ID ||
    selectedWorkspace?.workspaceType == WORKSPACE_TYPES[2]?.ID
      ? [
          { name: 'Active Pockets', index: 2, icon: BanknotesIcon },
          { name: 'Wallet Deposits', index: 3, icon: WalletIcon },
        ]
      : []

  const TABS = [
    { name: 'General Settings', index: 0, icon: WrenchScrewdriverIcon },
    { name: 'Workspace Members', index: 1, icon: UserGroupIcon },
    ...DISBURESEMENT_TABS,
  ]

  // Components to be rendered for the workspace type
  const DISBURSMENT_COMPONENTS =
    selectedWorkspace?.workspaceType == WORKSPACE_TYPES[1]?.ID ||
    selectedWorkspace?.workspaceType == WORKSPACE_TYPES[2]?.ID
      ? [
          <ActivePockets
            key={'active-wallet-pocket'}
            workspaceID={workspaceID}
            removeWrapper={true}
          />,
          <Wallet
            key={'wallet'}
            workspaceName={selectedWorkspace?.workspace}
            workspaceID={workspaceID}
            balance={selectedWorkspace?.balance}
            removeWrapper
          />,
        ]
      : []

  // ******************* COMPONENT RENDERER ************************** //
  const { activeTab, navigateTo, currentTabIndex } = useCustomTabsHook([
    <WorkspaceDetails
      key={'workspace-details'}
      workspaceID={workspaceID}
      workspaceName={selectedWorkspace?.workspace}
      navigateTo={handleNavigation}
      workspaceUsers={workspaceUsers}
    />,
    <WorkspaceMembers
      key={'members'}
      workspaceUsers={workspaceUsers}
      workspaceName={selectedWorkspace?.workspace}
      workspaceID={workspaceID}
      isLoading={isLoading}
    />,
    // Provides the disbursement tabs
    ...DISBURSMENT_COMPONENTS,
  ])

  function handleNavigation(index) {
    navigateTo(index)
  }

  const allowUserCreation =
    currentTabIndex == 1 && canCreateUsers && !isUserInWorkspace

  return !selectedWorkspace || isLoading ? (
    <LoadingPage />
  ) : (
    <div className={cn('px-2', { 'px-3': isUserInWorkspace })}>
      {!isUserInWorkspace && (
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
      )}
      {/* HEADER */}
      <div className={cn('', { 'mb-4': isUserInWorkspace })}>
        <h2 className="heading-5 !font-bold uppercase tracking-tight text-gray-900">
          {selectedWorkspace?.workspace}
        </h2>
        <p className=" text-sm text-slate-600">
          Workspaces provide a structured way to group and manage services,
          users, and transactions effectively.
        </p>
      </div>

      {/* CONTENT */}

      <Card className={'gap-4'}>
        <div className="relative mb-2 flex items-center justify-between">
          <Tabs
            className={' md:w-full'}
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

        {/* <div className="">
            {currentTabIndex == 1 && (
              <SearchOrInviteUsers setSearchQuery={setSearchQuery} />
            )}
          </div> */}

        <div className="flex w-full flex-grow flex-col justify-start">
          {activeTab}
        </div>
      </Card>

      {/* MODALS */}
      <CreateNewUserModal
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
      />
    </div>
  )
}

export default WorkspaceSettings
