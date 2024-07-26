'use client'
import { AddToWorkspace, Tabs } from '@/components/base'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import React from 'react'
import AllUsers from './AllUsers'
import WorkspaceMembers from './WorkspaceMembers'
import InternalGuestUsers from './InternalGuests'
import ExternalGuestUsers from './ExternalGuests'
import Search from '@/components/ui/Search'

const TABS = [
  { name: 'All Users', href: '#', current: 0 }, // ONLY THE OWNER CAN SEE ALL USER
  { name: 'Workspace Members', href: '#', current: 1 },
  { name: 'Internal Guests', href: '#', current: 2 },
  { name: 'External Guests', href: '#', current: 3 },
]

function ManagePeople() {
  const { activeTab, navigateTo, currentTabIndex } = useCustomTabsHook([
    <AllUsers key={'all-users'} />,
    <WorkspaceMembers key={'members'} />,
    <InternalGuestUsers key={'internal-guests'} />,
    <ExternalGuestUsers key={'external-guests'} />,
  ])
  return (
    <div className="flex w-full flex-col">
      <h2 className="heading-3 !font-bold tracking-tight text-gray-900 ">
        Manage People
      </h2>
      <p className=" text-sm text-slate-600">
        Manage user accounts and their workspaces
      </p>

      <div className="relative flex min-h-40 w-full flex-col justify-between gap-4 bg-primary-50 py-8 md:flex-row">
        <Search />
        <AddToWorkspace />
      </div>

      {/* 
      //TODO => A SEARCH FIELD FOR USERS
      //TODO => A FIELD TO INVITE USERS to WORKSPACE =REF: CLICK UP
      //TODO => A BUTTON TO CREATE NEW USER - ONLY FOR THE OWNER 
      */}
      <Tabs tabs={TABS} navigateTo={navigateTo} currentTab={currentTabIndex} />
      <div className="mb-4"></div>
      {activeTab}
    </div>
  )
}

export default ManagePeople
