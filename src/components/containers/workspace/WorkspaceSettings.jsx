'use client'
import { Button } from '@/components/ui/Button'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Tabs from '@/components/elements/Tabs'
import UsersTable from '../tables/UsersTable'
import WorkspaceDetails from './WorkspaceDetails'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import { SearchOrInviteUsers } from '../users/ManagePeople'
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
import useNavigation from '@/hooks/useNavigation'
import Wallet from './Wallet'
import useAllUsersAndRoles from '@/hooks/useAllUsersAndRoles'
import { useWorkspaceMembers } from '@/hooks/useQueryHooks'
import useWorkspaceStore from '@/context/workspaceStore'
import LoadingPage from '@/app/loading'
import { cn } from '@/lib/utils'
import useDashboard from '@/hooks/useDashboard'
import Card from '@/components/base/Card'
import ActivePockets from './ActivePockets'

const TABS = [
  { name: 'General Settings', index: 0, icon: WrenchScrewdriverIcon },
  { name: 'Workspace Members', index: 1, icon: UserGroupIcon },
  { name: 'Wallet Deposits', index: 2, icon: WalletIcon },
  { name: 'Active Pockets', index: 3, icon: BanknotesIcon },
]

function WorkspaceSettings({ workspaceID }) {
  const { back } = useRouter()
  const { allWorkspaces, activeWorkspace } = useWorkspaces()
  const { isUserInWorkspace, isUsersRoute } = useNavigation()
  const [searchQuery, setSearchQuery] = useState('')
  const { canCreateUsers, isAdminOrOwner } = useAllUsersAndRoles()
  const { isEditingRole, setExistingUsers, existingUsers } = useWorkspaceStore()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const { data: members, isLoading: usersLoading } =
    useWorkspaceMembers(workspaceID)

  const { workspaceUserRole, isLoading: initLoading } = useDashboard()
  const canUpdate = workspaceUserRole?.role?.toLowerCase() == 'admin'
  const isAdmin =
    (isUsersRoute && isAdminOrOwner) || (!isUsersRoute && canUpdate)

  const workspaceUsers = members?.data?.users || []
  const tableLoading = initLoading || usersLoading

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

  // ******************* COMPONENT RENDERER ************************** //
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
      isUserAdmin={isAdmin}
      tableLoading={tableLoading}
      removeWrapper
    />,
    <Wallet
      key={'wallet-details'}
      workspaceName={selectedWorkspace?.workspace}
      workspaceID={workspaceID}
      balance={selectedWorkspace?.balance}
      removeWrapper
    />,
    <ActivePockets
      key={'wallet-pocket'}
      workspaceID={workspaceID}
      removeWrapper={true}
    />,
  ])

  function handleNavigation(index) {
    navigateTo(index)
  }

  useEffect(() => {
    // UPDATE EXISITING USERS LIST
    if (workspaceUsers && !existingUsers.length) {
      setExistingUsers(workspaceUsers)
    }
  }, [])

  const allowUserCreation =
    currentTabIndex == 1 && canCreateUsers && !isUserInWorkspace

  return (!selectedWorkspace && !isUserInWorkspace) || !activeWorkspace ? (
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
        isOpen={isEditingRole || isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
      />
    </div>
  )
}

export default WorkspaceSettings
